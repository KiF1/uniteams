import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddStudent } from "../hooks/use-add-student";

export function AddStudentButton({ initialData, onEdit }: { initialData?: any, onEdit?: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialData || {
    nome: "",
    matricula: "",
    telefone: "",
    endereco: "",
    email: "",
  });
  const addStudent = useAddStudent();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addStudent.mutate(form, {
      onSuccess: () => {
        setOpen(false);
        setForm({ nome: "", matricula: "", telefone: "", endereco: "", email: "" });
        if (onEdit) onEdit();
      },
      onError: (error: any) => {
        alert("Erro ao salvar estudante: " + error.message);
      },
    });
  }

  // Permite atualizar o form ao abrir o popup para edição
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={initialData ? "outline" : "default"}>{initialData ? "Editar" : "Adicionar Estudante"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{initialData ? "Editar Estudante" : "Adicionar Estudante"}</DialogTitle>
        <DialogDescription>Preencha os dados do estudante abaixo:</DialogDescription>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input id="matricula" name="matricula" value={form.matricula} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" name="telefone" value={form.telefone} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" name="endereco" value={form.endereco} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" variant="default">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
