/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

// Interface usada para nosso componente
export interface University {
  id: string;
  nome: string;
  sigla?: string;
  cidade?: string;
  estado?: string;
  created_at: string;
}

export const useFetchUniversity = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("query");
  
  return useQuery<{ universities: University[]; totalCount: number }>({
    queryKey: ["universidades", page, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("universidades")
        .select("*", { count: "exact" });

      if (searchQuery) {
        query = query.ilike("nome", `%${searchQuery}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * 10, (page - 1) * 10 + 9);

      if (error) {
        throw new Error(`Erro ao buscar universidades: ${error.message}`);
      }

      const mappedUniversities: University[] = (data || []).map((item: any) => ({
        id: item.id,
        nome: item.nome,
        sigla: item.sigla,
        cidade: item.cidade,
        estado: item.estado,
        created_at: item.created_at,
      }));

      return {
        universities: mappedUniversities,
        totalCount: count || 0,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};