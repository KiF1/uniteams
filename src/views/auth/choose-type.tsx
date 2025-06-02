import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ChooseType = () => {
  const navigate = useNavigate();

  function redirectToCreateCompany(){
    navigate('/auth/register-company');
  }
  function redirectToCreateUniversity(){
    navigate('/auth/register-university');
  }

  function redirectToLogin(){
    navigate('/auth/sign-in');
  }


  return(
    <div className="w-[85%] md:w-[45%] xl:w-[65%] flex flex-col mt-20">
      <h1 className="text-xl text-gray-150 font-bold text-center">Inicie seu cadastro</h1>
      <h2 className="text-sm text-gray-160 font-semibold text-center mt-2">Selecione seu perfil — Empresa, Universidade ou Estudante.</h2>
      <div className="w-full flex flex-col gap-6 mt-6">
        <Button className="bg-primary text-white" onClick={redirectToCreateCompany}>Empresa</Button>
        <Button className="bg-primary text-white" onClick={redirectToCreateUniversity}>Universidade</Button>
        <button onClick={redirectToLogin} className="text-sm text-black font-normal text-center bg-transparent border-0">
          Já possui uma conta? 
          <span className="text-sm text-primary font-normal underline ml-2">fazer login</span>
        </button>
      </div>
    </div>
  )
}