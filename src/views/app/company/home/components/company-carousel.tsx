import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useFetchVagasAbertasEmpresa, VagaAberta } from "../hooks/fetch-projects";
import { useUpdateVaga } from "../hooks/use-update-vagas";

export const ProjectCarousel = () => {
  const empresaId = sessionStorage.getItem("userId");
  const { data: projetos, isLoading } = useFetchVagasAbertasEmpresa(empresaId || '');
  const projetosArray = Array.isArray(projetos) ? projetos : [];
  const [selectedVaga, setSelectedVaga] = useState<VagaAberta | null>(null);
  const [editData, setEditData] = useState<Partial<VagaAberta>>({});
  const { update, remove } = useUpdateVaga();

  const handleOpenModal = (vaga: VagaAberta) => {
    setSelectedVaga(vaga);
    setEditData(vaga);
  };

  const handleCloseModal = () => {
    setSelectedVaga(null);
    setEditData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (selectedVaga) {
      update.mutate({ ...editData, id: selectedVaga.id } as any, {
        onSuccess: handleCloseModal,
      });
    }
  };

  const handleDelete = () => {
    if (selectedVaga) {
      remove.mutate(selectedVaga.id, {
        onSuccess: handleCloseModal,
      });
    }
  };

  if (isLoading) {
    return <span className="text-sm text-gray-150">Carregando projetos...</span>;
  }

  if (projetosArray.length === 0) {
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
          {projetosArray.map((projeto: VagaAberta) => (
            <CarouselItem key={projeto.id} className="pl-2 md:pl-4 w-full xl:w-1/4">
              <div className="h-full border rounded-2xl shadow-sm bg-white p-6 flex flex-col justify-between">
                {/* Topo: Título e Preço */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {projeto.nome}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Publicado: {projeto.created_at ? new Date(projeto.created_at).toLocaleDateString() : "-"} |
                      Prazo de Entrega: {projeto.prazo ? new Date(projeto.prazo).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  <span className="text-sm font-medium border text-gray-400 px-4 py-1 rounded-md whitespace-nowrap">
                    {typeof projeto.valor === "number"
                      ? `R$ ${projeto.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      : "Valor não informado"}
                  </span>
                </div>

                {/* Descrição */}
                <p className="text-sm text-gray-100 mt-4">
                  {projeto.descricao}
                </p>

                {/* Categoria e link */}
                <div className="text-sm text-gray-100 mt-4">
                  <p>
                    <button className="text-gray-100 underline hover:text-blue-700" onClick={() => handleOpenModal(projeto)}>
                      Ver mais detalhes
                    </button>
                  </p>
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
      {/* Modal de detalhes/edição/exclusão */}
      <Dialog open={!!selectedVaga} onOpenChange={open => !open && handleCloseModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Vaga</DialogTitle>
            <DialogDescription>Veja, edite ou exclua esta vaga.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <label className="text-xs">Nome</label>
            <Input name="nome" value={editData.nome || ""} onChange={handleChange} />
            <label className="text-xs">Descrição</label>
            <Textarea name="descricao" value={editData.descricao || ""} onChange={handleChange} />
            <label className="text-xs">Prazo</label>
            <Input name="prazo" type="date" value={editData.prazo ? editData.prazo.slice(0,10) : ""} onChange={handleChange} />
            <label className="text-xs">Valor</label>
            <Input name="valor" type="number" value={editData.valor ?? ""} onChange={handleChange} />
            <label className="text-xs">Status</label>
            <Input name="status" value={editData.status || ""} onChange={handleChange} />
          </div>
          <DialogFooter className="flex justify-between mt-4">
            <Button variant="destructive" onClick={handleDelete} disabled={remove.isPending}>
              Apagar
            </Button>
            <Button onClick={handleUpdate} disabled={update.isPending}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
