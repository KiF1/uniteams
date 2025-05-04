import { AppTitle } from "@/components/app-title"
import { TeamCarousel } from "./components/team-carousel"
import { TeamSearch } from "./components/team-search"
import { Metrics } from "./components/metrics"
import { DropdownFilter } from "./components/dropdown-filter"

export const HomeUniversity = () => {
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
            <DropdownFilter />
          </div>
          <Metrics />
        </div>
      </div>
    </section>
  )
}