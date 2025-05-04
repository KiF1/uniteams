import { supabase } from "@/services/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateRecommendationData {
  equipe_id: string;
  nome_responsavel?: string;
  email_responsavel?: string;
  cargo_responsavel?: string;
  descricao?: string;
}

export const useUpdateRecommendation = (status: 'aprovada' | 'recusada') => {
  const queryClient = useQueryClient();
  const universidadeId = sessionStorage.getItem('userId');

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateRecommendationData) => {
      if (!universidadeId) {
        throw new Error("ID da universidade não encontrado");
      }

      const timestamp = new Date().toISOString();
      
      // Prepara os dados para atualização
      const updateData: any = {
        status: status,
        updated_at: timestamp,
      };

      // Se for aprovada, adiciona os dados adicionais obrigatórios
      if (status === 'aprovada') {
        if (!data.nome_responsavel || !data.email_responsavel || !data.cargo_responsavel) {
          throw new Error("Dados do responsável são obrigatórios para aprovação");
        }

        updateData.nome_responsavel = data.nome_responsavel;
        updateData.email_responsavel = data.email_responsavel;
        updateData.cargo_responsavel = data.cargo_responsavel;
        updateData.descricao = data.descricao || null;
      }

      // Atualiza a recomendação existente
      const { data: updatedRecommendation, error: updateError } = await supabase
        .from("recomendacoes_universidade")
        .update(updateData)
        .eq("universidade_id", universidadeId)
        .eq("equipe_id", data.equipe_id)
        .eq("status", "pendente") // Garante que só atualiza se estiver pendente
        .select()
        .single();

      if (updateError) {
        throw new Error(`Erro ao atualizar recomendação: ${updateError.message}`);
      }

      if (!updatedRecommendation) {
        throw new Error("Nenhuma recomendação pendente encontrada para esta equipe");
      }

      return updatedRecommendation;
    },

    onSuccess: () => {
      // Invalidate and refetch recommendations data
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["recommendationRequests"] });
      
      if (status === 'aprovada') {
        toast.success("Recomendação aprovada com sucesso!", {
          description: "A equipe foi recomendada pela universidade.",
          classNames: {
            title: "text-green-500",
            icon: "group-data-[type=success]:text-green-500",
          },
        });
      } else {
        toast.success("Recomendação rejeitada com sucesso!", {
          description: "A equipe foi rejeitada pela universidade.",
          classNames: {
            title: "text-green-500",
            icon: "group-data-[type=success]:text-green-500",
          },
        });
      }
    },

    onError: (error) => {
      const action = status === 'aprovada' ? 'aprovar' : 'rejeitar';
      toast.error(`Erro ao ${action} recomendação`, {
        description: error.message || `Não foi possível ${action} a recomendação.`,
        classNames: {
          title: "text-red-500",
          icon: "group-data-[type=error]:text-red-500",
        },
      });
    },
  });

  return { mutate, isPending };
};