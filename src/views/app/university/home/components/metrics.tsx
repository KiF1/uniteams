import { Pagination } from "@/components/pagination";
import { Separator } from "@/components/ui/separator";
import { Building2, CheckCheck, CircleCheck, CircleX, Clock, Hourglass, TriangleAlert, User } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { getFullImageUrl } from "@/utils/photo-user";
import photo from '@/assets/photo.png'
import { useFetchApplications } from "../hooks/use-fetch-applications";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const Metrics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') as 'todas' | 'pendente' | 'aprovada' | 'recusada' || 'todas';
  const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get('page-metrics') ?? '1');

  const formatWithDateFns = (dateString: string): string => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };
  

  const { applications, metrics, isLoading, error } = useFetchApplications({
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
        {applications.map(application => (
          <div key={application.id} className="flex flex-col gap-2 border border-gray-800 rounded-md p-6">
            <div className="grid gap-2">
              <img 
                src={getFullImageUrl(application.empresa_foto) || photo} 
                className={`w-full h-[100px] rounded-md object-contain ${application.empresa_foto ? '' : 'bg-primary'}`}
                alt={application.empresa_foto}
              />
              <div className="ml-3 grid gap-1">
                <p className="font-medium text-lg text-gray-150">{application.nome}</p>
                <Badge 
                  variant={application.status === 'aprovada' ? 'default' : application.status === 'pendente' ? 'secondary' : 'destructive'}
                  className={`gap-1 w-fit mb-2 ${
                    application.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'aprovada' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {application.status === 'pendente' && <TriangleAlert className="w-4 h-4" />}
                  {application.status === 'aprovada' && <CheckCheck className="w-4 h-4" />}
                  {application.status === 'recusada' && <CircleX className="w-4 h-4" />}
                  <span className="text-xs font-semibold">
                    {application.status === 'pendente' && 'Aguardando'}
                    {application.status === 'aprovada' && 'Estudante selecionado'}
                    {application.status === 'recusada' && 'Estudante não selecionado'}
                  </span>
                </Badge>
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4" />
                  <strong className="font-medium text-sm text-gray-150">{application.empresa_nome}</strong>
                </div>
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4" />
                  <strong className="font-medium text-sm text-gray-150">{application.estudante_nome}</strong>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4" />
                  <strong className="font-medium text-sm text-gray-150">{formatWithDateFns(application.created_at)}</strong>
                </div>
                <Link
                  to={`app/student/view/${application.vaga_id}`}
                  className="text-sm text-primary font-normal underline hover:text-primary-dark"
                >
                  Visualizar Vaga
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid gap-4 pr-8 pb-6">
        <Separator orientation="horizontal" />
        <Pagination
          pageIndex={pageIndex}
          totalCount={applications.length}
          perPage={10}
          onPageChange={handlePaginate}
        />
      </div>
    </div>
  );
};