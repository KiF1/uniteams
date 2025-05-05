/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Mail, University } from "lucide-react";
import { Pagination } from '@/components/pagination';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { getFullImageUrl } from '@/utils/photo-user';
import photo from '@/assets/photo.png'
import { useFetchTeam } from '../hooks/use-fetch-tem';

interface TeamSearchProps {
  title: string;
  placeholder: string;
}

export const TeamSearch = ({ title, placeholder }: TeamSearchProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get('page') ?? '1');
  
  // Usar o hook de busca de empresas (agora com enabled controlado)
  const { data, isLoading, isError, error, refetch } = useFetchTeam();

  const teams = data?.teams || [];
  const totalCount = data?.totalCount || 0;

  // Atualizar a pesquisa ao clicar no botão ou pressionar Enter
  const handleSearch = () => {
    // Atualizar os parâmetros de URL para acionar a pesquisa
    setSearchParams((prev) => {
      if (searchInput) {
        prev.set('query', searchInput);
      } else {
        prev.delete('query');
      }
      prev.set('page', '1');
      return prev;
    });

    // Acionar manualmente a consulta 
    refetch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePaginate = (pageIndex: number) => {
    setSearchParams((prev) => {
      prev.set('page', (pageIndex + 1).toString());
      return prev;
    });
  };

  // Recuperar o estado da pesquisa a partir da URL ao carregar a página
  useEffect(() => {
    const queryParam = searchParams.get('query');
    if (queryParam) {
      setSearchInput(queryParam);
    }
    
    // Realizar a primeira carga de dados quando o componente for montado
    // (isso é opcional, remova se quiser que a pesquisa seja acionada apenas por clique)
    if (!searchParams.has('query') && !searchParams.has('page')) {
      setSearchParams((prev) => {
        prev.set('page', '1');
        return prev;
      });
    }
  }, []);

  return (
    <div className="w-full bg-white p-6 border rounded-md border-gray-800">
      <h2 className="text-sm font-normal text-gray-160 mb-4">{title}</h2>
      
      <div className="flex items-center mb-4 gap-4">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10 rounded-md border border-gray-800"
        />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleSearch}
          className="rounded-md border border-gray-800 p-4"
        >
          <Search className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

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
        <>
          <div className="space-y-4 mt-12 max-h-[350px] overflow-y-auto pr-4 mb-4">
            {teams.map(team => (
              <div key={team.id} className="flex flex-col items-center justify-between border-b border-gray-800 pb-6">
                <div className="w-full flex items-start">
                  <img 
                    src={getFullImageUrl(team.foto) || photo} 
                    alt={`Foto da empresa ${team.nome}`}
                    className="w-16 h-16 rounded-full object-cover border-2 bg-primary border-gray-800"
                  />
                  <div className="ml-3 grid">
                    <p className="font-medium text-base text-gray-150">{team.nome}</p>
                    <p className="font-medium text-xs text-gray-150 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> {team.email || 'Sem email'}
                    </p>
                    {team.instituicao?.nome && (
                      <p className="font-medium text-xs text-gray-150 flex items-center gap-2">
                        <University className="w-3 h-3" /> {team.instituicao.nome}
                      </p>
                    )}
                    <Link
                      to="/app/student/view/2"
                      className="text-xs mt-1 text-primary font-normal underline hover:text-primary-dark"
                    >
                      Visualizar Equipe
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 pr-8 mt-auto">
            <Pagination
              pageIndex={pageIndex}
              totalCount={totalCount}
              perPage={10}
              onPageChange={handlePaginate}
            />
          </div>
        </>
      )}
    </div>
  );
};