/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppTitle } from "@/components/app-title"
import { TeamSearch } from "./components/team-search"
import { Metrics } from "./components/metrics"
import { DropdownFilter } from "./components/dropdown-filter"
import { useSearchParams } from "react-router-dom"
import { JobsCarousel } from "./components/jobs-carousel"

export const HomeUniversity = () => {
  const [, setSearchParams] = useSearchParams();

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

  return (
    <section className="w-full grid gap-4">
      <AppTitle title="Solicitações de Recomendação" text="Acompanhe as solicitações das equipes!" />
      <JobsCarousel />
      <div className="grid xl:grid-cols-[0.65fr_1fr] gap-6">
        <div className="w-full content-start grid gap-4">
          <AppTitle size="full" title="Estudantes" text="Confira os estudantes cadastrados em sua universidade!" />
          <TeamSearch />
        </div>
        <div className="w-full h-fit grid gap-4">
          <div className="flex items-center justify-between gap-6">
            <AppTitle
              size="full"
              title="Indicadores de Desempenho"
              text="Monitore em tempo real as aplicações em vagas!"
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