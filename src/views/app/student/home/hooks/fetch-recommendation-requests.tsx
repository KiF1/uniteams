 
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

// Define types for our data
interface Member {
  id: string;
  nome: string;
  foto: string;
  funcao_cargo: string;
  telefone: string;
}

interface Team {
  id: string;
  nome: string;
  foto: string;
  created_at: string;
  descricao: string;
  membros: Member[];
}

export const useFetchRecommendationRequests = () => {
  // Get university ID from sessionStorage
  const universidadeId = sessionStorage.getItem('userId');
  
  return useQuery<Team[]>({
    queryKey: ["recommendationRequests", universidadeId],
    queryFn: async () => {
      if (!universidadeId) {
        throw new Error("ID da universidade não encontrado");
      }
      
      // Get teams related to university and don't have a recommendation yet
      // We need to find teams that:
      // 1. Belong to the university (equipe.universidade_id = universidadeId)
      // 2. Don't have a recommendation (not in recomendacoes_universidade with this universidadeId)
      const { data: equipesData, error: equipesError } = await supabase
        .from("equipes")
        .select(`
          id,
          nome,
          foto,
          created_at,
          descricao
        `)
        .eq("universidade_id", universidadeId)
        .limit(10);
        
      if (equipesError) {
        throw new Error(`Erro ao buscar equipes: ${equipesError.message}`);
      }
      
      if (!equipesData || equipesData.length === 0) {
        return [];
      }
      
      // Extract team IDs
      const equipeIds = equipesData.map(equipe => equipe.id);
      
      // Get recommendations for these teams
      const { data: recomendacoesData, error: recomendacoesError } = await supabase
        .from("recomendacoes_universidade")
        .select("equipe_id")
        .eq("universidade_id", universidadeId)
        .in("equipe_id", equipeIds);
        
      if (recomendacoesError) {
        throw new Error(`Erro ao buscar recomendações: ${recomendacoesError.message}`);
      }
      
      // Filter out teams that already have recommendations
      const recomendacoesEquipeIds = recomendacoesData?.map(rec => rec.equipe_id) || [];
      const equipeSemRecomendacao = equipesData.filter(
        equipe => !recomendacoesEquipeIds.includes(equipe.id)
      );
      
      // If no teams without recommendations, return empty array
      if (equipeSemRecomendacao.length === 0) {
        return [];
      }
      
      // Get team members for each team
      const equipesCompletas = await Promise.all(
        equipeSemRecomendacao.map(async (equipe) => {
          // Get members of the team
          const { data: membrosData, error: membrosError } = await supabase
            .from("estudantes")
            .select(`
              id,
              nome,
              foto,
              funcao_cargo,
              telefone
            `)
            .eq("equipe_id", equipe.id);
            
          if (membrosError) {
            console.error(`Erro ao buscar membros da equipe ${equipe.id}: ${membrosError.message}`);
            return {
              ...equipe,
              membros: []
            };
          }
          
          return {
            ...equipe,
            membros: membrosData || []
          };
        })
      );
      
      return equipesCompletas;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};