import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFetchProjects } from "../hooks/fetch-projects";

// Adicionar tipagem para os projetos
interface Projeto {
  id: string;
  nome: string;
  createdAt: string;
  prazo: string;
  valor: number;
  descricao: string;
  categoria: string;
  tecnologias?: string[];
}

// Remover o tipo genérico do hook e ajustar o tipo de retorno
export const ProjectCarousel = () => {
  const { data: projetos, isLoading } = useFetchProjects(); // Remover o tipo genérico

  // Garantir que projetos seja tratado como um array ou undefined
  const projetosArray = Array.isArray(projetos) ? projetos : [];

  if (isLoading) {
    return <span className="text-sm text-gray-150">Carregando projetos...</span>;
  }

  if (projetosArray.length === 0) { // Usar projetosArray para verificar o comprimento
    return (
      <span className="text-sm font-semibold text-gray-150">
        Nenhum projeto no momento!
      </span>
    );
  }

  return (
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
          {projetosArray.map((projeto: Projeto) => ( // Usar projetosArray no map
            <CarouselItem key={projeto.id} className="pl-2 md:pl-4 w-full xl:w-1/4">
              <div className="h-full border rounded-2xl shadow-sm bg-white p-6 flex flex-col justify-between">
                {/* Topo: Título e Preço */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {projeto.nome}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Publicado: {projeto.createdAt}| Propostas: Y | Prazo de Entrega:{" "}
                      {new Date(projeto.prazo).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium border text-gray-400 px-4 py-1 rounded-md whitespace-nowrap">
                    R$ {projeto.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Descrição */}
                <p className="text-sm text-gray-100 mt-4">
                  {projeto.descricao}
                </p>

                {/* Categoria e link */}
                <div className="text-sm text-gray-100 mt-4">
                  <p>Categoria: {projeto.categoria}</p>
                  <p>
                    Subcategoria: {" "}
                    <button className="text-gray-100 underline hover:text-blue-700">
                      Ver mais detalhes
                    </button>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {projeto.tecnologias?.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-xs border rounded-md px-3 py-1 "
                    >
                      {tech.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 mr-2" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};
