import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { redirectPath } from "@/utils/redirect-path";
import { useLogin } from "./hooks/use-login-user";

const loginFormSchema = z.object({
  email: z.string().email({message:"Digite um e-mail válido"}),
  password: z.string().min(8, { "message": "Informe uma senha com no mínimo 8 caracteres" })
});

type LoginForm = z.infer<typeof loginFormSchema>;

export const SignIn = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema)
  });

  function redirectToCreateUser(){
    navigate('/auth/choose-type');
  }

  const { mutate, isPending } = useLogin();

  const onSubmit = (data: LoginForm) => {
    mutate(data);
  };

  useEffect(() => {
    const userLogged = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');
    if(userLogged && userType){
      const redirectTo = redirectPath(userType);
      navigate(redirectTo)
    }
  }, [])

  return(
    <div className="w-[85%] md:w-[45%] xl:w-[65%] flex flex-col mt-20">
      <h1 className="text-xl text-gray-150 font-bold text-center">Acesse sua conta</h1>
      <h2 className="text-sm text-gray-160 font-semibold text-center mt-2">Olá, seja bem-vindo de volta ao UniTeams!👋</h2>
      <form className="w-full flex flex-col gap-6 mt-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Input {...register('email')} type="email" placeholder="Insira seu E-mail" />
          {errors.email && <span className="text-xs font-normal text-red-300">{errors.email.message}</span>}
        </div>
        <div className="grid gap-2">
          <Input {...register('password')} type="password" placeholder="Insira sua senha" />
          {errors.password && <span className="text-xs font-normal text-red-300">{errors.password.message}</span>}
        </div>
        <Button disabled={isPending} type="submit" className="bg-primary text-white">Entrar</Button>
        <button onClick={redirectToCreateUser} className="text-sm text-black font-normal text-center bg-transparent border-0">
          Não se cadastrou? 
          <span className="text-sm text-primary font-normal underline ml-2">cadastre-se agora</span>
        </button>
      </form>
    </div>
  )
}