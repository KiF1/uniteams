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
        
      // Get teams with pending recommendations for this university
      const { data: recomendacoesData, error: recomendacoesError } = await supabase
        .from("recomendacoes_universidade")
        .select("equipe_id")
        .eq("universidade_id", universidadeId)
        .eq("status", "pendente")
        .order("created_at", { ascending: false })
        .limit(10);
              
      if (recomendacoesError) {
        throw new Error(`Erro ao buscar equipes pendentes: ${recomendacoesError.message}`);
      }
        
      if (!recomendacoesData || recomendacoesData.length === 0) {
        return [];
      }

      // Extract team IDs
      const equipeIds = recomendacoesData.map(rec => rec.equipe_id);
        
      // Get team details
      const { data: equipesData, error: equipesError } = await supabase
        .from("equipes")
        .select(`
          id,
          nome,
          foto,
          created_at,
          descricao
        `)
        .in("id", equipeIds);

      if (equipesError) {
        throw new Error(`Erro ao buscar detalhes das equipes: ${equipesError.message}`);
      }

      if (!equipesData || equipesData.length === 0) {
        return [];
      }
        
      // Get team members for each team
      const equipesCompletas = await Promise.all(
        equipesData.map(async (equipe) => {
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
    staleTime: 10 * 60 * 1000
  });
};