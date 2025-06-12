import { AppTitle } from "@/components/app-title"
import { ProjectCarousel } from "./components/company-carousel"
import { UniversitySearch } from "./components/university-search"
import { Recomedations } from "./components/recomendations"
import { DropdownFilter } from "./components/dropdown-filter"
import { useSearchParams } from "react-router-dom"
import { CreateProjectSheet } from "./components/project";

export const HomeCompany = () => {
  const [, setSearchParams] = useSearchParams();

  const handleStatusFilter = (newStatus: string) => {
    setSearchParams((prev) => {
      if (newStatus === 'Todas') {
        prev.delete('status');
      } else {
        prev.set('status', newStatus.toLowerCase());
      }
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <section className="w-full grid gap-4">
      <div className="w-full flex justify-between items-start">
        <AppTitle title="Projetos" text="Acompanhe os projetos ativos da sua empresa!" />
        <CreateProjectSheet onSuccess={() => console.log("Projeto criado com sucesso!")} />
      </div>
      <ProjectCarousel />
      <div className="grid xl:grid-cols-[0.65fr_1fr] gap-6">
        <div className="w-full grid gap-4">
          <AppTitle size="full" title="Equipes" text="Confira os times cadastrados no sistema!" />
          <UniversitySearch />
        </div>
        <div className="w-full h-fit grid gap-4">
          <div className="flex items-center justify-between gap-6">
            <AppTitle
              size="full"
              title="Indicadores de Desempenho"
              text="Monitore em tempo real as recomendações solicitadas e concluídas"
            />
            <DropdownFilter onStatusChange={handleStatusFilter} />
          </div>
          <Recomedations />
        </div>
      </div>
    </section>
  );
};