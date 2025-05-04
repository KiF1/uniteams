import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TeamCard } from "./team-card";
import { useFetchRecommendationRequests } from "../hooks/fetch-recommendation-requests";

export const TeamCarousel = () => {
  const { data:teams } = useFetchRecommendationRequests();

  return (
    <>
      {teams ? (
        <div className="w-full max-w-full overflow-hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              containScroll: "trimSnaps"
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {teams.map((team, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-2 md:pl-4 w-full xl:w-1/2"
                >
                  <TeamCard team={team} />
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
        <span className="text-sm font-normal text-gray-160">Não existe solicitações de recomendações!</span>
      )}
    </>
  );
};