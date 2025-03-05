import {
    Canvas,
    controlsUtils,
    Path,
    Point,
    TPointerEvent,
    TPointerEventInfo,
} from "fabric";
import { joinPoints } from "./utils/types";

export default function addLine(
    canvas: Canvas | null,
    objectID: string,
    guidePoints: joinPoints[]
) {
    let drawing = false;
    let Line: Path;
    let startPoint = new Point();
    let snapped = false;
    let xheavyOverride = false;

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
        snapped = false;
        guidePoints.forEach((p: joinPoints) => {
            Object.values(p).forEach((e: Point, index) => {
                const newPoint = new Point(e.x, e.y);
                if (close(point, newPoint)) {
                    snapped = true;
                    if (index == 0 || index == 1) {
                        xheavyOverride = false;
                    } else {
                        xheavyOverride = true;
                    }
                    ret = newPoint;
                }
            });
        });
        return ret;
    }

    function close(p: Point, point: Point) {
        const tolerence = 15;
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
            if (!drawing) {
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
    }

    function modifyDrawing(event: TPointerEventInfo<TPointerEvent>) {
        if (canvas) {
            if (drawing) {
                canvas.selection = false;
                const pointer = snap(canvas.getViewportPoint(event.e));
                canvas.remove(Line);
                Line = new Path(getPath(startPoint, pointer), {
                    fill: null,
                    strokeWidth: 3,
                    stroke: "black",
                    id: objectID,
                });
                canvas.add(Line);
                canvas.renderAll();
            }
        }
    }

    function stopDrawing(event: TPointerEventInfo<TPointerEvent>) {
        if (canvas) {
            const pointer = canvas.getViewportPoint(event.e);
            if (!close(startPoint, pointer)) {
                canvas.selection = true;
                drawing = false;
                canvas.getObjects().forEach((a) => {
                    if (a.name != "dot-matrix-background") {
                        a.set({ selectable: true });
                    }
                });
                deactivate();
                Line.on("mousedown", () => {
                    Line.cornerStyle = "circle";
                    Line.hasBorders = false;
                    Line.controls = controlsUtils.createPathControls(Line);
                });
            }
        }
    }

    function getPath(startpointer: Point, endpointer: Point) {
        let xheavy;
        if (snapped) {
            xheavy = xheavyOverride;
        } else {
            xheavy =
                Math.abs(endpointer.x - startPoint.x) >
                Math.abs(endpointer.y - startPoint.y);
        }
        if (xheavy) {
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
        return (
            "M " +
            startpointer.x +
            " " +
            startpointer.y +
            " C " +
            startpointer.x +
            " " +
            (startpointer.y + endpointer.y) / 2 +
            " " +
            endpointer.x +
            " " +
            (startpointer.y + endpointer.y) / 2 +
            " " +
            endpointer.x +
            " " +
            endpointer.y
        );
    }
}
