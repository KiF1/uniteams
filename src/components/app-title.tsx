interface Props{
  title: string;
  text: string;
}

export const AppTitle = ({ title, text }: Props) => {
  return(
    <div className="w-full xl:w-[35%] flex flex-col">
      <h1 className="text-gray-150 font-bold text-lg">{title}</h1>
      <h2 className="text-sm font-normal text-gray-160">{text}</h2>
    </div>
  )
}