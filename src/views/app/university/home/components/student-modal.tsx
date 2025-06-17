import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Student } from "../hooks/use-fetch-student";
import photo from '@/assets/photo.png';
import { getFullImageUrl } from '@/utils/photo-user';

interface StudentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    student: Student;
    editMode: boolean;
    setEditMode: (edit: boolean) => void;
}

export function StudentModal({ open, onOpenChange, student, editMode, setEditMode }: StudentModalProps) {
    const [form, setForm] = useState<{ nome: string; email: string; matricula: string; telefone: string }>({
        nome: student.nome,
        email: student.email || "",
        matricula: "",
        telefone: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // TODO: implementar chamada de API para salvar alterações
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {editMode ? "Editar Estudante" : "Detalhes do Estudante"}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <img
                        src={getFullImageUrl(student.foto) || photo}
                        alt={`Foto do estudante ${student.nome}`}
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-800 bg-primary"
                    />
                    {editMode ? (
                        <form className="w-full flex flex-col gap-2">
                            <input
                                className="input"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                placeholder="Nome"
                            />
                            <input
                                className="input"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                            <input
                                className="input"
                                name="matricula"
                                value={form.matricula}
                                onChange={handleChange}
                                placeholder="Matrícula"
                            />
                            <input
                                className="input"
                                name="telefone"
                                value={form.telefone}
                                onChange={handleChange}
                                placeholder="Telefone"
                            />

                        </form>
                    ) : (
                        <div className="w-full flex flex-col gap-1">
                            <span className="font-semibold text-lg text-gray-900">{student.nome}</span>
                            <span className="text-xs text-gray-500">{student.email || 'Sem email'}</span>
                            {student.instituicao?.nome && (
                                <span className="text-xs text-gray-500">Instituição: {student.instituicao.nome}</span>
                            )}
                            <span className="text-xs text-gray-500">Cadastrado em: {new Date(student.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}
                </div>
                <div className="flex justify-between mt-4 gap-2">
                    {editMode ? (
                        <>
                            <Button variant="outline" onClick={() => setEditMode(false)}>
                                Cancelar
                            </Button>
                            <Button variant="default" onClick={handleSave}>
                                Salvar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="default" onClick={() => setEditMode(true)}>
                                Editar
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline">Fechar</Button>
                            </DialogClose>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
