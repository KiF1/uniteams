import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getFullImageUrl } from "@/utils/photo-user";
import { BriefcaseBusiness, CircleX, PhoneCall } from "lucide-react";
import photo from '@/assets/photo.png'
import { formatTime } from "@/utils/format-date";
import { applyPhoneMask } from "@/utils/mask-phone";
import { CreateRecommendationSheet } from "./recomendation";
import { useUpdateRecommendation } from "../hooks/use-update-recomendation";
import { Link } from "react-router-dom";

interface Team {
  id: string;
  nome: string;
  descricao: string;
  foto: string;
  created_at: string;
  membros: {
      nome: string;
      funcao_cargo: string;
      telefone: string;
      foto: string;
  }[];
}

interface Props {
  team: Team
}

export const TeamCard = ({ team }: Props) => {
  const { mutate, isPending } = useUpdateRecommendation('recusada');
  
  const rejectRecomendation = async (team: string) => {
    mutate({ equipe_id: team })
  };

  return (
    <Card className="w-full h-full border rounded-md border-gray-800 grid xl:grid-cols-[1fr_0.1fr_0.75fr]">
      <div className="w-full flex flex-col justify-start items-start">
        <CardHeader className="w-full pr-0">
          <div className="w-full flex items-start gap-2">
            <img 
              src={getFullImageUrl(team.foto) || photo} 
              className="w-16 h-16 rounded-full object-cover border-2 bg-primary border-gray-800"
            />
            <div className="grid">
              <strong className="font-medium text-base text-gray-150">{team.nome}</strong>
              <span className="font-normal text-sm text-gray-160">{formatTime(team.created_at)}</span>
              <Link
                to="/app/student/view/2"
                className="text-xs text-primary font-normal underline hover:text-primary-dark"
              >
                Visualizar Equipe
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full text-sm text-gray-160 grid h-full pr-0">
          <p className="whitespace-pre-line">{team.descricao}</p>
          <div className="flex justify-between w-full mt-4">
            <CreateRecommendationSheet equipeId={team.id} />
            <Button variant="outline" onClick={() => rejectRecomendation(team.id)} disabled={isPending} className="text-gray-160 text-sm border flex items-center gap-2 border-gray-800 rounded-md mt-auto">
              Rejeitar
              <CircleX />
            </Button>
        </div>
        </CardContent>
      </div>
      <Separator orientation="horizontal" className="block xl:hidden my-4" />
      <Separator orientation="vertical" className="hidden xl:block mx-auto" />
      <CardFooter className="flex flex-col items-start pt-6 pl-0">
        <h4 className="text-sm font-medium mb-4 text-gray-150">Membros</h4>
        <div className="w-full max-h-72 overflow-y-auto pr-2">
          {team.membros.map((member, index) => (
            <div key={index} className="grid gal-2 pb-4">
              <div className="flex items-start gap-2 mb-3">
                <div className="w-16 h-16 rounded-full border-2 border-gray-800 overflow-hidden">
                  <img 
                    src={member.foto} 
                    alt={member.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{member.nome}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2"><BriefcaseBusiness className="w-3 h-3" /> {member.funcao_cargo}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2"><PhoneCall className="w-3 h-3" /> {applyPhoneMask(member.telefone)}</p>
                </div>
              </div>
              <Separator orientation="horizontal" />
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};