/* eslint-disable react-hooks/exhaustive-deps */
import { Loader2 } from "lucide-react";
import { getFullImageUrl } from '@/utils/photo-user';
import photo from '@/assets/photo.png';
import { useFetchTeam } from '../hooks/use-fetch-tem';

export const TeamProfile = () => {
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
          <div className="flex flex-col md:flex-row items-center justify-between border border-gray-800 rounded-md overflow-hidden flex-wrap">
            <div className="flex-1 flex items-start p-2">
              <img 
                src={getFullImageUrl(team.foto) || photo} 
                alt={`Foto da projeto ${team.nome}`}
                className="w-10 h-10 rounded-full object-cover border bg-primary border-gray-800"
              />
              <div className="ml-2 flex-1">
                <p className="font-medium text-xs text-gray-150 truncate">João Pedro</p>
                <p className="font-medium text-[9px] text-gray-150 truncate">Dev Front</p>
                <p className="font-medium text-[9px] text-gray-150 truncate">{team.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};