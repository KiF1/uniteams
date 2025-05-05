import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

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

interface Projeto {
  id: string;
  nome: string;
  foto: string;
  prazo: string;
  valor: number;
  equipe_id: string | null;
  status: string;
  descricao: string;
  created_at: string;
  updated_at: string;
  equipe?: Team;
}

interface Result {
  comEquipe: Projeto[];
  semEquipe: Projeto[];
}

export const useFetchProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projetos").select("*");

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
