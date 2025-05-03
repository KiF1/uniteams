/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

// Interface usada para nosso componente
export interface Team {
  id: string;
  nome: string;
  foto: string;
  email?: string;
  created_at: string;
  instituicao?: {
    nome: string;
  };
}

export const useFetchTeam = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("query"); // Alterado para "query" para corresponder ao seu componente
  
  return useQuery<{ teams: Team[]; totalCount: number }>({
    queryKey: ["teams", page, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("equipes")
        .select(`
          id,
          nome,
          foto,
          email,
          created_at,
          instituicao:universidade_id (nome)
        `, { count: "exact" });
      
      if (searchQuery) {
        query = query.ilike("nome", `%${searchQuery}%`);
      }
      
      // Adicionar paginação e ordenação (as 10 últimas equipes cadastradas)
      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * 10, (page - 1) * 10 + 9); // Corrigido para usar page-1 e inclusão até 9
      
      if (error) {
        throw new Error(`Erro ao buscar equipes: ${error.message}`);
      }
      
      // Mapear dados para garantir que correspondam ao tipo Team
      const mappedTeams: Team[] = (data || []).map((item: any) => ({
        id: item.id,
        nome: item.nome,
        foto: item.foto,
        email: item.email,
        created_at: item.created_at,
        instituicao: item.instituicao ? { nome: item.instituicao.nome } : undefined
      }));
      
      return {
        teams: mappedTeams,
        totalCount: count || 0
      };
    },
    // Só executar a query se for a primeira página sem busca (carregamento inicial)
    // ou se houver uma busca explícita (botão clicado)
    enabled: searchParams.has("page") || searchParams.has("query"),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};