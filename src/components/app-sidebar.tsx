import { Home, LogOut, Users2 } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import logo from '../assets/logo.png';
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabase";
import { queryClient } from "@/services/react-query"
import { redirectPath } from "@/utils/redirect-path";


export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const idUser = sessionStorage.getItem('userId')
  const typeUser = sessionStorage.getItem('userType')
  
  const pathRedirect = redirectPath(typeUser!);
  
  const items = [
    {
      title: "Dashboard",
      route: "dashboard",
      url: `${pathRedirect}/dashboard`,
      icon: Home,
    },
    {
      title: "Perfil",
      route: "view",
      url: `${pathRedirect}/view/${idUser}`,
      icon: Users2,
    }
  ];
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      sessionStorage.clear();
      queryClient.removeQueries();
      navigate('/auth/sign-in');
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="p-0">
          <img src={logo} className='w-fit h-fit px-2 py-4' />
          <hr />
          <br />
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname.includes(item.route)} onClick={() => navigate(`${item.url}`)}>
                    <a className="cursor-pointer">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <button 
                type="button" 
                onClick={logout} 
                className="flex bg-transparent border-0 items-center gap-2 p-2 hover:bg-primary hover:text-white text-sm font-normal text-gray-160 rounded-md"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
