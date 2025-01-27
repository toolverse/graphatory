import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Canvas, InteractiveFabricObject } from "fabric";
import TitleCard, { LogoAndTitle, UndoRedo } from "./TitleCard";
import ToolBar, { ToolIcon } from "./Toolbar";
import {
    GripHorizontal,
    MousePointer2,
    MoveUpRight,
    Plus,
    Shapes,
    Type,
    Workflow,
} from "lucide-react";

function App() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    window.addEventListener("resize", () => {
        if (canvas) {
            canvas.setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
    });

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: window.innerWidth,
                height: window.innerHeight,
            });

            initCanvas.backgroundColor = "#efefef";
            initCanvas.renderAll();

            setCanvas(initCanvas);

            return () => {
                initCanvas.dispose();
            };
        }
    }, []);

    InteractiveFabricObject.ownDefaults = {
        ...InteractiveFabricObject.ownDefaults,
        cornerStyle: "circle",
        cornerStrokeColor: "black",
        cornerColor: "white",
        transparentCorners: false,
        borderColor: "black",
        borderScaleFactor: 2,
        padding: 10,
    };

    return (
        <>
            <canvas ref={canvasRef}></canvas>
            <TitleCard>
                <LogoAndTitle></LogoAndTitle>
                <UndoRedo></UndoRedo>
            </TitleCard>
            <ToolBar>
                <ToolIcon grip={true}>
                    <GripHorizontal
                        color="#535353"
                        strokeWidth={1.5}
                        size={18}
                    />
                </ToolIcon>
                <ToolIcon tooltip="selection">
                    <MousePointer2
                        color="#535353"
                        size={20}
                        strokeWidth={1.5}
                    />
                </ToolIcon>
                <ToolIcon>
                    <Workflow color="#535353" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon>
                    <Shapes color="#535353" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon>
                    <MoveUpRight color="#535353" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon>
                    <Type color="#535353" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon>
                    <Plus color="#535353" size={20} strokeWidth={1.5} />
                </ToolIcon>
            </ToolBar>
        </>
    );
}

export default App;
