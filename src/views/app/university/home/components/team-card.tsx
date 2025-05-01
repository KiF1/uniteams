import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCheck, CircleX } from "lucide-react";

interface Team {
  name: string;
  description: string;
  logo: string;
  members: {
      name: string;
      role: string;
      avatar: string;
  }[];
}

interface Props {
  team: Team
}

export const TeamCard = ({ team }: Props) => {
  return (
    <Card className="h-full border shadow-sm grid md:grid-cols-[1fr_0.1fr_1fr]">
      <div>
        <CardHeader>
          <div className="flex items-start gap-2">
            <img 
              src={team.logo} 
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-800"
            />
            <div className="grid">
              <strong className="font-medium text-xl text-gray-150">{team.name}</strong>
              <span className="font-normal text-sm text-gray-160">12/04/2025 | 6 Projetos</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-gray-160">
          <p>{team.description}</p>
          <div className="flex justify-between w-full mt-4">
          <Button className="bg-primary text-white text-sm flex items-center gap-2">
            Aprovar
            <CheckCheck />
          </Button>
          <Button variant="outline" className="text-gray-160 text-sm border flex items-center gap-2 border-neutral-200 rounded-md">
            Reprovar
            <CircleX />
          </Button>
        </div>
        </CardContent>
      </div>
      <Separator orientation="vertical" className="mx-auto" />
      <CardFooter className="flex flex-col items-start pt-6">
        <h4 className="text-sm font-medium mb-2 text-gray-150">Membros</h4>
        
        {/* Scrollable team members section */}
        <div className="w-full max-h-72 overflow-y-auto pr-2">
          {team.members.map((member, index) => (
            <div key={index} className="flex items-start gap-2 mb-3">
              <div className="w-16 h-16 rounded-full border-2 border-gray-800 overflow-hidden">
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
                <p className="text-xs text-gray-500">usuario@gmail.com</p>
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};