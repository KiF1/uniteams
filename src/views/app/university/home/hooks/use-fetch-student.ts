/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

// Interface usada para nosso componente
export interface Student {
  id: string;
  nome: string;
  foto: string;
  email?: string;
  matricula?: string;
  telefone?: string;
  created_at: string;
  instituicao?: {
    nome: string;
  };
}

export const useFetchStudent = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("query");
  const userLogged = sessionStorage.getItem('userId');

  return useQuery<{ students: Student[]; totalCount: number }>({
    queryKey: ["estudantes", page, searchQuery],
    queryFn: async () => {
      // Buscar universidade_id do usuário logado
      const { data: universidadeData } = await supabase
        .from("universidades")
        .select("id, nome")
        .eq("id", userLogged)
        .single();

      if (!universidadeData) {
        throw new Error("Universidade não encontrada.");
      }

      let query = supabase
        .from("estudantes")
        .select("id, nome, foto, email, created_at, universidade_id, telefone, matricula, instituicao:universidade_id(nome)", { count: "exact" })
        .eq("universidade_id", universidadeData.id);

      if (searchQuery) {
        query = query.ilike("nome", `%${searchQuery}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * 10, (page - 1) * 10 + 9);

      if (error) {
        throw new Error(`Erro ao buscar estudantes: ${error.message}`);
      }

      const mappedStudents: Student[] = (data || []).map((item: any) => ({
        id: item.id,
        nome: item.nome,
        foto: item.foto,
        email: item.email,
        created_at: item.created_at,
        instituicao: item.instituicao ? { nome: item.instituicao.nome } : undefined,
      }));

      return {
        students: mappedStudents,
        totalCount: count || 0,
      };
    },
    enabled: !!userLogged,
    staleTime: 1000 * 60 * 5,
  });
};