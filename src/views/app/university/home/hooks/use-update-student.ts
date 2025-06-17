import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

type UpdateStudentInput = { studentId: string; data: any };

export function useUpdateStudent(): UseMutationResult<boolean, Error, UpdateStudentInput> {
  return useMutation({
    mutationFn: async ({ studentId, data }: UpdateStudentInput) => {
      const { error } = await supabase
        .from("estudantes")
        .update(data)
        .eq("id", studentId);

      if (error) {
        throw error;
      }
      return true;
    },
  });
}
