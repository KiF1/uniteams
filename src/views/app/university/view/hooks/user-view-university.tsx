import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

interface University {
  id: string;
  nome: string;
  foto: string;
  email: string;
  descricao: string;
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
  };
  telefone: string;
}

interface Team {
  id: string;
  nome: string;
  foto: string;
  email: string;
  telefone: string;
  created_at: string;
  descricao: string;
  updated_at: string;
}

export const useViewUniversity = (universityId: string) => {
  return useQuery<University>({
    queryKey: ["university", universityId],
    queryFn: async () => {
      if (!universityId) {
        throw new Error("ID da universidade não fornecido");
      }

      // Busca os dados da universidade
      const { data: universityData, error: universityError } = await supabase
        .from("universidades")
        .select('*')
        .eq("id", universityId)
        .single();

      if (universityError) {
        throw new Error(`Erro ao buscar universidade: ${universityError.message}`);
      }

      if (!universityData) {
        throw new Error("Universidade não encontrada");
      }

      return {
        ...universityData,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!universityId,
  });
};

// Interface para resposta paginada
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Função para buscar equipes recomendadas com paginação
export const useRecommendedTeams = (
  universityId: string, 
  page: number = 1, 
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<Team>>({
    queryKey: ["university", universityId, page],
    queryFn: async () => {
      if (!universityId) {
        throw new Error("ID da universidade não fornecido");
      }

      const offset = (page - 1) * limit;

      const { data: recommendedTeamsData, count: total } = await supabase
        .from("recomendacoes_universidade")
        .select("equipe_id, updated_at", { count: 'exact' })
        .eq("universidade_id", universityId)
        .eq("status", "aprovada")
        .order("updated_at", { ascending: false })
        .range(offset, offset + limit - 1);

      // Depois fazer uma segunda consulta para as equipes
      const equipeIds = recommendedTeamsData?.map(rec => rec.equipe_id) || [];

      if (equipeIds.length === 0) {
        return {
          data: [],
          total: 0,
          page,
          limit,
          totalPages: 0
        };
      }

      const { data: equipesData } = await supabase
        .from("equipes")
        .select("*")
        .in("id", equipeIds);

      // Combinar as equipes com os dados de updated_at
      const teams: Team[] = recommendedTeamsData?.map(rec => {
        const equipe = equipesData?.find(e => e.id === rec.equipe_id);
        return equipe ? {
          ...equipe,
          updated_at: rec.updated_at
        } : null;
      }).filter(Boolean) || [];

      return {
        data: teams,
        total: total || 0,
        page,
        limit,
        totalPages: Math.ceil((total || 0) / limit)
      };
    },
    staleTime: 10 * 60 * 1000, // 1 minuto
    enabled: !!universityId,
  });
};