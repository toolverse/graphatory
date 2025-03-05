import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
    Canvas,
    Circle,
    Group,
    InteractiveFabricObject,
    Point,
    Rect,
    Textbox,
} from "fabric";
import TitleCard, { LogoAndTitle, UndoRedo } from "./TitleCard";
import ToolBar, { ToolIcon } from "./Toolbar";
import {
    MousePointer2,
    MoveUpRight,
    Shapes,
    Type,
    Workflow,
} from "lucide-react";
import SettingBox from "./settingBox";
import { FabricObject } from "fabric";
import addNode from "./Node";
import genID from "./utils/idGen";
import addLine from "./Lines";
import { joinPoints } from "./utils/types";

declare module "fabric" {
    interface FabricObject {
        id?: string;
        name?: string;
    }
    interface SerializedObjectProps {
        id?: string;
        name?: string;
    }
}

FabricObject.customProperties = ["name", "id"];

function App() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [guidePoints, setGuidePoints] = useState<joinPoints[]>([]);

    window.addEventListener("resize", () => {
        if (canvas) {
            canvas.setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
    });

    function backgroundGrid() {
        const circles = [];
        const offset = 5;
        const spacing = 17;
        for (let i = offset; i < window.outerWidth; i += spacing) {
            for (let j = offset; j < window.outerHeight; j += spacing) {
                const circle = new Circle({
                    top: j,
                    left: i,
                    radius: 1,
                    fill: "gray",
                    opacity: 0.5,
                });
                circles.push(circle);
            }
        }
        return new Group(circles, {
            selectable: false,
            interactive: false,
            lockMovementX: true,
            lockMovementY: true,
            evented: false,
            name: "dot-matrix-background",
        });
    }

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: window.innerWidth,
                height: window.innerHeight,
            });

            initCanvas.backgroundColor = "#efefef";
            initCanvas.renderAll();

            setCanvas(initCanvas);
            initCanvas.add(backgroundGrid());

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

    function refillGuidePoints() {
        setGuidePoints([]);
        if (canvas) {
            canvas.getObjects().forEach((obj) => {
                if (obj.type != "path") {
                    const coords = obj.aCoords;
                    const p1 = new Point({
                        x: (coords.tl.x + coords.tr.x) / 2,
                        y: coords.tl.y,
                    });
                    const p2 = new Point({
                        x: (coords.tl.x + coords.tr.x) / 2,
                        y: coords.bl.y,
                    });
                    const p3 = new Point({
                        x: coords.bl.x,
                        y: (coords.tl.y + coords.br.y) / 2,
                    });
                    const p4 = new Point({
                        x: coords.br.x,
                        y: (coords.tl.y + coords.br.y) / 2,
                    });

                    const addPoint = {
                        top: p1,
                        bottom: p2,
                        left: p3,
                        right: p4,
                    };

                    setGuidePoints((prev) => [...prev, addPoint]);
                }
            });
        }
    }

    function addText() {
        if (canvas) {
            const nodeWidth = 180;
            const nodeHeight = 50;
            const defaultAccentWidth = 15;
            const defaultTextSize = 16;
            const padding = 5;

            const text = new Textbox("Node1", {
                left: 425,
                top: 300,
                textAlign: "center",
                fontSize: defaultTextSize,
                lockScalingY: true,
                fill: "#3D3D3D",
                width: nodeWidth - defaultAccentWidth - 2 * padding,
                height: nodeHeight - 2 * padding,
                fontFamily: "REM",
            });

            text.on("scaling", () => {
                text.set({
                    fontSize: defaultTextSize / text.scaleX,
                    top: nodeHeight / 2 / text.scaleY / defaultTextSize,
                });
            });

            canvas.add(text);
        }
    }

    function addShapes() {
        if (canvas) {
            const rect = new Rect({
                width: 360,
                height: 120,
                fill: null,
                stroke: "black",
                strokeWidth: 3,
                rx: 10,
            });
            canvas.centerObject(rect);
            canvas.add(rect);
        }
    }

    return (
        <>
            <canvas ref={canvasRef}></canvas>
            <SettingBox canvas={canvas}></SettingBox>
            <TitleCard>
                <LogoAndTitle></LogoAndTitle>
                <UndoRedo></UndoRedo>
            </TitleCard>
            <ToolBar>
                <ToolIcon tooltip="select">
                    <MousePointer2 color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon
                    tooltip="add Node"
                    onClick={() => {
                        const objectID = genID();
                        addNode(canvas, objectID);
                    }}
                >
                    <Workflow color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon tooltip="add shapes" onClick={addShapes}>
                    <Shapes color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon
                    tooltip="add line"
                    onClick={() => {
                        const objectID = genID();
                        refillGuidePoints();
                        addLine(canvas, objectID, guidePoints);
                    }}
                >
                    <MoveUpRight color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon tooltip="add text" onClick={addText}>
                    <Type color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                {/* <ToolIcon tooltip="add custom objects" onClick={test}>
                    <Plus color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon> */}
            </ToolBar>
        </>
    );
}

export default App;
