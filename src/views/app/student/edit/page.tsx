import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCheck, CircleX } from "lucide-react";
import { removeMask } from "@/utils/remove-mask";;
import { applyPhoneMask } from "@/utils/mask-phone";
import { AppTitle } from "@/components/app-title";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

// Schema de validação com zod
const studentSchema = z.object({
  nome: z.string().min(3, "Nome do estudante é obrigatório"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string({ required_error: "Telefone é obrigatório" })
    .min(1, "Telefone é obrigatório")
    .transform(removeMask)
    .refine((val) => val.length >= 10 && val.length <= 11, "Telefone deve ter entre 10 e 11 dígitos"),
  funcao: z.string().min(2, "Função é obrigatória"),
  localizacao: z.string().min(2, "Localização é obrigatória"),
  descricao: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

// Todos os campos em um único array
const allFields = [
  { name: "nome", label: "Nome do Estudante", type: "text", placeholder: "Insira o nome do estudante", mask: null, group: "main" },
  { name: "matricula", label: "Matrícula", type: "text", placeholder: "Insira a matrícula", mask: null, group: "main" },
  { name: "email", label: "E-mail", type: "email", placeholder: "Insira o e-mail institucional", mask: null, group: "main" },
  { name: "telefone", label: "Telefone", type: "text", placeholder: "Insira o telefone", mask: applyPhoneMask, group: "main" },
  { name: "funcao", label: "Função", type: "text", placeholder: "Insira a função", mask: null, group: "main" },
  { name: "localizacao", label: "Localização", type: "text", placeholder: "Insira a localização", mask: null, group: "main" },
];

export const EditStudent = () => {
  const student = {
    id: "1",
    nome: "João da Silva",
    matricula: "20230001",
    email: "joao.silva@universidade.com",
    telefone: "81987654321",
    funcao: "Monitor",
    localizacao: "Recife, Pernambuco",
    descricao: "Estudante dedicado e monitor de laboratório.",
  };

  const [maskedValues, setMaskedValues] = useState({
    telefone: "",
  });

  const methods = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    mode: "onBlur",
    defaultValues: {
      nome: "",
      matricula: "",
      email: "",
      telefone: "",
      funcao: "",
      localizacao: "",
      descricao: "",
    },
  });

  // Preencher o formulário quando os dados do estudante mudarem
  useEffect(() => {
    if (student) {
      methods.reset(student as StudentFormData);

      // Atualizar os valores mascarados
      setMaskedValues({
        telefone: applyPhoneMask(student.telefone || ""),
      });
    }
  }, []);

  const handleMaskedInputChange = useCallback((
    e: ChangeEvent<HTMLInputElement>, 
    maskFn: (value: string) => string, 
    fieldName: keyof StudentFormData
  ) => {
    const { value } = e.target;

    const maskedValue = maskFn(value);
    setMaskedValues(prev => ({ ...prev, [fieldName]: maskedValue }));

    methods.setValue(fieldName, maskedValue, { shouldValidate: true });
  }, [methods]);

  const onSubmit = (data: StudentFormData) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full grid gap-4">
        <AppTitle 
          title="Editar Estudante" 
          text="Faça as alterações necessárias para atualizar os dados do estudante."
        />
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
          {/* Campos principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {allFields.map(({ name, label, type, placeholder, mask }) => (
              <FormField
                key={name}
                control={methods.control}
                name={name as keyof StudentFormData}
                render={({ field }) => (
                  <FormItem className='grid'>
                    <Label className="text-xs text-gray-150 font-normal">
                      {label}
                    </Label>
                    <FormControl>
                      {mask ? (
                        <Input
                          type={type}
                          placeholder={placeholder}
                          value={maskedValues[name as 'telefone'] || ''}
                          onChange={(e) => handleMaskedInputChange(e, mask, name as keyof StudentFormData)}
                          className="h-10 text-xs"
                        />
                      ) : (
                        <Input
                          type={type}
                          placeholder={placeholder}
                          className="h-10 text-xs w-full"
                          name={field.name}
                          value={field.value as string}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      )}
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ))}
          </div>
          
          {/* Descrição */}
          <div className="w-full grid lg:grid-cols-2 justify-items-end gap-4">
            <FormField
              control={methods.control}
              name="descricao"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2 mt-4">
                  <Label className="text-xs text-gray-150 font-normal">
                    Descrição
                  </Label>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Insira uma descrição sobre o estudante"
                      className="min-h-32 w-full xl:w-[505px] resize-none text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            
            {/* Botões de ação */}
            <div className="flex gap-4 mt-auto">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white px-8 text-sm font-semibold flex items-center gap-2"
              >
                <CheckCheck />
                Salvar
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
          </div>
        </form>
      </div>
    </FormProvider>
  );
};