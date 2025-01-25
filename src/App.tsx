import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Canvas } from "fabric";
import TitleCard, { LogoAndTitle, UndoRedo } from "./TitleCard";

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

            initCanvas.backgroundColor = "#fafafa";
            initCanvas.renderAll();

            setCanvas(initCanvas);

            return () => {
                initCanvas.dispose();
            };
        }
    }, []);

    return (
        <>
            <canvas ref={canvasRef}></canvas>
            <TitleCard>
                <LogoAndTitle></LogoAndTitle>
                <UndoRedo></UndoRedo>
            </TitleCard>
        </>
    );
}

export default App;
