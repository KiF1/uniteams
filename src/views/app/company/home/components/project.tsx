import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProject } from "../hooks/use-create-projects";

const formSchema = z.object({
  equipe_id: z.string(),
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

interface CreateProjectSheetProps {
  equipeId: string;
  onSuccess?: () => void;
}

export const CreateProjectSheet = ({
  equipeId,
  onSuccess,
}: CreateProjectSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipe_id: equipeId,
      titulo: "",
      descricao: "",
    },
  });

  const { mutate, isPending } = useCreateProject();

  const handleSubmit = async (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-primary text-white text-sm rounded-md flex items-center gap-2 mt-auto">
          <PlusCircle />
          Criar Projeto
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Criar Projeto</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo para adicionar um novo projeto à equipe
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4 grid"
          >
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Projeto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Sistema de Agendamento de Consultas"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Projeto</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo e as funcionalidades principais do projeto"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-white mt-auto"
            >
              Criar Projeto
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
