import { Canvas, Circle, Rect } from "fabric";

export default function addSquare(canvas: null | Canvas) {
    if (canvas) {
        const rect = new Rect({
            width: 360,
            height: 120,
            fill: null,
            stroke: "black",
            strokeWidth: 3,
            strokeUniform: true,
            rx: 10,
        });
        canvas.centerObject(rect);
        canvas.add(rect);
    }
}

export function addCircle(canvas: null | Canvas) {
    if (canvas) {
        const circle = new Circle({
            radius: 120,
            fill: null,
            stroke: "black",
            strokeWidth: 3,
        });
        canvas.centerObject(circle);
        canvas.add(circle);
    }
}
