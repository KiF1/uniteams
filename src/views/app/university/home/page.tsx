import { AppTitle } from "@/components/app-title"
import { TeamCarousel } from "./components/team-carousel"
import TeamSearch from "./components/team-search"

export const Home = () => {
  return (
    <section className="w-full grid gap-4">
      <AppTitle title="Solicitações de Recomendação" text="Acompanhe as solicitações das equipes!" />
      <TeamCarousel />
      <div className="grid lg:grid-cols-[0.65fr_1fr] gap-6">
        <div className="w-full grid gap-4">
          <AppTitle size="full" title="Equipes" text="Confira os times da sua universidade!" />
          <TeamSearch />
        </div>
      </div>
    </section>
  )
}