import { AppTitle } from "@/components/app-title"
import { TeamCarousel } from "./components/team-carousel"
import { TeamSearch } from "./components/team-search"
import { Metrics } from "./components/metrics"
import { DropdownFilter } from "./components/dropdown-filter"
import { useSearchParams } from "react-router-dom"

<<<<<<< HEAD
export const HomeUniversity = () => {
=======
export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams)

  const handleStatusFilter = (newStatus: string) => {
    setSearchParams((prev) => {
      if (newStatus === 'Todas') {
        prev.delete('status');
      } else {
        prev.set('status', newStatus.toLowerCase());
      }
      prev.set('page', '1'); // Reset page when changing filter
      return prev;
    });
  }

>>>>>>> caa057835fb49282c326e503aaf08b99ea648b4b
  return (
    <section className="w-full grid gap-4">
      <AppTitle title="Solicitações de Recomendação" text="Acompanhe as solicitações das equipes!" />
      <TeamCarousel />
      <div className="grid xl:grid-cols-[0.65fr_1fr] gap-6">
        <div className="w-full grid gap-4">
          <AppTitle size="full" title="Equipes" text="Confira os times cadastrados no sistema!" />
          <TeamSearch />
        </div>
        <div className="w-full h-fit grid gap-4">
          <div className="flex items-center justify-between gap-6">
            <AppTitle
              size="full"
              title="Indicadores de Desempenho"
              text="Monitore em tempo real as recomendações solicitadas e concluídas"
            />
            <DropdownFilter
              onStatusChange={handleStatusFilter} 
            />
          </div>
          <Metrics />
        </div>
      </div>
    </section>
  )
}