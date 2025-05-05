import { AppTitle } from "@/components/app-title"
import { TeamCarousel } from "../../home/components/team-carousel"
import { TeamSearch } from "../../home/components/team-search"
import { TeamCardProposalNoTeam } from "../../home/components/team-card-proposal-no-team"
import { Metrics } from "../../home/components/metrics"
import { DropdownFilter } from "../../home/components/dropdown-filter"
import { Button } from "@/components/ui/button"; 

export const HomeStudentNoTeam = () => {
   return (
      <section className="w-full grid gap-4">
        <div className="flex items-center justify-between">
          <AppTitle title="Equipes Contratando" text="Veja os principais times que estão com vagas disponiveis e solicite  sua participação!" />
          <Button className="bg-primary w-fit text-white rounded-md flex items-center px-3 py-1">
            <span className="text-lg font-bold">+</span> Criar equipe
          </Button>
        </div>
        <TeamCardProposalNoTeam />
        <TeamCarousel />
        <div className="grid xl:grid-cols-[0.65fr_1fr] lg:grid-cols-1 gap-6">
          <div className="w-full grid gap-4">
            <AppTitle size="full" title="Equipes" text="Confira os times cadastrados no sistema!" />
            <TeamSearch title="Pesquisar equipes" placeholder="Nome da equipe" />
          </div>
          <div className="w-full h-fit grid gap-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
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