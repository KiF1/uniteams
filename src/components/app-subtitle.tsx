interface Props{
  title: string;
  text: string;
}

export const AppSubTitle = ({ title, text }: Props) => {
  return(
    <div className="w-full flex flex-col">
      <h1 className="text-gray-150 font-bold text-sm">{title}</h1>
      <h2 className="text-xs font-normal text-gray-160">{text}</h2>
    </div>
  )
}