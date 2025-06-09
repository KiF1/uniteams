/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Mail } from "lucide-react";
import { Pagination } from '@/components/pagination';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { getFullImageUrl } from '@/utils/photo-user';
import photo from '@/assets/photo.png'
import { useFetchStudent } from '../hooks/use-fetch-Student';
import { Student } from '../hooks/use-fetch-student';
import { StudentCard } from "./student-card";
import { AddStudentButton } from "./add-student";

export const StudentSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get('page') ?? '1');
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  
  // Usar o hook de busca de estudantes
  const { data, isLoading, isError, error, refetch } = useFetchStudent();

  const students = data?.students || [];
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
      <h2 className="text-sm font-normal text-gray-160 mb-4">Pesquisar Estudantes</h2>
      <div className="flex items-center mb-4 gap-4">
        <Input
          type="text"
          placeholder="Nome do estudante"
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
          Erro ao carregar estudantes: {error?.message || 'Tente novamente mais tarde.'}
        </div>
      ) : students.length === 0 ? (
        <span className="text-sm font-semibold text-gray-150">
          Nenhum estudante encontrado. Tente outra pesquisa.
        </span>
      ) : (
        <>
          <div className="space-y-4 mt-12 max-h-[350px] overflow-y-auto pr-4 mb-4">
            {students.map(student => (
              <div key={student.id} className="items-center justify-between border-b border-gray-800 pb-6">
                <StudentCard student={student} />
              
              </div>
            ))}
          </div>
          {editStudent && (
            <AddStudentButton
              initialData={editStudent}
              onEdit={() => {
                setEditStudent(null);
                refetch();
              }}
            />
          )}
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