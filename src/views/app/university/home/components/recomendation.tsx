import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateRecommendation } from "../hooks/use-update-recomendation";

const formSchema = z.object({
  equipe_id: z.string(),
  nome_responsavel: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email_responsavel: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório"),
  cargo_responsavel: z.string().min(2, "Cargo deve ter pelo menos 2 caracteres"),
  descricao: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface CreateRecommendationSheetProps {
  equipeId: string;
  onSuccess?: () => void;
}

export const CreateRecommendationSheet = ({ equipeId }: CreateRecommendationSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipe_id: equipeId,
      nome_responsavel: "",
      email_responsavel: "",
      cargo_responsavel: "",
      descricao: ""
    },
  });

  const { mutate, isPending } = useUpdateRecommendation('aprovada');

  const handleSubmit = async (data: FormData) => {
    mutate(data, { 
      onSuccess: () => {
        setIsOpen(false)
      }
    })
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-primary text-white text-sm rounded-md flex items-center gap-2 mt-auto">
          <CheckCheck />
          Recomendar
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>
            Recomendar Equipe
          </SheetTitle>
          <SheetDescription>
            Preencha os dados da recomendação para a equipe
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4 grid">
            <FormField
              control={form.control}
              name="nome_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Responsável</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o nome do responsável" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Responsável</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Digite o email do responsável" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cargo_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo do Responsável</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o cargo do responsável" 
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
                  <FormLabel>Descrição da Recomendação</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite uma descrição detalhada da recomendação"
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
              Salvar Recomendação
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};