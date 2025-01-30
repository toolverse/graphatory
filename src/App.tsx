import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
    Canvas,
    Group,
    InteractiveFabricObject,
    Path,
    Point,
    Rect,
    Shadow,
    Textbox,
    TPointerEvent,
    TPointerEventInfo,
} from "fabric";
import TitleCard, { LogoAndTitle, UndoRedo } from "./TitleCard";
import ToolBar, { ToolIcon } from "./Toolbar";
import {
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
    const [guidePoints, setGuidePoints] = useState<Point[]>([]);

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

    const addNode = () => {
        const nodeWidth = 180;
        const nodeHeight = 50;
        const rounded = 5;
        const defaultShadowOffset = 5;
        const defaultAccentWidth = 15;
        const defaultTextSize = 16;
        const padding = 5;

        if (canvas) {
            const brutalShadow = new Shadow({
                color: "#000",
                offsetX: defaultShadowOffset,
                offsetY: defaultShadowOffset,
            });

            const mainRect = new Rect({
                width: nodeWidth,
                height: nodeHeight,
                fill: "white",
                rx: rounded,
                ry: rounded,
                stroke: "black",
                strokeWidth: 1,
                strokeUniform: true,
                shadow: brutalShadow,
            });

            const highlightRect = new Rect({
                width: nodeWidth,
                height: nodeHeight,
                stroke: "black",
                strokeWidth: 1,
                strokeUniform: true,
                rx: rounded,
                ry: rounded,
                left: 0,
                top: 0,
                fill: "red",
            });

            const clipRect = new Rect({
                width: defaultAccentWidth,
                height: nodeHeight,
                left: -nodeWidth / 2,
                top: -nodeHeight / 2,
            });

            highlightRect.clipPath = clipRect;

            const text = new Textbox("Node1", {
                fontSize: defaultTextSize,
                fill: "black",
                top: nodeHeight / 2,
                left: defaultAccentWidth + padding,
                width: nodeWidth - defaultAccentWidth - 2 * padding,
                fontFamily: "REM",
                originY: "center",
                textAlign: "center",
                strokeUniform: true,
            });

            const nodeGroup = new Group([mainRect, highlightRect, text], {
                left: 425,
                top: 300,
            });

            canvas.add(nodeGroup);

            nodeGroup.on("mousedblclick", () => {
                text.enterEditing();
                console.log(nodeGroup.aCoords);
            });

            nodeGroup.on("scaling", () => {
                nodeGroup._objects[0].set({
                    shadow: {
                        offsetX: defaultShadowOffset / nodeGroup.scaleX,
                        offsetY: defaultShadowOffset / nodeGroup.scaleY,
                    },
                    rx: rounded / nodeGroup.scaleX,
                    ry: rounded / nodeGroup.scaleY,
                });
                nodeGroup._objects[1].set({
                    rx: rounded / nodeGroup.scaleX,
                    ry: rounded / nodeGroup.scaleY,
                });
                nodeGroup._objects[2].set({
                    fontSize: defaultTextSize / nodeGroup.scaleX,
                    top: nodeHeight / 2 / nodeGroup.scaleY / defaultTextSize,
                });
                clipRect.set({
                    width: defaultAccentWidth / nodeGroup.scaleX,
                });
            });
        }
    };

    const addLine = () => {
        let drawing = false;
        let Line: Path;
        let startPoint = new Point();

        refillGuidlines();

        console.log(guidePoints);

        function refillGuidlines() {
            setGuidePoints([]);
            if (canvas) {
                canvas.getObjects().forEach((o) => {
                    if (o.type != "path") {
                        const coords = o.aCoords;
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

                        setGuidePoints((prev) => [...prev, p1, p2, p3, p4]);
                    }
                });
            }
        }

        if (canvas) {
            canvas.getObjects().forEach((a) => {
                a.set({ selectable: false });
            });

            canvas.on("mouse:down", startDrawing);
            canvas.on("mouse:move", modifyDrawing);
            canvas.on("mouse:up", stopDrawing);
        }

        function snap(point: Point) {
            let ret = point;
            guidePoints.forEach((p) => {
                if (close(p, point)) {
                    console.log(p);
                    ret = p;
                }
            });
            return ret;
        }

        function close(p: Point, point: Point) {
            const tolerence = 15;
            console.log("mouse pointer " + point);
            // console.log("other pointer" + p);
            if (point.x <= p.x + tolerence && point.x >= p.x - tolerence) {
                if (point.y <= p.y + tolerence && point.y >= p.y - tolerence) {
                    return true;
                }
            }
            return false;
        }

        function deactivate() {
            if (canvas) {
                canvas.off("mouse:down", startDrawing);
                canvas.off("mouse:move", modifyDrawing);
                canvas.off("mouse:up", stopDrawing);
            }
        }

        function startDrawing(event: TPointerEventInfo<TPointerEvent>) {
            if (canvas) {
                const pointer = snap(canvas.getViewportPoint(event.e));
                startPoint = pointer;
                Line = new Path(getPath(pointer, pointer), {
                    id: "added-line",
                    fill: null,
                    strokeWidth: 2,
                    stroke: "black",
                });

                canvas.add(Line);
                drawing = true;
            }
        }

        function modifyDrawing(event: TPointerEventInfo<TPointerEvent>) {
            if (canvas) {
                if (drawing) {
                    canvas.selection = false;
                    const pointer = snap(canvas.getViewportPoint(event.e));
                    canvas.remove(Line);
                    Line = new Path(getPath(startPoint, pointer), {
                        id: "added-line",
                        fill: null,
                        strokeWidth: 2,
                        stroke: "black",
                    });
                    canvas.add(Line);
                }
            }
        }

        function stopDrawing() {
            if (canvas) {
                canvas.selection = true;
                drawing = false;
                canvas.getObjects().forEach((a) => {
                    a.set({ selectable: true });
                });
                deactivate();
            }
        }

        function getPath(startpointer: Point, endpointer: Point) {
            return (
                "M " +
                startpointer.x +
                " " +
                startpointer.y +
                " C " +
                (startpointer.x + endpointer.x) / 2 +
                " " +
                startpointer.y +
                " " +
                (startpointer.x + endpointer.x) / 2 +
                " " +
                endpointer.y +
                " " +
                endpointer.x +
                " " +
                endpointer.y
            );
        }
    };

    function test() {
        if (canvas) {
            console.log("haha");
        }
    }

    return (
        <>
            <canvas ref={canvasRef}></canvas>
            <TitleCard>
                <LogoAndTitle></LogoAndTitle>
                <UndoRedo></UndoRedo>
            </TitleCard>
            <ToolBar>
                <ToolIcon tooltip="select">
                    <MousePointer2 color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon tooltip="add Node" onClick={addNode}>
                    <Workflow color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon tooltip="add shapes">
                    <Shapes color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon tooltip="add line" onClick={addLine}>
                    <MoveUpRight color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon tooltip="add text">
                    <Type color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
                <ToolIcon tooltip="add custom objects" onClick={test}>
                    <Plus color="#000" size={20} strokeWidth={1.5} />
                </ToolIcon>
            </ToolBar>
        </>
    );
}

export default App;
