import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCheck, CircleCheck, CircleX, Hourglass, TriangleAlert } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useFetchRecommendations } from "../hooks/fetch-recomendations";
import { getFullImageUrl } from "@/utils/photo-user";
import photo from '@/assets/photo.png'
import { CreateRecommendationSheet } from "./recomendation";
import { useUpdateRecommendation } from "../hooks/use-update-recomendation";

export const Metrics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') as 'todas' | 'pendente' | 'aprovada' | 'recusada' || 'todas';
  const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get('page-metrics') ?? '1');
  

  const { teams, metrics, isLoading, error } = useFetchRecommendations({
    page: pageIndex + 1,
    perPage: 10,
    status: status
  });

  const handlePaginate = (pageIndex: number) => {
    setSearchParams((prev) => {
      prev.set('page-metrics', (pageIndex + 1).toString())
      return prev
    })
  }

  const { mutate, isPending } = useUpdateRecommendation('recusada');

  const rejectRecomendation = async (team: string) => {
    mutate({ equipe_id: team })
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar dados: {error.message}</div>;
  }

  return (
    <div className="flex-1 grid gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="w-full md:w-fit grid gap-2 p-6 border rounded-md border-gray-800">
            <div className="flex items-center gap-2">
              <Hourglass className="w-4 h-4" />
              <strong className="text-sm font-semibold text-gray-150">Solicitações Pendentes</strong>
            </div>
            <strong className="text-4xl font-semibold text-gray-150">
              {metrics.pendentes.toString().padStart(3, '0')}
            </strong>
          </div>
          <div className="w-full md:w-fit grid gap-2 p-6 border rounded-md border-gray-800">
            <div className="flex items-center gap-2">
              <CircleCheck className="w-4 h-4" />
              <strong className="text-sm font-semibold text-gray-150">Solicitações Aprovadas</strong>
            </div>
            <strong className="text-4xl font-semibold text-gray-150">
              {metrics.aprovadas.toString().padStart(3, '0')}
            </strong>
          </div>
          <div className="w-full md:w-fit grid gap-2 p-6 border rounded-md border-gray-800">
            <div className="flex items-center gap-2">
              <CircleX className="w-4 h-4" />
              <strong className="text-sm font-semibold text-gray-150">Solicitações Reprovadas</strong>
            </div>
            <strong className="text-4xl font-semibold text-gray-150">
              {metrics.recusadas.toString().padStart(3, '0')}
            </strong>
          </div>
        </div>
      </div>
      
      <div className="grid xl:grid-cols-2 gap-6 max-h-[300px] overflow-y-auto pr-4 mb-6">
        {teams.map(team => (
          <div key={team.id} className="flex flex-col gap-2 border border-gray-800 rounded-md p-6">
            <div className="flex items-start">
              <img 
                src={getFullImageUrl(team.foto) || photo} 
                className="w-20 h-20 rounded-full object-cover border-2 bg-primary border-gray-800"
                alt={team.nome}
              />
              <div className="ml-3 grid">
                <p className="font-medium text-lg text-gray-150">{team.nome}</p>
                <p className="font-medium text-xs text-gray-150">{team.email}</p>
                <span className="text-xs text-primary font-normal underline cursor-pointer">Vizualizar Equipe</span>
              </div>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            
            {team.status === 'pendente' && (
              <div className='p-2 w-full border-l-4 flex items-center gap-2 bg-yellow-50 text-yellow-800 border-l-yellow-400'>
                <TriangleAlert className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-800">Aguardando</span>
              </div>
            )}
            {team.status === 'aprovada' && (
              <div className='p-2 w-full border-l-4 flex items-center gap-2 bg-green-50 text-green-800 border-l-green-400'>
                <CheckCheck className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-green-800">Equipe Recomandada</span>
              </div>
            )}
            {team.status === 'recusada' && (
              <div className='p-2 w-full border-l-4 flex items-center gap-2 bg-red-50 text-red-800 border-l-red-400'>
                <CircleX className="w-4 h-4 text-red-800" />
                <span className="text-xs font-semibold text-red-800">Equipe não recomendada</span>
              </div>
            )}

            {team.status === 'pendente' && (
              <div className="w-fit flex items-center mt-4 gap-2">
                <CreateRecommendationSheet equipeId={team.id} />
                <Button onClick={() => rejectRecomendation(team.id)} disabled={isPending} className="text-gray-160 flex-1 text-sm border flex items-center gap-2 border-gray-800 rounded-md bg-transparent">
                  <CircleX className="h-4 w-4 mr-1" />
                  Rejeitar
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="grid gap-4 pr-8 pb-6">
        <Separator orientation="horizontal" />
        <Pagination
          pageIndex={pageIndex}
          totalCount={teams.length}
          perPage={10}
          onPageChange={handlePaginate}
        />
      </div>
    </div>
  );
};