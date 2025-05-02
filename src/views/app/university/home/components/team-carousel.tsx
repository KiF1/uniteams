import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { TeamCard } from "./team-card";

export const TeamCarousel = () => {
  const teams = [
    {
      name: "Foursys",
      description: "Empresa é parceira de um Especialista em Estruturação para integrar novas equipes de profissionais na infraestrutura. Buscarmos um profissional quando há diversidade de linguagem nas equipes ou quando há prazo de entrega com equipes disponível. Ver Mais...",
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      members: [
        { name: "João Teixeira Bezerra", role: "Full-Stack", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Luiz Ricardo Barbosa", role: "Developer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Gabriel Ferreira Costa", role: "Designer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "João Teixeira Bezerra", role: "Full-Stack", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Luiz Ricardo Barbosa", role: "Developer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Gabriel Ferreira Costa", role: "Designer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "João Teixeira Bezerra", role: "Full-Stack", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Luiz Ricardo Barbosa", role: "Developer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Gabriel Ferreira Costa", role: "Designer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" }
      ]
    },
    {
      name: "Superbid",
      description: "Empresa é parceira de um Especialista em Estruturação para integrar novas equipes de profissionais na infraestrutura — trabalhando na linguagem para garantir precisão na entrega com equipes disponível. Ver Mais...",
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      members: [
        { name: "João Teixeira Bezerra", role: "Full-Stack", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Luiz Ricardo Barbosa", role: "Developer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Gabriel Ferreira Costa", role: "Designer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" }
      ]
    },
    {
      name: "Pegasus",
      description: "Empresa é parceira de um Especialista em Estruturação para integrar novas equipes de profissionais na infraestrutura e trabalhando na linguagem para garantir precisão na entrega com equipes disponível. Ver Mais...",
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      members: [
        { name: "João Teixeira Bezerra", role: "Full-Stack", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Luiz Ricardo Barbosa", role: "Developer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Gabriel Ferreira Costa", role: "Designer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" }
      ]
    },
    {
      name: "TechPro",
      description: "Empresa é parceira de um Especialista em Estruturação para integrar novas equipes de profissionais na infraestrutura e otimização de recursos técnicos para garantir precisão na entrega com equipes disponível. Ver Mais...",
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      members: [
        { name: "João Teixeira Bezerra", role: "Full-Stack", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Luiz Ricardo Barbosa", role: "Developer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Gabriel Ferreira Costa", role: "Designer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" }
      ]
    },
    {
      name: "DataSync",
      description: "Empresa é parceira de um Especialista em Estruturação para integrar novas equipes de profissionais na infraestrutura de dados e análise para garantir precisão na entrega com equipes disponível. Ver Mais...",
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      members: [
        { name: "João Teixeira Bezerra", role: "Full-Stack", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Luiz Ricardo Barbosa", role: "Developer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Gabriel Ferreira Costa", role: "Designer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" }
      ]
    },
    {
      name: "CloudNet",
      description: "Empresa é parceira de um Especialista em Estruturação para integrar novas equipes de profissionais na infraestrutura de nuvem e serviços para garantir precisão na entrega com equipes disponível. Ver Mais...",
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      members: [
        { name: "João Teixeira Bezerra", role: "Full-Stack", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Luiz Ricardo Barbosa", role: "Developer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" },
        { name: "Gabriel Ferreira Costa", role: "Designer", avatar: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg" }
      ]
    }
  ];

  return (
      <Carousel
        opts={{
          align: "start",
          loop: true
        }}
        className="absolute w-full mt-20"
      >
        <CarouselContent>
          {teams.map((team, index) => (
            <CarouselItem key={index} className="basis-[80%] md:basis-[80%] lg:basis-[80%] xl:basis-1/2">
              <TeamCard team={team} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
  );
};