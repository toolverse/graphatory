import { ChevronDown, Redo, Undo } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { ToolIcon } from "./Toolbar";
import logo from "./assets/logos/graphatory-logo-long-black.png";

export default function TitleCard({ children }: { children: JSX.Element[] }) {
    return (
        <div className="fixed top-4 left-4 p-3 w-auto h-12 bg-white flex justify-between items-center rounded-md shadow-md">
            {children}
        </div>
    );
}

export function LogoAndTitle() {
    const [fileName, setFileName] = useState(getFileNameFromLocalStorage);
    const width = (fileName.length + 1) * 8;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem("graphatory:filename", e.target.value);
        setFileName(e.target.value);
    };

    return (
        <div className="flex divide-x divide-[#EFEFEF] gap-4 justify-between">
            <div className="flex gap-6 items-center justify-between">
                <img className="h-8" src={logo} alt="Logo Image" />
                <div className="flex gap-1">
                    <input
                        type="text"
                        value={fileName}
                        onChange={handleChange}
                        style={{ width: width }}
                        className="focus:outline-none font-REM"
                    />
                    <ToolIcon size={16} tooltip="more options">
                        <ChevronDown size={14} />
                    </ToolIcon>
                </div>
            </div>
            <div className="flex pl-2">
                <ToolIcon tooltip="undo">
                    <Undo color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon tooltip="redo">
                    <Redo color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
            </div>
        </div>
    );
}

export function UndoRedo() {
    return <div></div>;
}

function getFileNameFromLocalStorage(): string {
    const getName = localStorage.getItem("graphatory:filename");
    if (getName) {
        return getName;
    }

    return "Untitled";
}
