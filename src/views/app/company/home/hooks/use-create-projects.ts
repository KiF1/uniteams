import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

interface CreateProjectPayload {
  nome: string;
  foto?: string;
  prazo: string;
  valor: number;
  empresa_id: string;
  status?: string;
  descricao?: string;
}

const allowedStatus = [
  "aberto",
  "em_andamento",
  "finalizado",
  "cancelado",
  "aguardando_inicio",
];

export const useCreateProject = () => {
  const mutation = useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const status = payload.status || "aberto";

      if (!allowedStatus.includes(status)) {
        throw new Error("Status inválido");
      }

      const { data, error } = await supabase.from("vagas").insert([
        {
          nome: payload.nome,
          foto: payload.foto || null,
          prazo: payload.prazo,
          valor: payload.valor,
          empresa_id: payload.empresa_id,
          status,
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
