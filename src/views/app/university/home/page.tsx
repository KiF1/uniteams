import { AppTitle } from "@/components/app-title"
import { TeamCarousel } from "./components/team-carousel"

export const Home = () => {
  return (
    <section className="w-full grid gap-4">
      <AppTitle title="Solicitações de Recomendação" text="Acompanhe as solicitações das equipes!" />
      <TeamCarousel />
    </section>
  )
}