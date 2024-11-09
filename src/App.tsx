import { useEffect, useRef } from "react";
import "./App.css";
import { Canvas, Rect } from "fabric";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    canvasRef.current = new Canvas("canvas", {
      height: 800,
      width: 800,
      backgroundColor: "#f5f5f5",
      selection: false,
      renderOnAddRemove: true,
    });

    const rect = new Rect({
      top: 50,
      left: 50,
      width: 50,
      height: 50,
      fill: "red",
    });

    canvasRef.current.add(rect);
  }, []);

  return (
    <div className="h-full w-full">
      <canvas id="canvas"></canvas>
    </div>
  );
}

export default App;
