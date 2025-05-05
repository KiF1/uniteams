import { AppTitle } from "@/components/app-title"
import { TeamCarousel } from "./components/team-carousel"
import { TeamSearch } from "./components/team-search"
import { TeamSearchProject } from "./components/team-search-project"
import { TeamCardProposal } from "./components/team-card-proposal"

export const HomeStudent = () => {
  return (
    <section className="w-full grid">
      <AppTitle title="Projetos" text="Acompanhe os projetos postados recentemente pelas empresas" />
      <TeamCardProposal />
      <TeamCarousel />
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="w-full grid gap-4">
          <AppTitle size="full" title="Empresas" text="Veja os melhores times para o seu projeto!" />
          <TeamSearch title="Pesquisar empresas" placeholder="Nome da empresa" />
        </div>
        <div className="w-full grid gap-4">
          <AppTitle size="full" title="Integrantes" text="Monitore membros e solicitações do seu time!" />
          <TeamSearch title="Pesquisar integrantes" placeholder="Nome do integrante" />
        </div>
        <div className="w-full grid gap-4">
          <AppTitle size="full" title="Projetos" text="Veja os melhores projetos para o seu time!" />
          <TeamSearchProject />
        </div>
      </div>
    </section>
  )
}