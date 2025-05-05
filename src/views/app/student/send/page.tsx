import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCheck, CircleX } from "lucide-react";
import { AppTitle } from "@/components/app-title";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { TeamProject } from "@/views/app/student/home/components/team-project";
import { useEffect } from "react";

// Schema de validação com zod
const proposalSchema = z.object({
  valor: z.string().min(1, "Valor da proposta é obrigatório"),
  detalhamento: z.string().min(1, "Detalhamento da proposta é obrigatório"),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

export const SendStudent = () => {
  const methods = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    mode: "onBlur",
    defaultValues: {
      valor: "",
      detalhamento: "",
    },
  });

  const onSubmit = (data: ProposalFormData) => {
    console.log(data);
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    return `R$ ${Number(numericValue).toLocaleString("pt-BR")}`;
  };

  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === "valor") {
        methods.setValue("valor", formatCurrency(value.valor || ""), {
          shouldValidate: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <div className="w-full grid gap-4">
        <AppTitle 
          title="Proposta" 
          text="Envie uma proposta para um projeto ao qual seu time atende aos requisitos!"
        />
        <TeamProject />
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={methods.control}
              name="valor"
              render={({ field }) => (
                <FormItem className="grid">
                  <Label className="text-xs text-gray-150 font-normal">
                    Valor da Proposta
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Insira o valor da proposta"
                      className="h-10 text-xs"
                      onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={methods.control}
            name="detalhamento"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2 mt-4">
                <Label className="text-xs text-gray-150 font-normal">
                  Detalhamento da Proposta
                </Label>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Insira os detalhes da proposta"
                    className="min-h-32 w-full xl:w-[505px] resize-none text-xs"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex gap-4 mt-auto">
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white px-8 text-sm font-semibold flex items-center gap-2"
            >
              <CheckCheck />
              Enviar Proposta
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="px-8 text-sm font-semibold flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <CircleX />
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};