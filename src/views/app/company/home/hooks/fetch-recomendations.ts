import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

interface Team {
  id: string;
  nome: string;
  foto: string;
  email: string;
  created_at: string;
  descricao: string;
  status: 'pendente' | 'aprovada' | 'recusada';
  updated_at: string;
}

interface Metrics {
  total: number;
  pendentes: number;
  aprovadas: number;
  recusadas: number;
}

interface UseFetchRecommendationsParams {
  page?: number;
  perPage?: number;
  status?: 'todas' | 'pendente' | 'aprovada' | 'recusada';
}

interface UseFetchRecommendationsReturn {
  teams: Team[];
  metrics: Metrics;
  isLoading: boolean;
  error: Error | null;
}

export const useFetchRecommendations = ({
  page = 1,
  perPage = 10,
  status = 'todas'
}: UseFetchRecommendationsParams = {}): UseFetchRecommendationsReturn => {
  const universidadeId = sessionStorage.getItem('userId');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["recommendations", universidadeId, page, perPage, status],
    queryFn: async () => {
      if (!universidadeId) {
        throw new Error("ID da universidade não encontrado");
      }

      const { data: metricsData, error: metricsError } = await supabase
        .from("recomendacoes_universidade")
        .select("status", { count: 'exact' })
        .eq("universidade_id", universidadeId);

      if (metricsError) {
        throw new Error(`Erro ao buscar métricas: ${metricsError.message}`);
      }

      // Calculate metrics
      const metrics: Metrics = {
        total: metricsData?.length || 0,
        pendentes: metricsData?.filter(item => item.status === 'pendente').length || 0,
        aprovadas: metricsData?.filter(item => item.status === 'aprovada').length || 0,
        recusadas: metricsData?.filter(item => item.status === 'recusada').length || 0,
      };

      // Build the query for recommendations based on filters
      let query = supabase
        .from("recomendacoes_universidade")
        .select(`
          equipe_id,
          status,
          updated_at
        `)
        .eq("universidade_id", universidadeId);

      // Apply status filter if not showing all
      if (status !== 'todas') {
        query = query.eq("status", status);
      }

      // Apply pagination and sorting
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data: recomendacoesData, error: recomendacoesError } = await query
        .order("updated_at", { ascending: false })
        .range(from, to);
              
      if (recomendacoesError) {
        throw new Error(`Erro ao buscar recomendações: ${recomendacoesError.message}`);
      }
        
      if (!recomendacoesData || recomendacoesData.length === 0) {
        return { teams: [], metrics };
      }

      // Get team IDs from recommendations
      const equipeIds = recomendacoesData.map(rec => rec.equipe_id);

      // Fetch team details
      const { data: equipesData, error: equipesError } = await supabase
        .from("equipes")
        .select(`
          id,
          nome,
          foto,
          email,
          created_at,
          descricao
        `)
        .in("id", equipeIds);

      if (equipesError) {
        throw new Error(`Erro ao buscar detalhes das equipes: ${equipesError.message}`);
      }

      if (!equipesData || equipesData.length === 0) {
        return { teams: [], metrics };
      }

      // Map recommendations to team data with status and updated_at
      const teams: Team[] = equipesData.map(equipe => {
        const recomendacao = recomendacoesData.find(rec => rec.equipe_id === equipe.id);
        return {
          ...equipe,
          status: recomendacao?.status as 'pendente' | 'aprovada' | 'recusada',
          updated_at: recomendacao?.updated_at || new Date().toISOString(),
        };
      });

      // Sort teams by updated_at as originally intended
      teams.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        
      return { teams, metrics };
    },
    enabled: !!universidadeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    teams: data?.teams || [],
    metrics: data?.metrics || { total: 0, pendentes: 0, aprovadas: 0, recusadas: 0 },
    isLoading,
    error: error as Error | null,
  };
};