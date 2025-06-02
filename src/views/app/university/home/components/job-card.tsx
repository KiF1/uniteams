import { Card, CardContent } from "@/components/ui/card";
import { getFullImageUrl } from "@/utils/photo-user";
import photo from '@/assets/photo.png'
import { formatTime } from "@/utils/format-date";
import { Link } from "react-router-dom";
import { OpenJob } from "../hooks/use-fetch-jobs";
import { Building2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";


interface Props {
  job: OpenJob
}

export const JobCard = ({ job }: Props) => {
  return (
    <Card className="w-full h-full border rounded-md border-gray-800 grid">
      <div className="w-full flex flex-col justify-start items-start">
        <CardContent className="w-full p-6">
          <div className="w-full grid gap-2">
            <img 
              src={getFullImageUrl(job.empresa.foto) || photo} 
              className={`w-full h-[100px] rounded-md object-contain ${job.empresa.foto ? '' : 'bg-primary'}`}
              alt={job.empresa.foto}
            />
            <div className="grid flex-1">
              <strong className="font-medium text-base text-gray-150">{job.nome}</strong>
              <Badge className="w-fit bg-primary mb-2">
                <span>{job.total_aplicacoes} aplicações</span>
              </Badge>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4" />
                <strong className="font-medium text-sm text-gray-150">{job.empresa.nome}</strong>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4" />
                <strong className="font-medium text-sm text-gray-150">{formatTime(job.created_at)}</strong>
              </div>
              <Link
                to="/app/student/view/2"
                className="text-xs text-primary font-normal underline hover:text-primary-dark"
              >
                Visualizar Vaga
              </Link>
            </div>
          </div>
        </CardContent>
      </div>
      
    </Card>
  );
};