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
  const empresaId = sessionStorage.getItem('userId');

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateRecommendationData) => {
      if (!empresaId) {
        throw new Error("ID da empresa não encontrado");
      }

      const timestamp = new Date().toISOString();

      const updateData: any = {
        status,
        updated_at: timestamp,
      };

      // Não exige mais dados de responsável para aprovação
      // Apenas atualiza o status

      // Busca a aplicação para obter o vaga_id
      const { data: aplicacao, error: fetchError } = await supabase
        .from("aplicacoes")
        .select("vaga_id")
        .eq("id", data.equipe_id)
        .maybeSingle();

      if (fetchError || !aplicacao) {
        throw new Error("Não foi possível encontrar a aplicação para atualizar.");
      }

      // Atualiza a aplicação selecionada
      const { data: updated, error } = await supabase
        .from("aplicacoes")
        .update(updateData)
        .eq("id", data.equipe_id)
        .eq("status", "pendente")
        .select()
        .maybeSingle();

      if (error) {
        throw new Error(`Erro ao atualizar recomendação: ${error.message}`);
      }

      if (!updated) {
        throw new Error("Nenhuma recomendação pendente encontrada para esta equipe.");
      }

      // Se for aprovação, recusa as outras aplicações da mesma vaga e fecha a vaga
      if (status === "aprovada") {
        await supabase
          .from("aplicacoes")
          .update({ status: "recusada", updated_at: timestamp })
          .eq("vaga_id", aplicacao.vaga_id)
          .neq("id", data.equipe_id)
          .eq("status", "pendente");

        // Atualiza o status da vaga para "finalizado"
        await supabase
          .from("vagas")
          .update({ status: "finalizado", updated_at: timestamp })
          .eq("id", aplicacao.vaga_id);
      }

      return updated;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["recommendationRequests"] });
      queryClient.invalidateQueries(); // força atualização de todos os dados relacionados

      if (status === "aprovada") {
        toast.success("Indicação contratada com sucesso!", {
          description: "A equipe foi contratada pela empresa.",
          classNames: {
            title: "text-green-500",
            icon: "group-data-[type=success]:text-green-500",
          },
        });
      } else {
        toast.success("Indicação recusada com sucesso!", {
          description: "A equipe foi recusada pela empresa.",
          classNames: {
            title: "text-green-500",
            icon: "group-data-[type=success]:text-green-500",
          },
        });
      }
    },

    onError: (error) => {
      const action = status === "aprovada" ? "contratar" : "recusar";
      toast.error(`Erro ao ${action} indicação`, {
        description: error.message || `Não foi possível ${action} a indicação.`,
        classNames: {
          title: "text-red-500",
          icon: "group-data-[type=error]:text-red-500",
        },
      });
    },
  });

  return { mutate, isPending };
};
