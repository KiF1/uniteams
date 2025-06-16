import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import photo from '@/assets/photo.png';
import { getFullImageUrl } from '@/utils/photo-user';
import { Student } from '../hooks/use-fetch-student';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Card className="flex flex-col md:flex-row items-center gap-4 p-6 border border-gray-800 rounded-md bg-white">
      <img
        src={getFullImageUrl(student.foto) || photo}
        alt={`Foto do estudante ${student.nome}`}
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-800 bg-primary"
      />
      <div className="flex-1 flex flex-col gap-1">
        <span className="font-semibold text-lg text-gray-900">{student.nome}</span>
        <span className="text-xs text-gray-500 flex items-center gap-2">
          <Mail className="w-4 h-4" /> {student.email || 'Sem email'}
        </span>
        <span className="text-xs text-gray-500">ID: {student.id}</span>
        {student.instituicao?.nome && (
          <span className="text-xs text-gray-500">Instituição: {student.instituicao.nome}</span>
        )}
        <span className="text-xs text-gray-500">Cadastrado em: {new Date(student.created_at).toLocaleDateString('pt-BR')}</span>
      </div>
    </Card>
  );
}
