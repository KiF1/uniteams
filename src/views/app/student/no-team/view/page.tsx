import { Pagination } from "@/components/pagination";
import { Mail, MapPinned, PhoneCall } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

export const ViewStudentNoTeam = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().transform((page) => page - 1).parse(searchParams.get('page') ?? '1');

  const handlePaginate = (pageIndex: number) => {
    setSearchParams((prev) => {
      prev.set('page', (pageIndex + 1).toString())

      return prev
    })
  }
    
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

  return(
    <section className="w-full grid grid-cols-1 lg:grid-cols-[0.65fr_1fr] xl:grid-cols-[0.25fr_1fr] gap-6 md:gap-12">
      <div className="w-full rounded-lg border flex flex-col border-gray-800 shadow-xl h-fit">
        <div className="w-full h-32 bg-primary rounded-t-lg" />
        <div className="relative mx-auto -mt-16">
          <img 
            src='https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg'
            className={`w-32 h-32 rounded-full border-4 border-gray-800 'object-contain '}`}
          />
        </div>
        <div className="w-full px-6 pb-12 flex flex-col gap-1 mt-4">
          <h1 className="text-gray-150 font-bold text-base">Foursys</h1>
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <strong className="text-gray-160 font-normal text-sm ">foursys@gmail.com</strong>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3 h-3" />
            <strong className="text-gray-160 font-normal text-xs">(81) 98834-2314</strong>
          </div>
          <div className="flex items-center gap-2">
            <MapPinned className="w-3 h-3" />
            <span className="text-gray-160 font-normal text-xs">Rua Local H, 107 - Recife | PE</span>
          </div>
        </div>
      </div>
      <div className="w-full rounded-lg border flex flex-col border-gray-800 shadow-xl gap-4 p-8">
        <div className="grid gap-2">
          <strong className="text-lg font-semibold text-gray-150">Descrição</strong>
          <p className="mb-0 font-normal text-gray-160 text-sm">Lorem ipsum dolor sit amet. Eos fuga nihil qui exercitationem velit aut suscipit laudantium non perspiciatis ipsum. Sed laboriosam omnis aut vitae quia a galisum earum in quia iste. Qui dolorem reiciendis non rerum harum est tempore quam. Et doloribus deleniti aut nesciunt Quis At ratione earum At magnam blanditiis.
            Quo debitis dolores et enim porro aut nihil quod a doloremque consequatur. Qui fugiat molestiae ut velit deserunt non dolorum vitae ut sunt voluptas ut autem sapiente et deleniti accusamus. Sed nostrum reprehenderit vel optio aperiam est modi facere!</p>
        </div>
        <strong className="text-lg font-semibold text-gray-150 mb-2">Projetos</strong>
        <div className="max-h-[240px] overflow-y-auto grid lg:grid-cols-2 gap-6 pr-4 mb-4">
          {teams.map(team => (
            <div key={team.id} className="flex flex-col md:flex-row gap-4 items-center justify-between border rounded-md py-6 px-4 border-gray-800 pb-6">
              <div className="flex-1 flex items-start">
                <img 
                  src={team.logo} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-800"
                />
                <div className="ml-3 grid">
                  <p className="font-medium text-lg text-gray-150">Sistema de Gerenciamento</p>
                  <p className="font-medium text-xs text-gray-150">Sistema de Gerenciamento Inteligente
                  Organize, controle e otimize seus processos com facilidade. Nosso sistema centraliza informações, 
                  automatiza tarefas e oferece uma visão clara para decisões mais rápidas e eficientes.</p>
                  <Link
                    to="/app/student/view/2"
                    className="text-xs mt-1 text-primary font-normal underline hover:text-primary-dark"
                  >
                    Visualizar Projeto
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 pr-8 mt-auto">
          <Pagination
            pageIndex={pageIndex}
            totalCount={teams.length}
            perPage={10}
            onPageChange={handlePaginate}
          />
        </div>
      </div>
    </section>
  )
}