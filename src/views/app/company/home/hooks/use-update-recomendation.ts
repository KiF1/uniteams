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

      if (status === "aprovada") {
        if (!data.nome_responsavel || !data.email_responsavel || !data.cargo_responsavel) {
          throw new Error("Dados do responsável são obrigatórios para aprovação");
        }
        updateData.nome_responsavel = data.nome_responsavel;
        updateData.email_responsavel = data.email_responsavel;
        updateData.cargo_responsavel = data.cargo_responsavel;
        updateData.descricao = data.descricao || null;
      }

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

      return updated;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["recommendationRequests"] });

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
