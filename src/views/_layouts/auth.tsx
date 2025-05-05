import Background from '../../assets/background.png'
import Logo from '../../assets/logo.png'
import { Outlet } from 'react-router-dom'
export function AuthLayout() {
  return (
    <section className="w-full min-h-screen grid grid-cols-1 xl:grid-cols-[1fr_0.75fr]">
      <div 
        className='w-full bg-cover bg-center min-h-screen hidden xl:flex justify-center items-center p-10'
        style={{ backgroundImage: `url(${Background})` }}
        />
      <div className='w-full bg-white flex flex-col justify-center items-center'>
        <img src={Logo} className='w-[200px] h-fit mt-10' />
        <Outlet />
      </div>
    </section>
  )
}
