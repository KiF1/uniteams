/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface SuccessfulApplication {
  id: string;
  nome: string; // nome da vaga
  foto: string; // foto da vaga
  created_at: string; // data de criação da aplicação
  updated_at: string; // data de atualização da aplicação
  status: 'aprovada';
  vaga_id: string;
  estudante_id: string;
  // Dados da vaga
  valor?: number;
  prazo?: string;
  descricao?: string;
  vaga_status: string;
  // Dados da empresa
  empresa_id: string;
  empresa_nome: string;
  empresa_foto?: string;
  empresa_cnpj: string;
  empresa_telefone?: string;
  empresa_endereco?: any;
  // Dados do estudante
  estudante_nome: string;
  estudante_foto?: string;
  estudante_matricula?: string;
  estudante_telefone?: string;
  estudante_curso?: string;
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

export const useApplicationsSuccess = (
  universityId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<SuccessfulApplication>>({
    queryKey: ["applications-success", universityId, page, limit],
    queryFn: async () => {
      if (!universityId) {
        throw new Error("ID da universidade não fornecido");
      }

      const offset = (page - 1) * limit;

      // Primeira consulta: buscar aplicações aprovadas com contagem total
      const { data: applicationsData, count: total, error: applicationsError } = await supabase
        .from("aplicacoes")
        .select(`
          id,
          status,
          created_at,
          updated_at,
          vaga_id,
          estudante_id,
          vagas (
            id,
            nome,
            foto,
            valor,
            prazo,
            descricao,
            status,
            empresa_id,
            empresas (
              id,
              nome,
              foto,
              cnpj,
              telefone,
              endereco
            )
          ),
          estudantes (
            id,
            nome,
            foto,
            matricula,
            telefone
          )
        `, { count: 'exact' })
        .eq("universidade_id", universityId)
        .eq("status", "aprovada")
        .order("updated_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (applicationsError) {
        throw new Error(`Erro ao buscar aplicações aprovadas: ${applicationsError.message}`);
      }

      if (!applicationsData || applicationsData.length === 0) {
        return {
          data: [],
          total: 0,
          page,
          limit,
          totalPages: 0
        };
      }

      // Mapear os dados para a interface SuccessfulApplication
      const successfulApplications: SuccessfulApplication[] = applicationsData.map(aplicacao => {
        const vaga = aplicacao.vagas as any;
        const empresa = vaga?.empresas as any;
        const estudante = aplicacao.estudantes as any;

        return {
          id: aplicacao.id,
          nome: vaga?.nome || 'Vaga não encontrada',
          foto: vaga?.foto || '',
          created_at: aplicacao.created_at,
          updated_at: aplicacao.updated_at,
          status: 'aprovada' as const,
          vaga_id: aplicacao.vaga_id,
          estudante_id: aplicacao.estudante_id,
          // Dados da vaga
          valor: vaga?.valor,
          prazo: vaga?.prazo,
          descricao: vaga?.descricao,
          vaga_status: vaga?.status,
          // Dados da empresa
          empresa_id: vaga?.empresa_id,
          empresa_nome: empresa?.nome || 'Empresa não encontrada',
          empresa_foto: empresa?.foto,
          empresa_cnpj: empresa?.cnpj,
          empresa_telefone: empresa?.telefone,
          empresa_endereco: empresa?.endereco,
          // Dados do estudante
          estudante_nome: estudante?.nome || 'Estudante não encontrado',
          estudante_foto: estudante?.foto,
          estudante_matricula: estudante?.matricula,
          estudante_telefone: estudante?.telefone,
        };
      });

      return {
        data: successfulApplications,
        total: total || 0,
        page,
        limit,
        totalPages: Math.ceil((total || 0) / limit)
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    enabled: !!universityId,
  });
};