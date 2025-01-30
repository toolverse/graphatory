import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ToolBar({ children }: { children: JSX.Element[] }) {
    return (
        <div className="fixed top-[40%] p-2 left-4 w-12 h-auto bg-white flex flex-col justify-between items-center rounded-md shadow-md gap-1">
            {children}
        </div>
    );
}

export function ToolIcon({
    children,
    grip,
    onClick,
    tooltip,
    size,
}: {
    children: JSX.Element;
    grip?: boolean;
    toggle?: boolean;
    onClick?: () => void;
    tooltip?: string;
    size?: number;
}) {
    const classes = "flex items-center justify-center rounded-md";

    if (tooltip) {
        return (
            <>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <div
                                onClick={onClick}
                                className={
                                    grip
                                        ? "w-[50px] " + classes
                                        : (size
                                              ? "w-[" +
                                                size +
                                                "px] h-[" +
                                                size +
                                                "px] "
                                              : "w-[40px] h-[40px] ") +
                                          "hover:bg-primary hover:bg-opacity-40 " +
                                          classes
                                }
                            >
                                {children}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </>
        );
    } else {
        return (
            <div
                onClick={onClick}
                className={
                    grip
                        ? "w-[50px] " + classes
                        : (size
                              ? "w-[" + size + "px] h-[" + size + "px] "
                              : "w-[40px] h-[40px] ") +
                          "hover:bg-primary hover:bg-opacity-40 " +
                          classes
                }
            >
                {children}
            </div>
        );
    }
}
