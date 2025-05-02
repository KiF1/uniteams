import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='p-8 w-full'>
        <div className='flex items-center justify-between'>
          <SidebarTrigger />
        </div>
        <section className='w-full py-10 md:mx-2'>
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  )
}
