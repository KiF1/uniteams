import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getFullImageUrl } from "@/utils/photo-user";
import { CircleX } from "lucide-react";
import photo from '@/assets/photo.png'
import { formatTime } from "@/utils/format-date";
import { CreateRecommendationSheet } from "./project";
import { useUpdateRecommendation } from "../hooks/use-update-recomendation";
import type { Team } from "../hooks/use-fetch-team";

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  foto: string;
  prazo: string;
  valor: number;
  equipe: Team;
}


interface Props {
  projeto: Projeto;
}

export const TeamCard = ({ projeto }: Props) => {
  const { mutate, isPending } = useUpdateRecommendation('recusada');
  const { equipe } = projeto;

  const rejectRecomendation = async (teamId: string) => {
    mutate({ equipe_id: teamId });
  };

  return (
    <Card className="w-full h-full border rounded-md border-gray-800 grid xl:grid-cols-[1fr_0.1fr_0.75fr]">
      <div className="w-full flex flex-col justify-start items-start">
        <CardHeader className="w-full pr-0">
          <div className="w-full flex items-start gap-2">
            <img
              src={getFullImageUrl(projeto.foto) || photo}
              className="w-16 h-16 rounded-full object-cover border-2 bg-primary border-gray-800"
            />
            <div className="grid">
              <strong className="font-medium text-base text-gray-150">
                {projeto.nome}
              </strong>
              <span className="font-normal text-sm text-gray-160">
                Prazo: {formatTime(projeto.prazo)}
              </span>
              <span className="text-xs text-primary font-normal underline">
                Equipe: {equipe?.nome}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="w-full text-sm text-gray-160 grid h-full pr-0">
          <p className="whitespace-pre-line">{projeto.descricao}</p>
          <p className="mt-2 text-sm font-medium">Valor: R$ {projeto.valor.toFixed(2)}</p>

          <div className="flex justify-between w-full mt-4">
            <CreateRecommendationSheet equipeId={equipe.id} />
            <Button
              variant="outline"
              onClick={() => rejectRecomendation(equipe.id)}
              disabled={isPending}
              className="text-gray-160 text-sm border flex items-center gap-2 border-gray-800 rounded-md mt-auto"
            >
              Rejeitar
              <CircleX />
            </Button>
          </div>
        </CardContent>
      </div>

      <Separator orientation="horizontal" className="block xl:hidden my-4" />
      <Separator orientation="vertical" className="hidden xl:block mx-auto" />

    
    </Card>
  );
};
