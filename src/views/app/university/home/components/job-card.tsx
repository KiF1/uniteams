import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getFullImageUrl } from "@/utils/photo-user";
import photo from '@/assets/photo.png';
import { formatTime } from "@/utils/format-date";
import { OpenJob } from "../hooks/use-fetch-jobs";
import { Building2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFetchStudent } from '../hooks/use-fetch-student';
import { useMutation } from "@tanstack/react-query";
import { supabase } from '@/services/supabase';

interface Props {
  job: OpenJob;
}

export const JobCard = ({ job }: Props) => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useFetchStudent();
  const students = data?.students || [];
  const universidade_id = sessionStorage.getItem('userId');

  const recommendMutation = useMutation({
    mutationFn: async ({ vaga_id, estudante_id, universidade_id }: { vaga_id: string, estudante_id: string, universidade_id: string }) => {
      const { error } = await supabase.from('aplicacoes').insert({ vaga_id, estudante_id, universidade_id, status: 'pendente' });
      if (error) throw new Error(error.message);
    }
  });

  return (
    <>
      <Card className="w-full h-full border rounded-md border-gray-800 grid">
        <div className="w-full flex flex-col justify-start items-start">
          <CardContent className="w-full p-6">
            <div className="w-full grid gap-2">
              <img 
                src={getFullImageUrl(job.empresa.foto) || photo} 
                className={`w-full h-[100px] rounded-md object-contain ${job.empresa.foto ? '' : 'bg-primary'}`}
                alt={job.empresa.foto}
              />
              <div className="grid flex-1">
                <strong className="font-medium text-base text-gray-150">{job.nome}</strong>
                <Badge className="w-fit bg-primary mb-2">
                  <span>{job.total_aplicacoes} aplicações</span>
                </Badge>
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4" />
                  <strong className="font-medium text-sm text-gray-150">{job.empresa.nome}</strong>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4" />
                  <p className="font-medium text-sm text-gray-150">{formatTime(job.created_at)}</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-xs text-primary font-normal underline hover:text-primary-dark p-0 h-auto">
                      Visualizar Vaga
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogTitle>Detalhes da Vaga</DialogTitle>
                    <DialogDescription>
                      <div className="mb-4">
                        <strong>Nome:</strong> {job.nome}<br />
                        <strong>Empresa:</strong> {job.empresa.nome}<br />
                        <strong>Descrição:</strong> {job.descricao}<br />
                        <strong>Prazo:</strong> {job.prazo}<br />
                        <strong>Valor:</strong> {job.valor}<br />
                        <strong>Status:</strong> {job.status}<br />
                      </div>
                      <div className="mb-2 font-semibold">Alunos disponíveis para recomendação:</div>
                      {isLoading ? (
                        <div>Carregando alunos...</div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {students.map(student => (
                            <div key={student.id} className="flex items-center justify-between border-b pb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{student.nome}</span>
                              </div>
                              <Button
                                size="sm"
                                disabled={recommendMutation.isPending}
                                onClick={() => recommendMutation.mutate({ vaga_id: job.id, estudante_id: student.id, universidade_id: universidade_id || '' })}
                              >
                                Recomendar
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {recommendMutation.isSuccess && (
                        <div className="text-green-600 mt-2">Aluno recomendado com sucesso!</div>
                      )}
                      {recommendMutation.isError && (
                        <div className="text-red-600 mt-2">Erro ao recomendar: {recommendMutation.error?.message}</div>
                      )}
                    </DialogDescription>
                    <DialogClose asChild>
                      <Button variant="outline">Fechar</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  );
};