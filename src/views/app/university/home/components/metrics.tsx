import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCheck, CircleCheck, CircleX, Hourglass, TriangleAlert } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

export const Metrics = () => {
  const teams = [
    {
      id: 1,
      name: 'Foursys',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    },
    {
      id: 2,
      name: 'Superbid',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    },
    {
      id: 3,
      name: 'Pegasus',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    },
    {
      id: 4,
      name: 'UrbanCraft',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    },
    {
      id: 5,
      name: 'Pixel Perfection',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    }
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get('page') ?? '1');

  const handlePaginate = (pageIndex: number) => {
    setSearchParams((prev) => {
      prev.set('page', (pageIndex + 1).toString())

      return prev
    })
  }

  return (
    <div className="flex-1 grid gap-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="w-full md:w-fit grid gap-2 p-6 border rounded-md border-gray-800">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4" />
            <strong className="text-sm font-semibold text-gray-150">Solicitações Pendentes</strong>
          </div>
          <strong className="text-4xl font-semibold text-gray-150">008</strong>
        </div>
        <div className="w-full md:w-fit  grid gap-2 p-6 border rounded-md border-gray-800">
          <div className="flex items-center gap-2">
            <CircleCheck  className="w-4 h-4" />
            <strong className="text-sm font-semibold text-gray-150">Solicitações Aprovadas</strong>
          </div>
          <strong className="text-4xl font-semibold text-gray-150">008</strong>
        </div>
        <div className="w-full md:w-fit  grid gap-2 p-6 border rounded-md border-gray-800">
          <div className="flex items-center gap-2">
            <CircleX  className="w-4 h-4" />
            <strong className="text-sm font-semibold text-gray-150">Solicitações Reprovadas</strong>
          </div>
          <strong className="text-4xl font-semibold text-gray-150">008</strong>
        </div>
      </div>
      <div className="grid xl:grid-cols-2 gap-6 max-h-[300px] overflow-y-auto pr-4 mb-6">
        {teams.map(team => (
          <div key={team.id} className="flex flex-col gap-2 border border-gray-800 rounded-md p-6">
            <div className="flex-1 flex items-start">
              <img 
                src={team.logo} 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-800"
              />
              <div className="ml-3 grid">
                <p className="font-medium text-lg text-gray-150">{team.name}</p>
                <p className="font-medium text-xs text-gray-150">equipe@gmail.com</p>
                <p className="font-medium text-xs text-gray-150">12/04/2025 | 6 Projetos</p>
                <span className="text-xs text-primary font-normal underline cursor-pointer">Vizualizar Equipe</span>
              </div>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <div className='p-2 w-full border-l-4 flex items-center gap-2 bg-yellow-50 text-yellow-800 border-l-yellow-400'>
              <TriangleAlert className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-800">Aguardando</span>
            </div>
            <div className="w-full flex items-center mt-4 gap-2">
              <Button className="bg-primary flex-1 text-white rounded-md flex items-center px-3 py-1">
                <CheckCheck className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button className="text-gray-160 flex-1 text-sm border flex items-center gap-2 border-gray-800 rounded-md bg-transparent">
                <CircleX className="h-4 w-4 mr-1" />
                Reprovar
              </Button>
            </div>
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