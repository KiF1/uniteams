import { queryClient } from "@/services/react-query";
import { supabase } from "@/services/supabase";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface University {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  cnpj: string;
  telefone: string;
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
  }
  descricao: string | null;
}

interface EditUniversityData {
  id: string;
  nome: string;
  email: string;
  foto?: File | string;
  cnpj: string;
  telefone: string;
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
  }
  descricao?: string;
}

// Função para atualizar dados da universidade
export const useUpdateUniversity = () => {
  return useMutation({
    mutationFn: async (data: EditUniversityData) => {
      const { id, foto, ...fieldsToUpdate } = data;
      let photoUrl = typeof foto === "string" ? foto : undefined;

      // Busca os dados atuais da universidade no cache
      const cachedUniversity = queryClient.getQueryData<University>(["university", id]);

      // Se uma nova foto foi enviada, faz o upload
      if (foto instanceof File && cachedUniversity) {
        let filePath = null;

        if(cachedUniversity.foto){
          // Extrai o caminho da foto atual para substituir
          const pathToDelete = cachedUniversity.foto.replace("fotos/", "");
          filePath = pathToDelete;
        } else {
          // Se não tiver foto, cria um novo caminho
          const uuid = uuidv4();
          const fileExt = foto.name.split(".").pop();
          const fileName = `${uuid}.${fileExt}`;
          filePath = `universidades/${fileName}`;
        }
        console.log(filePath, 'path')

        // Realiza upload da nova foto (Supabase sobrescreve automaticamente)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("fotos")
          .upload(filePath, foto, { upsert: true });

        if (uploadError) throw new Error("Erro ao fazer upload da logo");

        photoUrl = uploadData.fullPath;
      }

      // Atualiza os dados da universidade
      const { data: updatedUniversity, error: updateError } = await supabase
        .from("universidades")
        .update({ 
          ...fieldsToUpdate, 
          foto: photoUrl,
          updated_at: new Date().toISOString() 
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw new Error("Erro ao atualizar a universidade");

      return { university: updatedUniversity, photoUrl };
    },

    onSuccess: ({ university, photoUrl }) => {
      toast.success("Universidade atualizada com sucesso!", {
        classNames: {
          title: "text-primary",
          icon: "group-data-[type=success]:text-primary",
        }
      });

      // Atualiza os dados no cache em vez de refazer o fetch
      const cachedData = queryClient.getQueryData<University>(["university", university.id]);

      if (cachedData) {
        queryClient.setQueryData(["university", university.id], {
          ...cachedData,
          ...university,
          foto: photoUrl || cachedData.foto,
        });
      }

      // Invalida a lista de universidades para atualizar
      queryClient.invalidateQueries({ queryKey: ["universities"] });
    },

    onError: (error) => {
      toast.error("Erro ao atualizar a universidade", {
        description: error.message,
        classNames: {
          title: "text-red-500",
          icon: "group-data-[type=error]:text-red-500",
        }
      });
    },
  });
};
