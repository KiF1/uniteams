import { Button } from "@/components/ui/button";
import { useFetchAplicacoesEmpresa } from "../hooks/fetch-recomendations";
import { useUpdateRecommendation } from "../hooks/use-update-recomendation";
import { useState } from "react";

export const Recomedations = () => {
  const empresaId = sessionStorage.getItem("userId");
  const { data: aplicacoes = [], isLoading, error } = useFetchAplicacoesEmpresa(empresaId || "");
  const { mutate: approve } = useUpdateRecommendation("aprovada");
  const { mutate: reject } = useUpdateRecommendation("recusada");
  const [approveForm, setApproveForm] = useState<{ [key: string]: boolean }>({});
  const [approveData, setApproveData] = useState<{ [key: string]: any }>({});

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar recomendações</div>;

  const handleApproveClick = (aplicacaoId: string) => {
    setApproveForm((prev) => ({ ...prev, [aplicacaoId]: true }));
  };
  // Remova ou comente a função não utilizada
  // const handleApproveChange = (aplicacaoId: string, field: string, value: string) => {
  //   // ...código não utilizado...
  // }
  const handleApproveSubmit = (aplicacaoId: string) => {
    const data = approveData[aplicacaoId] || {};
    approve({
      equipe_id: aplicacaoId,
      nome_responsavel: data.nome_responsavel,
      email_responsavel: data.email_responsavel,
      cargo_responsavel: data.cargo_responsavel,
      descricao: data.descricao,
    });
    setApproveForm((prev) => ({ ...prev, [aplicacaoId]: false }));
    setApproveData((prev) => ({ ...prev, [aplicacaoId]: {} }));
  };

  return (
    <div className="grid gap-4">
      {aplicacoes.map((aplicacao: any) => (
        <div key={aplicacao.id} className="border rounded p-4 flex flex-col gap-2">
          <div>
            <strong>ID da Vaga:</strong> {aplicacao.vaga_id} <span className="text-xs text-gray-400">Candidato: {aplicacao.candidato_id}</span>
          </div>
          <div>Status: <span className="capitalize">{aplicacao.status}</span></div>
       
          {aplicacao.status === "pendente" && (
            <div className="flex flex-col gap-2 mt-2">
              {approveForm[aplicacao.id] ? (
                <div className="flex flex-col gap-2">
                 
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleApproveSubmit(aplicacao.id)} className="bg-green-600 text-white text-sm flex-1">Confirmar Contratação</Button>
                    <Button variant="outline" onClick={() => setApproveForm(prev => ({ ...prev, [aplicacao.id]: false }))} className="text-gray-400 border-gray-700 flex-1">Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => handleApproveClick(aplicacao.id)} className="bg-green-600 text-white text-sm flex-1">Contratar</Button>
                  <Button onClick={() => reject({ equipe_id: aplicacao.id })} className="bg-red-600 text-white text-sm flex-1">Recusar</Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};