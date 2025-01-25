export default function ToolBar({ children }: { children: JSX.Element[] }) {
    return (
        <div className="fixed top-[50%] pb-2 left-4 w-12 h-auto bg-white flex flex-col justify-between items-center rounded-md shadow-md gap-1">
            {children}
        </div>
    );
}

export function ToolIcon({
    children,
    grip,
    onClick,
    size,
}: {
    children: JSX.Element;
    grip?: boolean;
    toggle?: boolean;
    onClick?: () => void;
    size?: number;
}) {
    const classes = "flex items-center justify-center rounded-md";

    return (
        <div
            onClick={onClick}
            className={
                grip
                    ? "w-[50px] " + classes
                    : (size
                          ? "w-[" + size + "px] h-[" + size + "px] "
                          : "w-[40px] h-[40px] ") +
                      "hover:bg-outline hover:bg-opacity-15 " +
                      classes
            }
        >
            {children}
        </div>
    );
}
