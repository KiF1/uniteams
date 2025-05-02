import { Button } from "@/components/ui/button"
import {  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SlidersHorizontal } from "lucide-react"

export const DropdownFilter = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="py-1 px-3 bg-transparent border shadow-none border-gray-800 text-gray-160 hover:bg-primary hover:text-white">
          <SlidersHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Status das Solicitações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem>
            Pendentes
          </DropdownMenuItem>
          <DropdownMenuItem>
            Aprovadas
          </DropdownMenuItem>
          <DropdownMenuItem>
            Reprovadas
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}