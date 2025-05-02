interface Props{
  title: string;
  text: string;
  size?: string;
}

export const AppTitle = ({ title, text, size }: Props) => {
  return(
    <div className={`w-full flex flex-col ${size ? '' : 'xl:w-[35%]'}`}>
      <h1 className="text-gray-150 font-bold text-lg">{title}</h1>
      <h2 className="text-sm font-normal text-gray-160">{text}</h2>
    </div>
  )
}