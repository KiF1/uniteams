/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

interface Application {
  id: string;
  nome: string; // nome da vaga
  foto: string; // foto da vaga
  created_at: string; // data de criação da aplicação
  status: 'pendente' | 'aprovada' | 'recusada';
  updated_at: string;
  vaga_id: string;
  estudante_id: string;
  // Dados adicionais da vaga
  valor?: number;
  prazo?: string;
  descricao?: string;
  // Dados da empresa
  empresa_nome?: string;
  empresa_foto?: string;
  // Dados do estudante
  estudante_nome?: string;
  estudante_foto?: string;
}

interface Metrics {
  total: number;
  pendentes: number;
  aprovadas: number;
  recusadas: number;
}

interface UseFetchApplicationsParams {
  page?: number;
  perPage?: number;
  status?: 'todas' | 'pendente' | 'aprovada' | 'recusada';
}

interface UseFetchApplicationsReturn {
  applications: Application[];
  metrics: Metrics;
  isLoading: boolean;
  error: Error | null;
}

export const useFetchApplications = ({
  page = 1,
  perPage = 10,
  status = 'todas'
}: UseFetchApplicationsParams = {}): UseFetchApplicationsReturn => {
  const universidadeId = sessionStorage.getItem('userId');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["applications", universidadeId, page, perPage, status],
    queryFn: async () => {
      if (!universidadeId) {
        throw new Error("ID da universidade não encontrado");
      }

      // Primeiro, buscar as métricas (contagem por status)
      const { data: metricsData, error: metricsError } = await supabase
        .from("aplicacoes")
        .select("status", { count: 'exact' })
        .eq("universidade_id", universidadeId);

      if (metricsError) {
        throw new Error(`Erro ao buscar métricas: ${metricsError.message}`);
      }

      // Calcular métricas
      const metrics: Metrics = {
        total: metricsData?.length || 0,
        pendentes: metricsData?.filter(item => item.status === 'pendente').length || 0,
        aprovadas: metricsData?.filter(item => item.status === 'aprovada').length || 0,
        recusadas: metricsData?.filter(item => item.status === 'recusada').length || 0,
      };

      // Construir a query para aplicações com joins
      let query = supabase
        .from("aplicacoes")
        .select(`
          id,
          status,
          created_at,
          updated_at,
          vaga_id,
          estudante_id,
          vagas (
            id,
            nome,
            foto,
            valor,
            prazo,
            descricao,
            empresas (
              id,
              nome,
              foto
            )
          ),
          estudantes (
            id,
            nome,
            foto
          )
        `)
        .eq("universidade_id", universidadeId);

      // Aplicar filtro de status se não for 'todas'
      if (status !== 'todas') {
        query = query.eq("status", status);
      }

      // Aplicar paginação e ordenação
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data: aplicacoesData, error: aplicacoesError } = await query
        .order("created_at", { ascending: false })
        .range(from, to);
              
      if (aplicacoesError) {
        throw new Error(`Erro ao buscar aplicações: ${aplicacoesError.message}`);
      }
        
      if (!aplicacoesData || aplicacoesData.length === 0) {
        return { applications: [], metrics };
      }

      // Mapear os dados para a interface Application
      const applications: Application[] = aplicacoesData.map(aplicacao => {
        const vaga = aplicacao.vagas as any;
        const empresa = vaga?.empresas as any;
        const estudante = aplicacao.estudantes as any;

        return {
          id: aplicacao.id,
          nome: vaga?.nome || 'Vaga não encontrada',
          foto: vaga?.foto || '',
          created_at: aplicacao.created_at,
          status: aplicacao.status as 'pendente' | 'aprovada' | 'recusada',
          updated_at: aplicacao.updated_at,
          vaga_id: aplicacao.vaga_id,
          estudante_id: aplicacao.estudante_id,
          // Dados adicionais da vaga
          valor: vaga?.valor,
          prazo: vaga?.prazo,
          descricao: vaga?.descricao,
          // Dados da empresa
          empresa_nome: empresa?.nome,
          empresa_foto: empresa?.foto,
          // Dados do estudante
          estudante_nome: estudante?.nome,
          estudante_foto: estudante?.foto,
        };
      });
        
      return { applications, metrics };
    },
    enabled: !!universidadeId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    applications: data?.applications || [],
    metrics: data?.metrics || { total: 0, pendentes: 0, aprovadas: 0, recusadas: 0 },
    isLoading,
    error: error as Error | null,
  };
};