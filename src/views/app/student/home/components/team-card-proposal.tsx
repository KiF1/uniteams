/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Loader2  } from "lucide-react";
import { useSearchParams } from 'react-router-dom';
import { useFetchTeam } from '../hooks/use-fetch-tem';

export const TeamCardProposal = () => {
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
    <div className="w-full bg-white rounded-md">
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
            <div key={team.id} className="flex flex-col items-center justify-between border border-gray-800 rounded-md p-6">
              <div className="flex items-start w-full">
                <div className="ml-1 grid">
                  <p className="font-medium text-lg text-gray-150">Tópicos Integradores</p>
                  <p className="font-medium text-xs text-gray-150 flex items-center gap-2">
                    Publicado: há 9h | Prazo de Entrega: 12/04/2025
                  </p>
                  <p className="font-medium w-fit text-xs text-gray-150 border border-gray-800 rounded-md py-1 px-2 mt-2">R$ 10.000 - 15.000</p>
                </div>
              </div>
              <div className="ml-3 grid w-full">
                <p className="font-medium text-xs text-gray-150 mt-4 mb-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati odit eum nam, modi recusandae dolor porro, inventore ea fugit natus quae saepe animi ipsam voluptates autem totam neque vitae excepturi!</p>
                <p className="font-medium text-xs text-gray-150 mb-6">Categoria: TI e Programação</p>
                <div className="flex gap-2">
                  <p className="font-medium text-[10px] text-gray-150 border border-gray-800 rounded-md p-1">NODE.JS</p>
                  <p className="font-medium text-[10px] text-gray-150 border border-gray-800 rounded-md p-1">REACT.JS</p>
                  <p className="font-medium text-[10px] text-gray-150 border border-gray-800 rounded-md p-1">NEXT.JS</p>
                </div>
                <div className="mt-4">
                  <Button className="bg-primary w-fit text-white rounded-md flex items-center px-2 py-1 text-sm">
                    <Send className="h-2 w-2 mr-1" />
                    Enviar Proposta
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};