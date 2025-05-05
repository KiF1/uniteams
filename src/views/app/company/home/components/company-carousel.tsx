import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TeamCard } from "./team-card";
import { useFetchProjects } from "../hooks/fetch-projects";

export const ProjectCarousel = () => {
  const { data, isLoading } = useFetchProjects();

  if (isLoading) {
    return <span className="text-sm text-gray-150">Carregando projetos...</span>;
  }

  const projetos= data?.semEquipe || [];
  console.log(projetos);
  return (
    <>
      {projetos.length > 0 ? (
        <div className="w-full max-w-full overflow-hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {projetos.map((projeto) => (
                <CarouselItem
                  key={projeto.id}
                  className="pl-2 md:pl-4 w-full xl:w-1/2"
                >
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0 mr-2" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      ) : (
        <span className="text-sm font-semibold text-gray-150">
          Nenhum projeto no momento!
        </span>
      )}
    </>
  );
};
