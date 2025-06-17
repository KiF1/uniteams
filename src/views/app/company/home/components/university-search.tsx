/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, MessageSquare, Loader2 } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { Pagination } from '@/components/pagination';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { getFullImageUrl } from '@/utils/photo-user';
import photo from '@/assets/photo.png'
import { useFetchUniversity } from '../hooks/fetch-university';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

export const UniversitySearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get('page') ?? '1');
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Usar o hook de busca de universidades
  const { data, isLoading, isError, error, refetch } = useFetchUniversity();

  const universities = data?.universities || [];
  const totalCount = data?.totalCount || 0;

  // Atualizar a pesquisa ao clicar no botão ou pressionar Enter
  const handleSearch = () => {
    setSearchParams((prev) => {
      if (searchInput) {
        prev.set('query', searchInput);
      } else {
        prev.delete('query');
      }
      prev.set('page', '1');
      return prev;
    });
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

  useEffect(() => {
    const queryParam = searchParams.get('query');
    if (queryParam) {
      setSearchInput(queryParam);
    }
    if (!searchParams.has('query') && !searchParams.has('page')) {
      setSearchParams((prev) => {
        prev.set('page', '1');
        return prev;
      });
    }
  }, []);

  return (
    <div className="w-full bg-white p-6 border rounded-md border-gray-800">
      <h2 className="text-sm font-normal text-gray-160 mb-4">Pesquisar universidades</h2>
      
      <div className="flex items-center mb-4 gap-4">
        <Input
          type="text"
          placeholder="Nome da universidade"
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
          Erro ao carregar universidades: {error?.message || 'Tente novamente mais tarde.'}
        </div>
      ) : universities.length === 0 ? (
        <span className="text-sm font-semibold text-gray-150">
          Nenhuma universidade encontrada. Tente outra pesquisa.
        </span>
      ) : (
        <>
          <div className="space-y-4 mt-12 max-h-[350px] overflow-y-auto pr-4 mb-4">
            {universities.map(university => (
              <div key={university.id} className="flex flex-col md:flex-row items-center justify-between border-b border-gray-800 pb-6">
                <div className="flex-1 flex items-start">
                  <div className="ml-3 grid">
                    <p className="font-medium text-base text-gray-150">{university.nome}</p>
                    <p className="text-xs text-gray-500 mb-1">
                      {university.estudantes?.length || 0} aluno{(university.estudantes?.length === 1 ? '' : 's')} cadastrado{(university.estudantes?.length === 1 ? '' : 's')}
                    </p>
                    {(university.cidade || university.estado) && (
                      <p className="font-medium text-xs text-gray-150 flex items-center gap-2">
                        {university.cidade}{university.cidade && university.estado ? ', ' : ''}{university.estado}
                      </p>
                    )}
                  </div>
                </div>
                <Separator orientation="vertical" className="hidden md:block mx-4 h-20" />

                <div className="w-fit grid grid-cols-2 md:grid-cols-1 md:justify-items-end gap-2">
                  <Button
                    className="bg-primary w-fit text-white rounded-md flex items-center px-3 py-1"
                    onClick={() => {
                      setSelectedUniversity(university.id);
                      setModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button className="text-gray-160 w-fit text-sm border flex items-center gap-2 border-gray-800 rounded-md bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contato
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* Modal para exibir estudantes */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Estudantes</DialogTitle>
              </DialogHeader>
              {(() => {
                const selected = universities.find(u => u.id === selectedUniversity);
                const estudantes = selected?.estudantes ?? [];
                if (!selected) return <span className="text-sm text-gray-500">Universidade não encontrada.</span>;
                return estudantes.length === 0 ? (
                  <span className="text-sm text-gray-500">Nenhum estudante cadastrado nesta universidade.</span>
                ) : (
                  <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {estudantes.map(est => (
                      <li key={est.id} className="flex items-center gap-3">
                        <img
                          src={getFullImageUrl(est.foto) || photo}
                          alt={`Foto do estudante ${est.nome}`}
                          className="w-8 h-8 rounded-full object-cover border border-gray-400"
                        />
                        <span className="font-medium text-gray-900">{est.nome}</span>
                        <span className="text-xs text-gray-500">{est.email}</span>
                        <span className="text-xs text-gray-400 ml-auto">{new Date(est.created_at).toLocaleDateString('pt-BR')}</span>
                      </li>
                    ))}
                  </ul>
                );
              })()}
              <DialogClose asChild>
                <Button variant="ghost" className="mt-4 w-full" onClick={() => setSelectedUniversity(null)}>
                  Fechar
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
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