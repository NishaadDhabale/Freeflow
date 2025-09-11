import { ReactNode} from "react";

export function IconButton({
  icon,onClick,activated
}:{
  icon:ReactNode,
  onClick:()=>void,
  activated: boolean
}){

  return <div className="cursor-pointer rounded-full border p-2 bg-black hover:bg-gray text-white hover:text-blue-500" onClick={onClick}>{icon} </div>
}