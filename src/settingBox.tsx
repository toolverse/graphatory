import {
    Canvas,
    FabricObject,
    FabricObjectProps,
    Group,
    ObjectEvents,
    Path,
    SerializedObjectProps,
    Textbox,
} from "fabric";
import { ChangeEventHandler, SetStateAction, useEffect, useState } from "react";
import { ToolIcon } from "./Toolbar";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

type FabricObjectShort = FabricObject<
    Partial<FabricObjectProps>,
    SerializedObjectProps,
    ObjectEvents
>;

export default function SettingBox({ canvas }: { canvas: Canvas | null }) {
    const [activeObject, setActiveObject] = useState<FabricObjectShort | null>(
        null
    );
    const [objectPosLeft, setObjectPosLeft] = useState(10);
    const [objectPosTop, setObjectPosTop] = useState(10);
    // const [objectWidth, setObjectWidth] = useState(0);
    // const [objectHeight, setObjectHeight] = useState(0);
    const [objectColor, setObjectColor] = useState("");
    useEffect(() => {
        if (canvas) {
            canvas.on("selection:created", (event) => {
                handleObjectSelection(event.selected[0]);
            });
            canvas.on("selection:updated", (event) => {
                handleObjectSelection(event.selected[0]);
            });
            canvas.on("selection:cleared", () => {
                setActiveObject(null);
                clearSettings();
            });
        }
    }, [canvas]);

    function clearSettings() {
        setObjectPosLeft(0);
        setObjectPosTop(0);
        // setObjectWidth(0);
        // setObjectHeight(0);
        setObjectColor("");
    }

    const handleObjectSelection = (obj: FabricObjectShort) => {
        if (!obj) return;

        setActiveObject(obj);
        setObjectPosLeft(obj.left);
        setObjectPosTop(obj.top + obj.height + 20);
        // setObjectHeight(obj.height - 1);
        // setObjectWidth(obj.width - 1);

        if (obj.type === "group") {
            setObjectColor(obj.toObject().objects[1].fill);
        } else if (obj.type === "textbox") {
            setObjectColor(obj.toObject().fill);
        } else if (obj.type === "path") {
            setObjectColor(obj.toObject().stroke);
        }
    };

    // function handleWidthChange() {}
    // function handleHeightChange() {}
    function handleColorChange(event: {
        target: { value: SetStateAction<string> };
    }) {
        if (activeObject && activeObject.type == "group") {
            setObjectColor(event.target.value);
            const group = activeObject as Group;
            group.getObjects().forEach((obj, index) => {
                if (index == 1) {
                    obj.set({ fill: objectColor });
                    canvas?.renderAll();
                }
            });
        } else if (activeObject && activeObject.type == "textbox") {
            setObjectColor(event.target.value);
            const text = activeObject as Textbox;
            text.set({ fill: event.target.value });
            canvas?.renderAll();
        } else if (activeObject && activeObject.type == "path") {
            setObjectColor(event.target.value);
            const Line = activeObject as Path;
            Line.set({ stroke: event.target.value });
            canvas?.renderAll();
        }
    }
    function handleTextAlignChangeLeft() {
        handleTextAlignChange("left");
    }
    function handleTextAlignChangeRight() {
        handleTextAlignChange("right");
    }
    function handleTextAlignChangeCenter() {
        handleTextAlignChange("center");
    }
    function handleTextAlignChange(pos: string) {
        if (activeObject && activeObject.type == "group") {
            const group = activeObject as Group;
            group.getObjects().forEach((obj, index) => {
                if (index == 2) {
                    obj.set({ textAlign: pos });
                    canvas?.renderAll();
                }
            });
        } else if (activeObject) {
            const text = activeObject as Textbox;
            text.set({ textAlign: pos });
            canvas?.renderAll();
        }
    }

    if (activeObject) {
        if (activeObject.type === "group" || activeObject.type === "textbox") {
            return (
                <>
                    <SettingContainer left={objectPosLeft} top={objectPosTop}>
                        <ToolIcon>
                            <Input
                                type="color"
                                value={objectColor}
                                onChange={handleColorChange}
                            ></Input>
                        </ToolIcon>
                        <ToolIcon size={36} onClick={handleTextAlignChangeLeft}>
                            <AlignLeft size={16} />
                        </ToolIcon>
                        <ToolIcon
                            size={36}
                            onClick={handleTextAlignChangeCenter}
                        >
                            <AlignCenter size={16} />
                        </ToolIcon>
                        <ToolIcon
                            size={36}
                            onClick={handleTextAlignChangeRight}
                        >
                            <AlignRight size={16} />
                        </ToolIcon>
                    </SettingContainer>
                </>
            );
        } else if (activeObject.type === "path") {
            return (
                <SettingContainer left={objectPosLeft} top={objectPosTop}>
                    <ToolIcon>
                        <Input
                            type="color"
                            value={objectColor}
                            onChange={handleColorChange}
                        ></Input>
                    </ToolIcon>
                </SettingContainer>
            );
        }
    }
}

function SettingContainer({
    children,
    left,
    top,
}: {
    children: JSX.Element[] | JSX.Element;
    left: number;
    top: number;
}) {
    return (
        <>
            <div
                className={
                    "fixed p-2 h-12 w-auto bg-white flex justify-between items-center rounded-md shadow-md gap-1"
                }
                style={{ top: top, left: left }}
            >
                {children}
            </div>
        </>
    );
}

function Input({
    value,
    onChange,
    type,
}: {
    value?: string | number;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    type?: "text" | "color" | "align-buttons";
}) {
    if (type == "text") {
        return (
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-12 h-12 text-center"
            />
        );
    } else if (type == "color") {
        return (
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="h-[36px] w-[36px] rounded-md"
            />
        );
    }
}
