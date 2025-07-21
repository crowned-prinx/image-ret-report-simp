import { v4 as uuidv4 } from "uuid"
import {
  FiZoomIn,
  FiCircle,
  FiEdit,
  FiRotateCw,
  FiMove,
  FiRefreshCw,
  FiMaximize,
} from 'react-icons/fi';
import { Button } from "../ui/button";
import { LiquidGlassButton } from "../ui/liquid-glass-button";

export default function NavItem({
  id,
  icon,
  title,
  name,
  clickFunc,
  isActive
}) {

  const iconMap = {
  loupe: <FiMaximize />,
  zoom_in: <FiZoomIn />,
  all_out: <FiCircle />,
  edit_note: <FiEdit />,
  rotate_90_degrees_cw: <FiRotateCw />,
  open_with: <FiMove />,
  restart_alt: <FiRefreshCw />,
};
  
  return (
    <LiquidGlassButton
        className={`p-2 cursor-pointer hover:bg-teal-500 hover:rounded-md ease-linear duration-100 hover:scale-105 flex justify-center items-center ${isActive && 'bg-teal-600'}`}
        title={title}
        onClick={()=>clickFunc()}
        >
        <span className="material-symbols-outlined">{iconMap[icon]}</span>
      </LiquidGlassButton>
  )
}