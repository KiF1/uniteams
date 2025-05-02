import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useState } from "react";
import { CameraIcon } from "lucide-react";
import { removeMask } from "@/utils/remove-mask";
import { applyCNPJMask } from "@/utils/mask-cnpj";
import { applyPhoneMask } from "@/utils/mask-phone";
import { useRegisterUniversity } from "./hooks/use-create-university";

// Função para máscara de CEP
const applyCEPMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 5) {
    return numbers;
  } else {
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  }
};

// Schema único com todos os campos
const schema = z.object({
  nome: z.string().min(3, "Nome da universidade é obrigatório"),
  email: z.string().email("E-mail inválido"),
  foto: z.instanceof(File).optional(),
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
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type SchemaType = z.infer<typeof schema>;

// Campos principais da universidade
const fieldsUniversity = [
  { label: 'Nome da Universidade', name: 'nome' as const, placeholder: 'Insira o nome da universidade', mask: null },
  { label: 'E-mail', name: 'email' as const, placeholder: 'Insira o e-mail institucional', mask: null },
  { label: 'CNPJ', name: 'cnpj' as const, placeholder: 'Insira o CNPJ', mask: applyCNPJMask },
  { label: 'Telefone', name: 'telefone' as const, placeholder: 'Insira o telefone institucional', mask: applyPhoneMask },
  { label: 'Senha', name: 'senha' as const, placeholder: 'Insira a senha', mask: null, type: 'password' },
  { label: 'Confirmar Senha', name: 'confirmarSenha' as const, placeholder: 'Confirme a senha', mask: null, type: 'password' },
];

// Campos de endereço
const fieldsEndereco = [
  { label: 'CEP', name: 'cep' as const, placeholder: '00000-000', mask: applyCEPMask },
  { label: 'Estado', name: 'estado' as const, placeholder: 'UF', mask: null },
  { label: 'Cidade', name: 'cidade' as const, placeholder: 'Nome da cidade', mask: null },
  { label: 'Bairro', name: 'bairro' as const, placeholder: 'Nome do bairro', mask: null },
  { label: 'Rua', name: 'rua' as const, placeholder: 'Nome da rua', mask: null },
  { label: 'Número', name: 'numero' as const, placeholder: 'Número', mask: null },
];

export const RegisterUniversity = () => {
  const [preview, setPreview] = useState<string | null>(null);
  
  const [maskedValues, setMaskedValues] = useState({
    telefone: "",
    cnpj: "",
    cep: "",
  });

  const { register, setValue, handleSubmit, formState: { errors } } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;
    setPreview(URL.createObjectURL(files[0]));
    setValue("foto", files[0]);
  };

  const handleMaskedInputChange = (
    e: ChangeEvent<HTMLInputElement>, 
    maskFn: (value: string) => string, 
    fieldName: keyof SchemaType
  ) => {
    const { value } = e.target;
    
    const maskedValue = maskFn(value);
    setMaskedValues(prev => ({ ...prev, [fieldName]: maskedValue }));
    
    setValue(fieldName, maskedValue, { shouldValidate: true });
  };

  const { mutate, isPending } = useRegisterUniversity();

  const onSubmit = (data: SchemaType) => {
    const formattedData = {
      ...data,
      endereco: {
        cep: data.cep,
        estado: data.estado,
        cidade: data.cidade,
        bairro: data.bairro,
        rua: data.rua,
        numero: data.numero
      }
    };

    mutate(formattedData);
  };

  return (
    <div className="w-[85%] md:w-[55%] xl:w-[75%] flex flex-col py-12">
      <h1 className="text-xl text-gray-150 font-bold text-center">Cadastre uma universidade</h1>
      <h2 className="text-sm text-gray-160 font-semibold text-center mt-2">Cadastre sua instituição de ensino para integrar o sistema!</h2>
      <form className="w-full flex flex-col gap-2 xl:gap-4 mt-6" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="media" className="flex cursor-pointer items-end gap-1.5 text-xs text-gray-160">
          <div className="relative flex">
            {preview ? (
              <img src={preview} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-gray-800" />
            ) : (
              <div className="w-14 h-14 flex justify-center items-center bg-white rounded-full border-2 border-gray-800">
                <span className="text-4xl text-gray-160">U</span>
              </div>
            )}
            <div className="absolute bottom-[-10px] right-0 p-1 w-6 h-6 flex justify-center items-center bg-white rounded-full border-gray-800 border">
              <CameraIcon color="#4F4E59" />
            </div>
          </div>
          Carregar logo da universidade
        </label>
        <input 
          type="file" 
          id="media" 
          className="invisible h-0 w-0" 
          accept="image/*" 
          onChange={onFileSelected} 
        />
        
        {/* Campos principais da universidade */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          {fieldsUniversity.map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <Label className="w-full flex flex-col gap-2 text-sm text-gray-160 font-normal">
                {field.label}
                {field.mask ? (
                  <Input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={maskedValues[field.name as keyof typeof maskedValues] || ''}
                    onChange={(e) => handleMaskedInputChange(e, field.mask!, field.name)}
                  />
                ) : (
                  <Input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                  />
                )}
              </Label>
              {errors[field.name] && (
                <span className="text-xs font-normal text-red-300">
                  {errors[field.name]?.message as React.ReactNode}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Seção de endereço */}
        <div className="mt-4">
          <h3 className="text-md text-gray-150 font-semibold mb-2">Endereço</h3>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
            {fieldsEndereco.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <Label className="w-full flex flex-col gap-2 text-sm text-gray-160 font-normal">
                  {field.label}
                  {field.mask ? (
                    <Input
                      type="text"
                      placeholder={field.placeholder}
                      value={maskedValues[field.name as keyof typeof maskedValues] || ''}
                      onChange={(e) => handleMaskedInputChange(e, field.mask!, field.name)}
                    />
                  ) : (
                    <Input
                      type="text"
                      placeholder={field.placeholder}
                      {...register(field.name)}
                    />
                  )}
                </Label>
                {errors[field.name] && (
                  <span className="text-xs font-normal text-red-300">
                    {errors[field.name]?.message as React.ReactNode}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Descrição */}
        <div className="flex flex-col gap-2 mt-4">
          <Label className="w-full flex flex-col gap-2 text-sm text-gray-160 font-normal">
            Descrição
            <Textarea
              placeholder="Insira uma descrição sobre a universidade"
              className="min-h-24"
              {...register('descricao')}
            />
          </Label>
          {errors.descricao && (
            <span className="text-xs font-normal text-red-300">
              {errors.descricao.message as React.ReactNode}
            </span>
          )}
        </div>
        
        <button type="submit" disabled={isPending} className="w-full p-2 bg-primary text-white text-sm font-medium rounded mt-4">
          Cadastrar Universidade
        </button>
      </form>
    </div>
  );
};