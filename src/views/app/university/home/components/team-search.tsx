import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, MessageSquare } from "lucide-react";
import { Separator } from '@/components/ui/separator';

const TeamSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const teams = [
    {
      id: 1,
      name: 'Foursys',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    },
    {
      id: 2,
      name: 'Superbid',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    },
    {
      id: 3,
      name: 'Pegasus',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    },
    {
      id: 4,
      name: 'UrbanCraft',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    },
    {
      id: 5,
      name: 'Pixel Perfection',
      logo: "https://lwaoakagvhobpgebthjz.supabase.co/storage/v1/object/public/fotos/estudantes/e60e8329-e4e3-42c1-9126-adceee62a239.jpg",
      institution: 'Centro Universitário Maurício de Nassau'
    }
  ];

  const filteredTeams = teams.filter(team => 
    searchQuery.length === 0 || team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-white p-6 rounded- border rounded-md border-gray-800">
      <h2 className="text-sm font-normal text-gray-160 mb-4">Pesquisar equipes</h2>
      
      <div className="relative flex items-center mb-4 gap-4">
        <Input
          type="text"
          placeholder="Nome da equipe"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 rounded-md border border-gray-800"
        />
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-md border border-gray-800 p-4"
        >
          <Search className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      <div className="space-y-4 mt-12 max-h-[500px] overflow-y-auto pr-4">
        {filteredTeams.map(team => (
          <div key={team.id} className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-neutral-200 pb-6">
            <div className="flex-1 flex items-start">
              <img 
                src={team.logo} 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-800"
              />
              <div className="ml-3 grid">
                <p className="font-medium text-lg text-gray-150">{team.name}</p>
                <p className="font-medium text-xs text-gray-150">equipe@gmail.com</p>
                <p className="font-medium text-xs text-gray-150">12/04/2025 | 6 Projetos</p>
              </div>
            </div>
            <Separator orientation="vertical" className="hidden md:block mx-4 h-20" />

            <div className="w-fit grid grid-cols-2 md:grid-cols-1 jus md:justify-items-end gap-2">
              <Button className="bg-primary w-fit text-white rounded-md flex items-center px-3 py-1">
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
              <Button className="text-gray-160 w-fit text-sm border flex items-center gap-2 border-gray-800 rounded-md bg-transparent">
                <MessageSquare className="h-4 w-4 mr-1" />
                Contato
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSearch;