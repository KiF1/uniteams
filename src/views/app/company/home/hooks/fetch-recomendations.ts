import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

interface Aplicacao {
  id: string;
  vaga_id: string;
  estudante_id: string;
  status: string;
  created_at: string;
}

export function useFetchAplicacoesEmpresa(empresaId: string) {
  return useQuery<Aplicacao[]>({
    queryKey: ['aplicacoes-empresa', empresaId],
    queryFn: async () => {
      // Busca todas as vagas da empresa
      const { data: vagas, error: vagasError } = await supabase
        .from('vagas')
        .select('id')
        .eq('empresa_id', empresaId);

      if (vagasError) throw new Error('Erro ao buscar vagas: ' + vagasError.message);
      if (!vagas || vagas.length === 0) return [];

      const vagasIds = vagas.map(v => v.id);

      // Busca todas as aplicações para essas vagas
      const { data: aplicacoes, error: aplicacoesError } = await supabase
        .from('aplicacoes')
        .select('id, vaga_id, estudante_id, status, created_at')
        .in('vaga_id', vagasIds);
      console.log('aplicacoes', aplicacoes);
      if (aplicacoesError) throw new Error('Erro ao buscar aplicações: ' + aplicacoesError.message);
      return aplicacoes || [];
    }
  });
}
