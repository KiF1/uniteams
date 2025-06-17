import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export interface University {
  id: string;
  nome: string;
  cidade?: string;
  estado?: string;
  estudantes: {
    id: string;
    nome: string;
    foto: string;
    email?: string;
    created_at: string;
  }[];
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
        .select(
          `
            id,
            nome,
            endereco,
            estudantes:estudantes (
              id,
              nome,
              foto,
              email,
              created_at
            )
          `,
          { count: "exact" }
        );

      if (searchQuery) {
        query = query.ilike("nome", `%${searchQuery}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * 10, (page - 1) * 10 + 9);

      if (error) {
        throw new Error(error.message || "Erro ao buscar universidades.");
      }

      const universities: University[] = (data || []).map((item: any) => ({
        id: item.id,
        nome: item.nome,
        cidade: item.endereco?.cidade,
        estado: item.endereco?.estado,
        estudantes: (item.estudantes || []).map((est: any) => ({
          id: est.id,
          nome: est.nome,
          foto: est.foto,
          email: est.email,
          created_at: est.created_at,
        })),
      }));

      return {
        universities,
        totalCount: count || 0,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
