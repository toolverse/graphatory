import { Canvas, Group, Rect, Shadow, Textbox } from "fabric";

export default function addNode(canvas: Canvas | null, objectID: string) {
    const nodeWidth = 180;
    const nodeHeight = 50;
    let realWidth = 180;
    let realHeight = 180;
    let textScaleX = 1;
    const rounded = 5;
    const defaultShadowOffset = 5;
    const defaultAccentWidth = 15;
    const defaultTextSize = 16;
    const padding = 5;
    const defaultStrokeWidth = 1;
    let textEditing = false;

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
        fill: "#FF0000",
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
        fill: "#000",
        top: nodeHeight / 2,
        left: defaultAccentWidth + padding,
        width: nodeWidth - defaultAccentWidth - 2 * padding,
        fontFamily: "REM",
        originY: "center",
        textAlign: "center",
        strokeUniform: true,
        scaleX: 1,
    });

    const nodeGroup = new Group([mainRect, highlightRect, text], {
        left: 425,
        top: 300,
        lockScalingFlip: true,
        id: objectID,
    });

    text.on("changed", () => {
        mainRect.set({
            width:
                (text.width + (defaultAccentWidth + 2 * padding)) / textScaleX,
        });
        nodeGroup.setCoords();
        canvas?.requestRenderAll();
    });

    nodeGroup.on("mousedblclick", () => {
        if (textEditing) {
            text.exitEditing();
            textEditing = !textEditing;
        } else {
            text.enterEditing();
            textEditing = !textEditing;
        }
    });

    nodeGroup.on("deselected", () => {
        if (textEditing) {
            text.exitEditing();
            textEditing = !textEditing;
        }
    });

    nodeGroup.on("scaling", () => {
        realWidth = nodeWidth * nodeGroup.scaleX;
        realHeight = nodeHeight * nodeGroup.scaleY;
        textScaleX = nodeGroup.scaleX;
        if (textEditing) {
            text.exitEditing();
            textEditing = !textEditing;
        }
        if (realHeight >= 28 && realWidth >= 100) {
            mainRect.set({
                shadow: {
                    offsetX: defaultShadowOffset / nodeGroup.scaleX,
                    offsetY: defaultShadowOffset / nodeGroup.scaleY,
                },
                rx: rounded / nodeGroup.scaleX,
                ry: rounded / nodeGroup.scaleY,
            });
            highlightRect.set({
                rx: rounded / nodeGroup.scaleX,
                ry: rounded / nodeGroup.scaleY,
            });
            text.set({
                scaleX: 1 / nodeGroup.scaleX,
                scaleY: 1 / nodeGroup.scaleY,
                width:
                    nodeGroup.width * textScaleX -
                    (defaultAccentWidth + 2 * padding + 2 * defaultStrokeWidth),
                top: nodeHeight / 2 / defaultTextSize,
                left:
                    -(nodeGroup.width / 2) +
                    (defaultAccentWidth + padding) / nodeGroup.scaleX,
            });
            clipRect.set({
                width: defaultAccentWidth / nodeGroup.scaleX,
                height: mainRect.height + defaultStrokeWidth,
                left: -nodeWidth / 2 - defaultStrokeWidth,
                top: -mainRect.height / 2 - defaultStrokeWidth,
            });
        } else {
            if (realHeight <= 28) {
                nodeGroup.set({
                    scaleY: 28 / nodeGroup.height,
                });
            }
            if (realWidth <= text.width) {
                nodeGroup.set({
                    scaleX: text.width / nodeGroup.width,
                });
            }
            if (realHeight <= text.height) {
                nodeGroup.set({
                    scaleY: text.height / nodeGroup.height,
                });
            }
            if (realWidth <= 100) {
                nodeGroup.set({
                    scaleX: 100 / nodeGroup.width,
                });
            }
        }
    });

    if (canvas) {
        canvas.add(nodeGroup);
    }
}
