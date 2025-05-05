import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

interface CreateProjectPayload {
  nome: string;
  foto?: string;
  prazo: string;
  valor: number;
  empresa_id: string;
  equipe_id: string;
  status?: string;
  descricao?: string;
}

export const useCreateProject = () => {
  const mutation = useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const { data, error } = await supabase.from("projetos").insert([
        {
          nome: payload.nome,
          foto: payload.foto || null,
          prazo: payload.prazo,
          valor: payload.valor,
          empresa_id: payload.empresa_id,
          equipe_id: payload.equipe_id,
          status: payload.status || "pendente",
          descricao: payload.descricao || null,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return mutation;
};
