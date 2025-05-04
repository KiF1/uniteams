import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CameraIcon, CheckCheck, CircleX } from "lucide-react";
import { removeMask } from "@/utils/remove-mask";
import { applyPhoneMask } from "@/utils/mask-phone";
import { AppTitle } from "@/components/app-title";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

// Schema de validação com zod
const teamSchema = z.object({
  nome: z.string().min(3, "Nome da equipe é obrigatório"),
  universidade: z.string().min(1, "Universidade é obrigatória"),
  email: z.string().email("E-mail inválido"),
  foto: z.instanceof(File).optional(),
  telefone: z.string({ required_error: "Telefone é obrigatório" })
    .transform(removeMask)
    .refine((val) => val.length >= 10 && val.length <= 11, "Telefone deve ter entre 10 e 11 dígitos"),
  localizacao: z.string().min(3, "Localização é obrigatória"),
  descricao: z.string().optional(),
});

type TeamFormData = z.infer<typeof teamSchema>;

export const TeamForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [preview, setPreview] = useState<string | null>(null);

  const [maskedValues, setMaskedValues] = useState({
    telefone: "",
  });

  const methods = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    mode: "onBlur",
    defaultValues: {
      nome: "",
      universidade: "",
      email: "",
      telefone: "",
      localizacao: "",
      descricao: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      // Simular carregamento de dados para edição
      const team = {
        id: "1",
        nome: "Equipe Alpha",
        universidade: "Universidade Federal",
        email: "equipe.alpha@universidade.com",
        foto: undefined,
        telefone: "8137655423",
        localizacao: "Recife, Pernambuco",
        descricao: "Equipe focada em desenvolvimento de software.",
      };

      methods.reset(team as TeamFormData);

      setMaskedValues({
        telefone: applyPhoneMask(team.telefone || ""),
      });

      if (team.foto) {
        if (typeof team.foto === "string") {
          setPreview(team.foto);
        } else {
          setPreview(URL.createObjectURL(team.foto));
        }
      }
    }
  }, [isEditMode, methods]);

  const onFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || !files[0]) return;

    setPreview(URL.createObjectURL(files[0]));
    methods.setValue("foto", files[0], { shouldValidate: true });
  };

  const handleMaskedInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, maskFn: (value: string) => string, fieldName: keyof TeamFormData) => {
      const { value } = e.target;

      const maskedValue = maskFn(value);
      setMaskedValues((prev) => ({ ...prev, [fieldName]: maskedValue }));

      methods.setValue(fieldName, maskedValue, { shouldValidate: true });
    },
    [methods]
  );

  const onSubmit = (data: TeamFormData) => {
    if (isEditMode) {
      console.log("Editando equipe:", data);
    } else {
      console.log("Adicionando nova equipe:", data);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full grid gap-4">
        <AppTitle
          title={isEditMode ? "Editar Equipe" : "Adicionar Equipe"}
          text={isEditMode ? "Faça as alterações necessárias para atualizar os dados da equipe." : "Preencha os campos para adicionar uma nova equipe."}
        />
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col">
            <label htmlFor="logo-upload" className="flex cursor-pointer items-end gap-1.5 text-xs text-gray-160">
              <div className="relative flex">
                {preview ? (
                  <img src={preview} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-16 h-16 flex justify-center items-center bg-primary rounded-full">
                    <span className="text-4xl font-bold text-white">E</span>
                  </div>
                )}
                <div className="absolute bottom-[-4px] right-[-4px] p-1.5 w-6 h-6 flex justify-center items-center bg-white rounded-full border-gray-300 border shadow-sm">
                  <CameraIcon size={18} className="text-gray-160" />
                </div>
              </div>
              <span className="ml-2">Carregar logo da equipe</span>
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="invisible h-0 w-0"
              onChange={onFileSelected}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <FormField
              control={methods.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="grid">
                  <Label className="text-xs text-gray-150 font-normal">Nome da Equipe</Label>
                  <FormControl>
                    <Input {...field} placeholder="Insira o nome da equipe" className="h-10 text-xs" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="universidade"
              render={({ field }) => (
                <FormItem className="grid">
                  <Label className="text-xs text-gray-150 font-normal">Universidade</Label>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="h-10 text-xs">{field.value || "Selecione a universidade"}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Universidade Federal">Universidade Federal</SelectItem>
                        <SelectItem value="Universidade Estadual">Universidade Estadual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid">
                  <Label className="text-xs text-gray-150 font-normal">E-mail</Label>
                  <FormControl>
                    <Input {...field} placeholder="Insira o e-mail da equipe" className="h-10 text-xs" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="telefone"
              render={({ field }) => (
                <FormItem className="grid">
                  <Label className="text-xs text-gray-150 font-normal">Telefone</Label>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Insira o telefone da equipe"
                      value={maskedValues.telefone}
                      onChange={(e) => handleMaskedInputChange(e, applyPhoneMask, "telefone")}
                      className="h-10 text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="localizacao"
              render={({ field }) => (
                <FormItem className="grid">
                  <Label className="text-xs text-gray-150 font-normal">Localização</Label>
                  <FormControl>
                    <Input {...field} placeholder="Insira a localização da equipe" className="h-10 text-xs" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={methods.control}
            name="descricao"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2 mt-4">
                <Label className="text-xs text-gray-150 font-normal">Descrição</Label>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Insira uma descrição sobre a equipe"
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
              {isEditMode ? "Salvar Alterações" : "Adicionar"}
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
