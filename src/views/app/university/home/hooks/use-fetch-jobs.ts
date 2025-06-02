/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

// Interface para empresa
interface Company {
  id: string;
  nome: string;
  foto?: string;
  cnpj: string;
  telefone?: string;
  endereco?: any;
  descricao?: string;
}

// Interface para vaga aberta
export interface OpenJob {
  id: string;
  nome: string;
  foto?: string;
  prazo?: string;
  valor?: number;
  descricao?: string;
  status: 'aberto';
  created_at: string;
  updated_at: string;
  empresa_id: string;
  estudante_id?: string;
  // Dados da empresa
  empresa: Company;
  // Estatísticas opcionais
  total_aplicacoes?: number;
  aplicacoes_pendentes?: number;
}

export const useFetchOpenJobs = () => {
  // Não precisa do universidadeId pois vamos buscar todas as vagas abertas
  // Mas você pode adicionar se quiser filtrar por região ou outro critério
  
  return useQuery<OpenJob[]>({
    queryKey: ["openJobs"],
    queryFn: async () => {
      // Buscar vagas com status "aberto" e informações da empresa
      const { data: vagasData, error: vagasError } = await supabase
        .from("vagas")
        .select(`
          id,
          nome,
          foto,
          prazo,
          valor,
          descricao,
          status,
          created_at,
          updated_at,
          empresa_id,
          estudante_id,
          empresas (
            id,
            nome,
            foto,
            cnpj,
            telefone,
            endereco,
            descricao
          )
        `)
        .eq("status", "aberto")
        .order("created_at", { ascending: false })

      if (vagasError) {
        throw new Error(`Erro ao buscar vagas abertas: ${vagasError.message}`);
      }

      if (!vagasData || vagasData.length === 0) {
        return [];
      }

      // Buscar estatísticas de aplicações para cada vaga (opcional)
      const vagasComEstatisticas = await Promise.all(
        vagasData.map(async (vaga) => {
          // Contar aplicações para esta vaga
          const { count: totalAplicacoes } = await supabase
            .from("aplicacoes")
            .select("*", { count: 'exact', head: true })
            .eq("vaga_id", vaga.id);

          // Contar aplicações pendentes
          const { count: aplicacoesPendentes } = await supabase
            .from("aplicacoes")
            .select("*", { count: 'exact', head: true })
            .eq("vaga_id", vaga.id)
            .eq("status", "pendente");

          const empresa = vaga.empresas as any;

          return {
            id: vaga.id,
            nome: vaga.nome,
            foto: vaga.foto,
            prazo: vaga.prazo,
            valor: vaga.valor,
            descricao: vaga.descricao,
            status: 'aberto' as const,
            created_at: vaga.created_at,
            updated_at: vaga.updated_at,
            empresa_id: vaga.empresa_id,
            estudante_id: vaga.estudante_id,
            empresa: {
              id: empresa?.id || '',
              nome: empresa?.nome || 'Empresa não encontrada',
              foto: empresa?.foto,
              cnpj: empresa?.cnpj || '',
              telefone: empresa?.telefone,
              endereco: empresa?.endereco,
              descricao: empresa?.descricao,
            },
            total_aplicacoes: totalAplicacoes || 0,
            aplicacoes_pendentes: aplicacoesPendentes || 0,
          };
        })
      );

      return vagasComEstatisticas;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};