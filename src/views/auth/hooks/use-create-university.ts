import { supabase } from "@/services/supabase";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface Endereco {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
}

interface University {
  nome: string;
  email: string;
  foto?: File;
  cnpj: string;
  telefone: string;
  endereco: Endereco;
  descricao?: string;
  senha: string;
  confirmarSenha: string;
}

export const useRegisterUniversity = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (dataForm: University) => {
      const { data: existingData, error: checkError } = await supabase
        .from("universidades")
        .select("cnpj, telefone")
        .or(`cnpj.eq.${dataForm.cnpj},telefone.eq.${dataForm.telefone}`);

      if (checkError) {
        throw new Error(checkError.message || "Erro ao verificar dados existentes.");
      }

      // Se encontrou dados existentes, verificar qual campo está duplicado
      if (existingData && existingData.length > 0) {
        const duplicatedCnpj = existingData.some(item => item.cnpj === dataForm.cnpj);
        const duplicatedPhone = existingData.some(item => item.telefone === dataForm.telefone);

        if (duplicatedCnpj) {
          throw new Error("Este CNPJ já está cadastrado no sistema.");
        }
        if (duplicatedPhone) {
          throw new Error("Este telefone já está cadastrado no sistema.");
        }
      }
      
      // Verificar duplicidade de email na tabela usuarios
      const { data: existingUsers } = await supabase
        .from("usuarios")
        .select("email")
        .eq("email", dataForm.email);
        
      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Este email já está cadastrado no sistema.");
      }

      let userId: string;
      let uploadedFilePath: string | null = null;
      let photoUrl: string | null = null;

      // 1. Criar o usuário no Supabase Auth
      const { data: userCreated, error: errorUser } = await supabase.auth.signUp({
        email: dataForm.email,
        password: dataForm.senha,
      });

      if (userCreated?.user) {
        userId = userCreated.user.id;
      } else if (errorUser?.message?.includes("User already registered")) {
        // Usuário já existe: tenta logar para recuperar o ID
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: dataForm.email,
          password: dataForm.senha,
        });

        if (loginError || !loginData.user) {
          throw new Error("Usuário já existe. Use a senha correta para continuar.");
        }

        userId = loginData.user.id;
      } else {
        throw new Error(errorUser?.message || "Erro ao criar o usuário.");
      }

      try {
        // 2. Upload da foto (se houver)
        if (dataForm.foto) {
          const uuid = uuidv4();
          const ext = dataForm.foto.name.split(".").pop();
          const fileName = `${uuid}.${ext}`;
          const filePath = `universidades/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("fotos")
            .upload(filePath, dataForm.foto, { upsert: true });

          if (uploadError) {
            throw new Error(uploadError.message || "Erro ao enviar a foto.");
          }

          uploadedFilePath = filePath;
          photoUrl = uploadData.fullPath;
        }

        // 3. Criar registro na tabela usuarios
        const { data: usuario, error: errorUsuario } = await supabase
          .from("usuarios")
          .insert({
            id: userId,
            email: dataForm.email,
            tipo_usuario: "universidade"
          })
          .select("id")
          .single();

        if (errorUsuario || !usuario) {
          throw new Error(errorUsuario?.message || "Erro ao criar o usuário na tabela.");
        }

        // 4. Criar registro na tabela universidades
        const { data: universidade, error: errorUniversidade } = await supabase
          .from("universidades")
          .insert({
            id: userId,
            nome: dataForm.nome,
            cnpj: dataForm.cnpj,
            email: dataForm.email,
            telefone: dataForm.telefone,
            endereco: dataForm.endereco,
            descricao: dataForm.descricao || null,
            foto: photoUrl,
          })
          .select("id")
          .single();

        if (errorUniversidade || !universidade) {
          throw new Error(errorUniversidade?.message || "Erro ao criar a universidade.");
        }

        // 5. Armazenar na sessão
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userType", "universidade");

        return { userId, universidadeId: universidade.id };
      } catch (error) {
        // Rollback: remove a foto se enviada
        if (uploadedFilePath) {
          await supabase.storage.from("fotos").remove([uploadedFilePath]);
        }

        // Tentar remover o usuário se foi criado
        if (userId) {
          // Remover da tabela usuarios
          await supabase.from("usuarios").delete().eq("id", userId);
        }

        throw error;
      }
    },

    onSuccess: () => {
      navigate(`/app/university/dashboard`);
    },

    onError: (error) => {
      toast.error("Erro ao realizar cadastro", {
        description: error.message || "Houve um erro ao cadastrar, tente novamente mais tarde.",
        classNames: {
          title: "text-red-500",
          icon: "group-data-[type=error]:text-red-500",
        },
      });
    },
  });

  return { mutate, isPending };
};