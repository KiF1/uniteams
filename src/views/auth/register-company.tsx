import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useState } from "react";
import { CameraIcon } from "lucide-react";
import { validateCNPJ } from "@/utils/validateCNPJ";
import { applyCNPJMask } from "@/utils/mask-cnpj";
import { applyPhoneMask } from "@/utils/mask-phone";
import { removeMask } from "@/utils/remove-mask";

const schema = z.object({
  nome: z.string().min(3, "Nome da empresa é obrigatório"),
  email: z.string().email("E-mail inválido"),
  foto: z.instanceof(File).optional(),
  cnpj: z.string({ required_error: "O CNPJ é obrigatório" })
    .transform(removeMask)
    .refine((val) => val.length === 14, "CNPJ deve ter 14 dígitos")
    .refine(validateCNPJ, 'CNPJ inválido'),
  telefone: z.string({ required_error: "Telefone é obrigatório" })
    .min(1, "Telefone é obrigatório")
    .transform(removeMask)
    .refine((val) => val.length >= 10 && val.length <= 11, "Telefone deve ter entre 10 e 11 dígitos"),
  endereco: z.string().min(5, "Endereço é obrigatório"),
  descricao: z.string().optional(),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type SchemaType = z.infer<typeof schema>;

const fieldsCompany = [
  { label: 'Nome da Empresa', name: 'nome' as const, placeholder: 'Insira o nome da empresa', mask: null },
  { label: 'E-mail', name: 'email' as const, placeholder: 'Insira o e-mail corporativo', mask: null },
  { label: 'CNPJ', name: 'cnpj' as const, placeholder: 'Insira o CNPJ', mask: applyCNPJMask },
  { label: 'Telefone', name: 'telefone' as const, placeholder: 'Insira o telefone da empresa', mask: applyPhoneMask },
  { label: 'Endereço', name: 'endereco' as const, placeholder: 'Insira o endereço completo', mask: null },
  { label: 'Senha', name: 'senha' as const, placeholder: 'Insira a senha', mask: null, type: 'password' },
  { label: 'Confirmar Senha', name: 'confirmarSenha' as const, placeholder: 'Confirme a senha', mask: null, type: 'password' },
];

export const RegisterCompany = () => {
  const [preview, setPreview] = useState<string | null>(null);
  
  const [maskedValues, setMaskedValues] = useState({
    telefone: "",
    cnpj: "",
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

  const onSubmit = (data: SchemaType) => {
    console.log(data);
  };

  return (
    <div className="w-[85%] md:w-[55%] xl:w-[75%] flex flex-col py-12">
      <h1 className="text-xl text-gray-150 font-bold text-center">Cadastre uma empresa</h1>
      <h2 className="text-sm text-gray-160 font-semibold text-center mt-2">Cadastre sua empresa para ter acesso ao sistema!</h2>
      <form className="w-full flex flex-col gap-2 xl:gap-4 mt-6" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="media" className="flex cursor-pointer items-end gap-1.5 text-xs text-gray-160">
          <div className="relative flex">
            {preview ? (
              <img src={preview} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-gray-800" />
            ) : (
              <div className="w-14 h-14 flex justify-center items-center bg-white rounded-full border-2 border-gray-800">
                <span className="text-4xl text-gray-160">E</span>
              </div>
            )}
            <div className="absolute bottom-[-10px] right-0 p-1 w-6 h-6 flex justify-center items-center bg-white rounded-full border-gray-800 border">
              <CameraIcon color="#4F4E59" />
            </div>
          </div>
          Carregar logo
        </label>
        <input 
          type="file" 
          id="media" 
          className="invisible h-0 w-0" 
          accept="image/*" 
          onChange={onFileSelected} 
        />
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          {fieldsCompany.map((field) => (
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
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                  />
                )}
              </Label>
              {errors[field.name] && <span className="text-xs font-normal text-red-300">{errors[field.name]?.message}</span>}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-2">
          <Label className="w-full flex flex-col gap-2 text-sm text-gray-160 font-normal">
            Descrição
            <Textarea
              placeholder="Insira uma descrição sobre a empresa"
              className="min-h-24"
              {...register('descricao')}
            />
          </Label>
          {errors.descricao && <span className="text-xs font-normal text-red-300">{errors.descricao.message}</span>}
        </div>
        
        <button type="submit" className="w-full p-2 bg-primary text-white text-sm font-medium rounded mt-4">
          Cadastrar Empresa
        </button>
      </form>
    </div>
  );
};