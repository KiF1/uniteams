import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CameraIcon, CheckCheck, CircleX } from "lucide-react";
import { removeMask } from "@/utils/remove-mask";
import { applyCNPJMask } from "@/utils/mask-cnpj";
import { applyPhoneMask } from "@/utils/mask-phone";
import { AppTitle } from "@/components/app-title";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { applyCEPMask } from "@/utils/mask-cep";
import { useGetUniversity } from "./hooks/use-fetch-university";
import { useParams } from "react-router-dom";
import { useUpdateUniversity } from "./hooks/use-edit-university";
import { getFullImageUrl } from "@/utils/photo-user";

// Schema de validação com zod
const universitySchema = z.object({
  nome: z.string().min(3, "Nome da universidade é obrigatório"),
  email: z.string().email("E-mail inválido"),
  foto: z.union([z.instanceof(File), z.string()]).optional(),
  cnpj: z.string({ required_error: "O CNPJ é obrigatório" })
    .transform(removeMask)
    .refine((val) => val.length === 14, "CNPJ deve ter 14 dígitos"),
  telefone: z.string({ required_error: "Telefone é obrigatório" })
    .min(1, "Telefone é obrigatório")
    .transform(removeMask)
    .refine((val) => val.length >= 10 && val.length <= 11, "Telefone deve ter entre 10 e 11 dígitos"),
  cep: z.string().min(8, "CEP é obrigatório").transform(removeMask),
  estado: z.string().min(2, "Estado é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  rua: z.string().min(2, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  descricao: z.string().optional(),
});

type UniversityFormData = z.infer<typeof universitySchema>;

// Todos os campos em um único array
const allFields = [
  // Campos principais
  { name: "nome", label: "Nome da Universidade", type: "text", placeholder: "Insira o nome da universidade", mask: null, group: "main" },
  { name: "email", label: "E-mail", type: "email", placeholder: "Insira o e-mail institucional", mask: null, group: "main" },
  { name: "cnpj", label: "CNPJ", type: "text", placeholder: "Insira o CNPJ", mask: applyCNPJMask, group: "main" },
  { name: "telefone", label: "Telefone", type: "text", placeholder: "Insira o telefone institucional", mask: applyPhoneMask, group: "main" },
  
  // Campos de endereço
  { name: "cep", label: "CEP", type: "text", placeholder: "00000-000", mask: applyCEPMask, group: "address" },
  { name: "estado", label: "Estado", type: "text", placeholder: "UF", mask: null, group: "address" },
  { name: "cidade", label: "Cidade", type: "text", placeholder: "Nome da cidade", mask: null, group: "address" },
  { name: "bairro", label: "Bairro", type: "text", placeholder: "Nome do bairro", mask: null, group: "address" },
  { name: "rua", label: "Rua", type: "text", placeholder: "Nome da rua", mask: null, group: "address" },
  { name: "numero", label: "Número", type: "text", placeholder: "Número", mask: null, group: "address" },
];

export const EditUniversity = () => {
  const [preview, setPreview] = useState<string | null>(null);
  
  const { universityId } = useParams<{ universityId: string }>();
  const { data: university } = useGetUniversity(universityId || "");
  const [maskedValues, setMaskedValues] = useState({
    telefone: "",
    cnpj: "",
    cep: "",
  });

  const methods = useForm<UniversityFormData>({
    resolver: zodResolver(universitySchema),
    mode: "onBlur",
    defaultValues: {
      nome: "",
      email: "",
      cnpj: "",
      telefone: "",
      cep: "",
      estado: "",
      cidade: "",
      bairro: "",
      rua: "",
      numero: "",
      descricao: "",
    }
  });

  // Preencher o formulário quando os dados da universidade mudarem
  useEffect(() => {
    if (university) {
      methods.reset({
        nome: university.nome,
        email: university.email,
        foto: university.foto || undefined,
        cnpj: university.cnpj,
        telefone: university.telefone,
        cep: university.endereco.cep,
        estado: university.endereco.estado,
        cidade: university.endereco.cidade,
        bairro: university.endereco.bairro,
        rua: university.endereco.rua,
        numero: university.endereco.numero,
        descricao: university.descricao || undefined,
      });

      // Atualizar os valores mascarados
      setMaskedValues({
        telefone: applyPhoneMask(university.telefone || ""),
        cnpj: applyCNPJMask(university.cnpj || ""),
        cep: applyCEPMask(university.endereco.cep || ""),
      });

      // Se tiver uma foto, mostrar preview
      if (university.foto) {
        setPreview(getFullImageUrl(university.foto));
      }
    }
  }, [university]);

  const onFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files[0]) return;
    
    setPreview(URL.createObjectURL(files[0]));
    methods.setValue("foto", files[0], { shouldValidate: true });
  };

  const handleMaskedInputChange = useCallback((
    e: ChangeEvent<HTMLInputElement>, 
    maskFn: (value: string) => string, 
    fieldName: keyof UniversityFormData
  ) => {
    const { value } = e.target;
    
    const maskedValue = maskFn(value);
    setMaskedValues(prev => ({ ...prev, [fieldName]: maskedValue }));
    
    methods.setValue(fieldName, maskedValue, { shouldValidate: true });
  }, [methods]);

  const { mutate, isPending } = useUpdateUniversity();

  const onSubmit = (data: UniversityFormData) => {

    const { cep, estado, cidade, bairro, rua, numero, ...dataWithoutAddress } = data;
    const formattedData = {
      ...dataWithoutAddress,
      id: universityId!,
      endereco: {
        cep,
        estado,
        cidade,
        bairro,
        rua,
        numero
      }
    };

    mutate(formattedData)
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full grid gap-4">
        <AppTitle 
          title="Editar Universidade" 
          text="Faça as alterações necessárias para atualizar os dados da universidade."
        />
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col">
            <label htmlFor="logo-upload" className="flex cursor-pointer items-end gap-1.5 text-xs text-gray-160">
              <div className="relative flex">
                {preview ? (
                  <img src={preview} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-16 h-16 flex justify-center items-center bg-primary rounded-full">
                    <span className="text-4xl font-bold text-white">
                      {university?.nome?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-[-4px] right-[-4px] p-1.5 w-6 h-6 flex justify-center items-center bg-white rounded-full border-gray-300 border shadow-sm">
                  <CameraIcon size={18} className="text-gray-160" />
                </div>
              </div>
              <span className="ml-2">Carregar logo da universidade</span>
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="invisible h-0 w-0"
              onChange={onFileSelected}
            />
          </div>

          {/* Campos principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-4">
            {allFields.map(({ name, label, type, placeholder, mask }) => (
              <FormField
                key={name}
                control={methods.control}
                name={name as keyof UniversityFormData}
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
                          value={maskedValues[name as 'telefone' | 'cnpj' | 'cep'] || ''}
                          onChange={(e) => handleMaskedInputChange(e, mask, name as keyof UniversityFormData)}
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
                      placeholder="Insira uma descrição sobre a universidade"
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
                disabled={isPending}
                className="bg-primary hover:bg-primary/90 text-white px-8 text-sm font-semibold flex items-center gap-2"
              >
                <CheckCheck />
                Salvar
              </Button>
              <Button 
                type="button" 
                disabled={isPending}
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