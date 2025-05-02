import { supabase } from "@/services/supabase";
import { redirectPath } from "@/utils/redirect-path";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // 1. Autenticar no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        throw new Error(authError.message || "Falha na autenticação. Verifique suas credenciais.");
      }

      if (!authData.user) {
        throw new Error("Usuário não encontrado.");
      }

      const userId = authData.user.id;

      // 2. Buscar informações do usuário na tabela de usuários
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("tipo_usuario")
        .eq("id", userId)
        .single();

      if (userError) {
        throw new Error("Erro ao buscar dados do usuário.");
      }

      if (!userData) {
        throw new Error("Dados de usuário não encontrados.");
      }

      const tipoUsuario = userData.tipo_usuario;
      const redirectTo = redirectPath(tipoUsuario);

      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userType", tipoUsuario);
      return { userId, tipoUsuario, redirectTo };
    },

    onSuccess: ({ redirectTo }) => {
      navigate(`${redirectTo}/dashboard`);
    },

    onError: (error) => {
      toast.error("Erro ao realizar login", {
        description: error.message || "Falha na autenticação. Verifique suas credenciais.",
        classNames: {
          title: "text-red-500",
          icon: "group-data-[type=error]:text-red-500",
        },
      });
    },
  });

  return { mutate, isPending };
};