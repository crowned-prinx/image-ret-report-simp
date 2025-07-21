import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import NavItem from "../NavItem/NavItem"

  const navbarSchema = [
    {
      name: 'Magnify',
      title: 'Magnify',
      icon: 'loupe',
    },
    { name: 'Zoom', title: 'Zoom', icon: 'zoom_in' },
    { name: 'EllipticalRoi', title: 'Ellipse', icon: 'all_out' },
    { name: 'TextMarker', title: 'Text', icon: 'edit_note' },
    { name: 'Rotate', title: 'Rotate', icon: 'rotate_90_degrees_cw' },
    { name: 'Pan', title: 'Pan', icon: 'open_with' },
    { name: 'Reset', title: 'Reset', icon: 'restart_alt' },
  ].map((item) => {
  return { ...item, id: uuidv4() }
});

export default function NavBar({ onToolSelect, activeTool }) {
  const [tool, setTool] = useState("")

  return (
    <nav className="shrink-0">
      <div className="p-3 flex justify-between items-center gap-4">
        {navbarSchema.map(({ id, icon, title, name }) => (
          <NavItem
            key={id}
            icon={icon}
            title={title}
            name={name}
            // Pass the handler function down to the NavItem
            clickFunc={() => onToolSelect(name)}
            // Pass whether this item is the active one
            isActive={activeTool === name}
          />
        ))}
      </div>
    </nav>
  )
}
