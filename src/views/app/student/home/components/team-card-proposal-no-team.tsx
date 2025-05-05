/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCheck, Loader2  } from "lucide-react";
import { useSearchParams } from 'react-router-dom';
import { useFetchTeam } from '../hooks/use-fetch-tem';
import { Separator } from "@/components/ui/separator";
import { TeamProfile } from "./team-profile";
import photo from '@/assets/photo.png';
import { getFullImageUrl } from '@/utils/photo-user';

export const TeamCardProposalNoTeam = () => {
  const [, setSearchInput] = useState('');
  const [searchParams, ] = useSearchParams();
  
  // Usar o hook de busca de empresas
  const { data, isLoading, isError, error } = useFetchTeam();

  const teams = data?.teams || [];

  useEffect(() => {
    const queryParam = searchParams.get('query');
    if (queryParam) {
      setSearchInput(queryParam);
    }
  }, []);

  return (
    <div className="w-full bg-white p-1 rounded-md">
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          Erro ao carregar empresas: {error?.message || 'Tente novamente mais tarde.'}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma empresa encontrada. Tente outra pesquisa.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {teams.slice(0, 3).map(team => (
            <div key={team.id} className="flex flex-row items-start justify-between border border-gray-800 rounded-md p-6 max-w-[350px] mx-auto">
              <div className="flex-1">
                <div className="ml-3 grid">
                  <div className="flex items-center gap-3">
                    <img 
                      src={getFullImageUrl(team.foto) || photo} 
                      alt={`Foto da projeto ${team.nome}`}
                      className="w-12 h-12 rounded-full object-cover border bg-primary border-gray-800"
                    />
                    <div>
                      <p className="font-medium text-lg text-gray-150">Foursys</p>
                      <p className="font-medium text-xs text-gray-150">Criado: em 13/12/2023 | Projetos: 6</p>
                    </div>
                  </div>
                </div>
                <div className="ml-3 grid">
                  <p className="font-medium text-xs text-gray-150 mt-4 mb-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati odit eum nam, modi recusandae dolor porro, inventore ea fugit natus quae saepe animi ipsam voluptates autem totam neque vitae excepturi!</p>
                  <p className="font-medium text-xs text-gray-150 mb-6">Categoria: TI e Programação</p>
                  <div className="mt-4">
                    <Button className="bg-primary w-fit text-white rounded-md flex items-center px-2 py-1 text-sm">
                      <CheckCheck className="h-2 w-2 mr-1" />
                      Solicitar Acesso
                    </Button>
                  </div>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-4 h-auto" />
              <div className="flex-1">
                <TeamProfile />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};