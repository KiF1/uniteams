import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

export interface RecommendationData {
  equipe_id: string;
  nome_responsavel: string;
  email_responsavel: string;
  cargo_responsavel: string;
  descricao?: string;
}

export function useUpdateRecommendation() {
  return useMutation({
    mutationFn: async (data: RecommendationData) => {
      const { error } = await supabase
        .from("recomendacoes")
        .insert([data]);

      if (error) {
        throw error;
      }

      return true;
    },
  });
}
