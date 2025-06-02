import { Pagination } from "@/components/pagination";
import { ArrowRight, Building2, Clock, Mail, MapPinned, PhoneCall, User } from "lucide-react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useApplicationsSuccess, useViewUniversity } from "./hooks/user-view-university";
import { applyPhoneMask } from "@/utils/mask-phone";
import { getFullImageUrl } from "@/utils/photo-user";
import photo from '@/assets/photo.png'
import { formatTime } from "@/utils/format-date";

export const ViewUniversity = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get('page') ?? '1');
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');

  const { universityId } = useParams<{ universityId: string }>();
  const { data: university } = useViewUniversity(universityId || '');
  const { data: jobs } = useApplicationsSuccess(universityId || '', pageIndex + 1, 10);

  const handlePaginate = (pageIndex: number) => {
    setSearchParams((prev) => {
      prev.set('page', (pageIndex + 1).toString())

      return prev
    })
  }

  const redirectToEdit = () => {
    navigate(`/app/university/edit/${universityId}`);
  }

  return(
    <section className="w-full grid grid-cols-1 md:grid-cols-[0.45fr_1fr] gap-6 md:gap-12">
      <div className="w-full rounded-lg border flex flex-col border-gray-800 shadow-xl h-fit">
        <div className="w-full h-32 bg-primary rounded-t-lg" />
        <div className="relative mx-auto -mt-16">
            <img 
              src={getFullImageUrl(university?.foto) || photo} 
              className={`w-32 h-32 rounded-full border-4 border-gray-800 ${university?.foto ? 'object-cover' : 'object-contain p-3 bg-primary'}`}
            />
        </div>
        <div className="w-full px-6 pb-12 flex flex-col gap-1 mt-4">
          <h1 className="text-gray-150 font-bold text-base">{university?.nome}</h1>
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <strong className="text-gray-160 font-normal text-xs">{university?.email}</strong>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3 h-3" />
            <strong className="text-gray-160 font-normal text-xs">{university?.telefone && applyPhoneMask(university?.telefone)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <MapPinned className="w-3 h-3" />
            <span className="text-gray-160 font-normal text-xs">{university?.endereco.rua}, {university?.endereco.numero} - {university?.endereco.cidade} | {university?.endereco.bairro}</span>
          </div>
          {universityId === userId && (
            <button onClick={redirectToEdit} className="bg-primary px-4 py-2 mt-6 w-full rounded-md text-center text-sm font-normal text-white flex items-center justify-center gap-2">
              Editar Universidade
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="w-full rounded-lg border flex flex-col border-gray-800 shadow-xl gap-4 p-8">
        <div className="grid gap-2">
          <strong className="text-lg font-semibold text-gray-150">Descrição</strong>
          <p className="mb-0 font-normal text-gray-160 text-sm whitespace-pre-line">{university?.descricao}</p>
        </div>
        {jobs && jobs.total > 0 && (
          <>
            <strong className="text-lg font-semibold text-gray-150 mb-2">Estudantes Selecionados</strong>
            <div className="max-h-[240px] overflow-y-auto grid lg:grid-cols-2 gap-6 pr-4 mb-4">
              {jobs.data.map(job => (
                <div key={job.id} className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex-1 flex items-start">
                    <img 
                      src={getFullImageUrl(job.empresa_foto) || photo} 
                      className="w-16 h-16 rounded-full object-cover border-2 bg-primary border-gray-800"
                    />
                    <div className="ml-3 grid">
                      <strong className="font-medium text-base text-gray-150">{job.nome}</strong>
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4" />
                        <strong className="font-medium text-sm text-gray-150">{job.empresa_nome}</strong>
                      </div>
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4" />
                        <strong className="font-medium text-sm text-gray-150">{job.estudante_nome}</strong>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4" />
                        <strong className="font-medium text-sm text-gray-150">{formatTime(job.created_at)}</strong>
                      </div>
                      <Link
                        to={`app/student/view/${job.vaga_id}`}
                        className="text-sm text-primary font-normal underline hover:text-primary-dark"
                      >
                        Visualizar Vaga
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-4 pr-8 mt-auto">
              <Pagination
                pageIndex={pageIndex}
                totalCount={jobs.total}
                perPage={10}
                onPageChange={handlePaginate}
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}