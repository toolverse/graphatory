import { Canvas, Group, Rect, Shadow, Textbox } from "fabric";

export default function addNode(canvas: Canvas | null) {
    const nodeWidth = 180;
    const nodeHeight = 50;
    const rounded = 5;
    const defaultShadowOffset = 5;
    const defaultAccentWidth = 15;
    const defaultTextSize = 16;
    const padding = 5;
    const defaultStrokeWidth = 1;

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
        strokeWidth: defaultStrokeWidth,
        strokeUniform: true,
        shadow: brutalShadow,
    });

    const highlightRect = new Rect({
        width: nodeWidth,
        height: nodeHeight,
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
            height: nodeGroup.height,
            left: -nodeWidth / 2 - defaultStrokeWidth,
            top: -nodeHeight / 2 - defaultStrokeWidth,
        });
        clipRect.setCoords();
        highlightRect.setCoords();
    });

    canvas?.add(nodeGroup);
}
