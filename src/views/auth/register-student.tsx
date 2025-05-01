import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useState } from "react";
import { CameraIcon } from "lucide-react";
import { applyPhoneMask } from "@/utils/mask-phone";
import { removeMask } from "@/utils/remove-mask";
import { useRegisterStudent } from "./hooks/use-create-student";
import { applyCEPMask } from "@/utils/mask-cep";

// Função para máscara de matrícula
const applyMatriculaMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 4) {
    return numbers;
  } else {
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`;
  }
};

const schema = z.object({
  nome: z.string().min(3, "Nome do estudante é obrigatório"),
  email: z.string().email("E-mail inválido"),
  foto: z.instanceof(File).optional(),
  matricula: z.string({ required_error: "Matrícula é obrigatória" })
    .min(1, "Matrícula é obrigatória")
    .transform(removeMask)
    .refine((val) => val.length === 8, "Matrícula deve ter 8 dígitos"),
  telefone: z.string({ required_error: "Telefone é obrigatório" })
    .min(1, "Telefone é obrigatório")
    .transform(removeMask)
    .refine((val) => val.length >= 10 && val.length <= 11, "Telefone deve ter entre 10 e 11 dígitos"),
  funcao_cargo: z.string().min(2, "Função/Cargo é obrigatório"),
  cep: z.string().min(8, "CEP é obrigatório").transform(removeMask),
  estado: z.string().min(2, "Estado é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  rua: z.string().min(2, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  descricao: z.string().optional(),
  equipe_id: z.string().optional(),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type SchemaType = z.infer<typeof schema>;

const fieldsStudent = [
  { label: 'Nome Completo', name: 'nome' as const, placeholder: 'Insira o nome completo', mask: null },
  { label: 'E-mail', name: 'email' as const, placeholder: 'Insira o e-mail', mask: null },
  { label: 'Matrícula', name: 'matricula' as const, placeholder: 'Insira a matrícula', mask: applyMatriculaMask },
  { label: 'Telefone', name: 'telefone' as const, placeholder: 'Insira o telefone', mask: applyPhoneMask },
  { label: 'Função/Cargo', name: 'funcao_cargo' as const, placeholder: 'Ex: Desenvoldedor Front-end', mask: null },
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

export const RegisterStudent = () => {
  const [preview, setPreview] = useState<string | null>(null);
  
  const [maskedValues, setMaskedValues] = useState({
    telefone: "",
    matricula: "",
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

  // Handler para os campos com máscara
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

  const { mutate, isPending } = useRegisterStudent();

  const onSubmit = (data: SchemaType) => {
    // Formatar o objeto final com o endereço em formato JSONB
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
    
    
    console.log(formattedData);
    mutate(formattedData);
  };

  return (
    <div className="w-[85%] md:w-[55%] xl:w-[75%] flex flex-col py-12">
      <h1 className="text-xl text-gray-150 font-bold text-center">Cadastre um estudante</h1>
      <h2 className="text-sm text-gray-160 font-semibold text-center mt-2">Cadastre um estudante para integrar à equipe e universidade!</h2>
      <form className="w-full flex flex-col gap-2 xl:gap-4 mt-6" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="media" className="flex cursor-pointer items-end gap-1.5 text-xs text-gray-160">
          <div className="relative flex">
            {preview ? (
              <img src={preview} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-gray-800" />
            ) : (
              <div className="w-14 h-14 flex justify-center items-center bg-white rounded-full border-2 border-gray-800">
                <span className="text-4xl text-gray-160">S</span>
              </div>
            )}
            <div className="absolute bottom-[-10px] right-0 p-1 w-6 h-6 flex justify-center items-center bg-white rounded-full border-gray-800 border">
              <CameraIcon color="#4F4E59" />
            </div>
          </div>
          Carregar foto
        </label>
        <input 
          type="file" 
          id="media" 
          className="invisible h-0 w-0" 
          accept="image/*" 
          onChange={onFileSelected} 
        />
        
        {/* Campos principais do estudante */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          {fieldsStudent.map((field) => (
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
              placeholder="Insira uma descrição sobre o estudante"
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
        <button 
          type="submit" 
          disabled={isPending} 
          className="w-full mt-auto p-2 h-[37px] bg-primary text-white text-sm font-medium rounded"
        >
          {isPending ? 'Cadastrando...' : 'Cadastrar Estudante'}
        </button>
      </form>
    </div>
  );
};