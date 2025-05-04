/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Mail } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { getFullImageUrl } from '@/utils/photo-user';
import photo from '@/assets/photo.png';
import { useFetchTeam } from '../hooks/use-fetch-tem';

export const TeamProject = () => {
  const { data, isLoading, isError, error } = useFetchTeam();

  const teams = data?.teams || [];
  const team = teams[0];

  return (
    <div className="w-full bg-white flex items-start">
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          Erro ao carregar projetos: {error?.message || 'Tente novamente mais tarde.'}
        </div>
      ) : !team ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum projeto encontrado.
        </div>
      ) : (
        <div className="space-y-4 mt-15 max-w-2xl w-full">
          <p className="font-bold text-lg text-gray-150">Projeto</p>
          <div className="flex flex-col md:flex-row items-center justify-between border border-gray-800 rounded-md">
            <div className="flex-1 flex items-start p-4">
              <img 
                src={getFullImageUrl(team.foto) || photo} 
                alt={`Foto da projeto ${team.nome}`}
                className="w-16 h-16 rounded-full object-cover border-2 bg-primary border-gray-800"
              />
              <div className="ml-3 grid">
                <p className="font-medium text-base text-gray-150">Tópicos Integrados</p>
                <p className="font-medium text-xs text-gray-150 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> {team.email || 'Sem email'}
                </p>
              </div>
            </div>
            <Separator orientation="vertical" className="hidden md:block mx-4 h-20" />
            <div className="w-fit grid grid-cols-2 md:grid-cols-1 md:justify-items-end gap-2 pr-2">
              <Button className="bg-primary w-fit text-white rounded-md flex items-center px-3 py-1">
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};