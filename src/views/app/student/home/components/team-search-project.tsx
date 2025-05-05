/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search,  Loader2, Mail, University, TriangleAlert } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { Pagination } from '@/components/pagination';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { getFullImageUrl } from '@/utils/photo-user';
import photo from '@/assets/photo.png'
import { useFetchTeam } from '../hooks/use-fetch-tem';

export const TeamSearchProject = () => {
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
    <div className="w-full bg-white p-4 border rounded-md border-gray-800 max-h-[500px] overflow-hidden">
      <h2 className="text-sm font-normal text-gray-160 mb-3">Pesquisar empresas</h2>
      
      <div className="flex items-center mb-3 gap-3">
        <Input
          type="text"
          placeholder="Nome da empresa"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-8 rounded-md border border-gray-800"
        />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleSearch}
          className="rounded-md border border-gray-800 p-3"
        >
          <Search className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-red-500 p-3 bg-red-50 rounded-md">
          Erro ao carregar empresas: {error?.message || 'Tente novamente mais tarde.'}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Nenhuma empresa encontrada. Tente outra pesquisa.
        </div>
      ) : (
        <>
          <div className="space-y-4 mt-8 max-h-[300px] overflow-y-auto pr-3 mb-4">
            {teams.map(team => (
              <div key={team.id} className="flex flex-col items-center justify-between border border-gray-800 rounded-md p-4">
                <div className="flex items-start w-full">
                  <img 
                    src={getFullImageUrl(team.foto) || photo} 
                    alt={`Foto da empresa ${team.nome}`}
                    className="w-12 h-12 rounded-full object-cover border-2 bg-primary border-gray-800 mr-2"
                  />
                  <div className="ml-2 grid">
                    <p className="font-medium text-sm text-gray-150">{team.nome}</p>
                    <p className="font-medium text-xs text-gray-150 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {team.email || 'Sem email'}
                    </p>
                    {team.instituicao?.nome && (
                      <p className="font-medium text-xs text-gray-150 flex items-center gap-1">
                        <University className="w-3 h-3" /> {team.instituicao.nome}
                      </p>
                    )}
                    <Link
                      to="/app/student/view/2"
                      className="text-xs mt-1 text-primary font-normal underline hover:text-primary-dark"
                    >
                      Visualizar Empresa
                    </Link>
                  </div>
                </div>
                <Separator orientation="horizontal" className="my-3 w-full" />
                <div className="grid w-full">
                  <p className="font-medium text-sm text-gray-150">Criação de Sistema de Boletim</p>
                  <p className="font-medium text-xs text-gray-150 mb-1">23/02/2025 - 12/10/2025</p>
                  <p className="font-medium text-xs text-gray-150 mb-3 border border-gray-800 rounded-md py-1 px-2 w-fit">R$ 10.000 - 15.0000</p>
                </div>
                <div className='p-2 w-full border-l-4 mb-1 flex items-center gap-2 bg-yellow-50 text-yellow-800 border-l-yellow-400'>
                  <TriangleAlert className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-800">Aguardando</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-3 pr-6 mt-auto">
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