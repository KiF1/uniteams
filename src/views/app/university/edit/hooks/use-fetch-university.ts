import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

interface University {
  id: string;
  nome: string;
  email: string;
  foto: string | null;
  cnpj: string;
  telefone: string;
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
  }
  descricao: string | null;
}

// Função para buscar dados da universidade
export const useGetUniversity = (universityId: string) => {
  return useQuery<University>({
    queryKey: ["university", universityId],
    queryFn: async () => {
      if (!universityId) {
        throw new Error("ID da universidade não fornecido");
      }

      const { data, error } = await supabase
        .from("universidades")
        .select('*')
        .eq("id", universityId)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar universidade: ${error.message}`);
      }

      if (!data) {
        throw new Error("Universidade não encontrada");
      }

      return data;
    },
    enabled: !!universityId,
  });
};