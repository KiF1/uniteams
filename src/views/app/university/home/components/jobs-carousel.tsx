import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useFetchOpenJobs } from "../hooks/use-fetch-jobs";
import { JobCard } from "./job-card";

export const JobsCarousel = () => {
  const { data:teams } = useFetchOpenJobs();

  return (
    <>
      {teams && teams.length > 0 ? (
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
                  className="pl-2 md:pl-4 w-full xl:w-1/3"
                >
                  <JobCard job={team} />
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
        <span className="text-sm font-semibold text-gray-150">Não existe vagas no momento, busque novamente mais tarde!</span>
      )}
    </>
  );
};