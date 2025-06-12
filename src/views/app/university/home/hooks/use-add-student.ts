import { supabase } from "@/services/supabase";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export interface AddStudentInput {
  nome: string;
  matricula: string;
  telefone: string;
  endereco: string;
  email: string;
}
export function useAddStudent() {
  return useMutation({
    mutationFn: async (input: AddStudentInput) => {
      const { data, error } = await supabase
        .from("estudantes")
        .insert([
          {
            id: uuidv4(), // Gera um UUID para o id
            nome: input.nome,
            matricula: input.matricula,
            telefone: input.telefone,
            endereco: input.endereco,
            email: input.email,
            universidade_id: sessionStorage.getItem('userId'),
          },
        ])
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}
