import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { VagaAberta } from "./fetch-projects";

export function useUpdateVaga() {
  const queryClient = useQueryClient();

  // Atualizar vaga
  const update = useMutation({
    mutationFn: async (vaga: Partial<VagaAberta> & { id: string }) => {
      const { id, ...rest } = vaga;
      const { error } = await supabase
        .from("vagas")
        .update(rest)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas-abertas-empresa"] });
    },
  });

  // Deletar vaga
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vagas")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vagas-abertas-empresa"] });
    },
  });

  return { update, remove };
}
