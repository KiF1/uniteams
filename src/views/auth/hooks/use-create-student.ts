import { supabase } from "@/services/supabase";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";


interface Endereco {
  cep: string;
  estado: string;
  cidade: string;
  rua: string;
  numero: string;
  bairro: string;
}


interface Student {
  nome: string;
  email: string;
  telefone: string;
  foto?: File;
  matricula: string;
  funcao_cargo: string;
  endereco: Endereco;
  descricao?: string;
  senha: string;
  confirmarSenha: string;
}

export const useRegisterStudent = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (dataForm: Student) => {
      const { data: existingUser } = await supabase
        .from("usuarios")
        .select("email")
        .eq("email", dataForm.email)
        
      if (existingUser && existingUser.length > 0) {
        throw new Error("Este email já está cadastrado no sistema.");
      }

      const { data: existingData, error: checkError } = await supabase
        .from("estudantes")
        .select("matricula, telefone")
        .or(`matricula.eq.${dataForm.matricula},telefone.eq.${dataForm.telefone}`);

      if (checkError) {
        throw new Error(checkError.message || "Erro ao verificar dados existentes.");
      }

      if (existingData && existingData.length > 0) {
        const duplicatedMatricula = existingData.some(item => item.matricula === dataForm.matricula);
        const duplicatedPhone = existingData.some(item => item.telefone === dataForm.telefone);

        if (duplicatedMatricula) {
          throw new Error("Esta matrícula já está cadastrada no sistema.");
        }
        if (duplicatedPhone) {
          throw new Error("Este telefone já está cadastrado no sistema.");
        }
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
          const filePath = `estudantes/${fileName}`;

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
            tipo_usuario: "estudante"
          })
          .select("id")
          .single();

        if (errorUsuario || !usuario) {
          throw new Error(errorUsuario?.message || "Erro ao criar o usuário na tabela.");
        }

        // 4. Criar registro na tabela estudantes
        const { data: estudante, error: errorEstudante } = await supabase
          .from("estudantes")
          .insert({
            id: userId,
            nome: dataForm.nome,
            telefone: dataForm.telefone,
            matricula: dataForm.matricula,
            funcao_cargo: dataForm.funcao_cargo,
            endereco: {
              cep: dataForm.endereco.cep,
              estado: dataForm.endereco.estado,
              cidade: dataForm.endereco.cidade,
              rua: dataForm.endereco.rua,
              numero: dataForm.endereco.numero,
              bairro: dataForm.endereco.bairro
            },
            descricao: dataForm.descricao || null,
            foto: photoUrl
          })
          .select("id")
          .single();

        if (errorEstudante || !estudante) {
          throw new Error(errorEstudante?.message || "Erro ao criar o estudante.");
        }

        // 5. Armazenar na sessão
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userType", "estudante");

        return { userId };
      } catch (error) {
        // Rollback: remove a foto se enviada
        if (uploadedFilePath) {
          await supabase.storage.from("fotos").remove([uploadedFilePath]);
        }

        // Tentar remover o usuário se foi criado
        if (userId) {
          // Remover da tabela usuarios
          await supabase.from("usuarios").delete().eq("id", userId);
          
          // Não é possível excluir diretamente do Auth no cliente,
          // mas você poderia implementar uma função no servidor para isso
        }

        throw error;
      }
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