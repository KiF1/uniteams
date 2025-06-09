import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

export interface VagaAberta {
  id: string;
  nome: string;
  foto?: string;
  prazo?: string;
  valor?: number;
  descricao?: string;
  status: string;
  created_at: string;
  updated_at: string;
  empresa_id: string;
}

export function useFetchVagasAbertasEmpresa(empresaId: string) {
  return useQuery<VagaAberta[]>({
    queryKey: ["vagas-abertas-empresa", empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vagas")
        .select("id, nome, foto, prazo, valor, descricao, status, created_at, updated_at, empresa_id")
        .eq("empresa_id", empresaId)
        .eq("status", "aberto")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!empresaId,
    staleTime: 5 * 60 * 1000,
  });
}
