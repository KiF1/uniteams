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
  const empresaId = sessionStorage.getItem("empresaId");

  return useQuery<Result>({
    queryKey: ["activeProjects", empresaId],
    queryFn: async () => {
      if (!empresaId) {
        throw new Error("ID da empresa não encontrado.");
      }

      const { data: projetos, error } = await supabase
        .from("projetos")
        .select("*")
        .eq("empresa_id", empresaId)
        .eq("status", "ativo")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar projetos ativos: ${error.message}`);
      }

      if (!projetos || projetos.length === 0) {
        return { comEquipe: [], semEquipe: [] };
      }

      const comEquipeBruta = projetos.filter(p => p.equipe_id);
      const semEquipe = projetos.filter(p => !p.equipe_id);

      // Buscar dados das equipes relacionadas
      const equipeIds = comEquipeBruta.map(p => p.equipe_id);

      const { data: equipes, error: equipeError } = await supabase
        .from("equipes")
        .select("id, nome, foto, created_at, descricao")
        .in("id", equipeIds as string[]);

      if (equipeError) {
        throw new Error(`Erro ao buscar equipes: ${equipeError.message}`);
      }

      // Buscar membros das equipes
      const equipesCompletas: Team[] = await Promise.all(
        (equipes || []).map(async (equipe) => {
          const { data: membros, error: membrosError } = await supabase
            .from("estudantes")
            .select("id, nome, foto, funcao_cargo, telefone")
            .eq("equipe_id", equipe.id);

          return {
            ...equipe,
            membros: membrosError ? [] : membros || [],
          };
        })
      );

      // Relacionar equipe aos projetos
      const comEquipe = comEquipeBruta.map(projeto => {
        const equipe = equipesCompletas.find(e => e.id === projeto.equipe_id);
        return { ...projeto, equipe };
      });

      return {
        comEquipe,
        semEquipe,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
