import { useRef, useState, useCallback, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { FreeTextData, TComponentSetting } from "../../types/component.types";
import "./FreeTextEditorStep.scss";

interface IFreeTextEditorStepProps {
    componentSettingForm: TComponentSetting;
    setComponentSettingForm: Dispatch<SetStateAction<TComponentSetting>>;
}

const TEXT_COLORS = [
    ["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"],
    ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"],
    ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"],
    ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
    ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0"],
    ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79"],
    ["#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47"],
    ["#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130"],
];

const BG_COLORS = [
    ["transparent", "#ffffff", "#f3f3f3", "#efefef", "#d9d9d9", "#cccccc", "#b7b7b7", "#999999"],
    ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9"],
    ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6"],
    ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3"],
    ["#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7"],
    ["#374768", "#1976d2", "#388e3c", "#d32f2f", "#f57c00", "#7b1fa2", "#0b5394", "#134f5c"],
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

const defaultFreeTextData: FreeTextData = {
    htmlContent: "",
    defaultFontSize: 16,
    defaultAlign: "right",
};

const getFreeTextData = (form: TComponentSetting): FreeTextData => {
    return (form as any).freeTextData ?? defaultFreeTextData;
};

/** Apply execCommand and sync HTML back to state */
function exec(command: string, value?: string) {
    document.execCommand(command, false, value);
}

const ColorGrid = ({
    colors,
    selected,
    onSelect,
    onClose,
}: {
    colors: string[][];
    selected: string;
    onSelect: (c: string) => void;
    onClose: () => void;
}) => (
    <div className="fte-color-dropdown" onMouseDown={(e) => e.preventDefault()}>
        <div className="fte-color-grid">
            {colors.map((row, ri) => (
                <div key={ri} className="fte-color-row">
                    {row.map((c) => (
                        <button
                            key={c}
                            className={`fte-color-cell ${selected === c ? "active" : ""}`}
                            style={{
                                backgroundColor: c === "transparent" ? "#fff" : c,
                                border:
                                    c === "transparent"
                                        ? "2px dashed #ccc"
                                        : c === "#ffffff"
                                            ? "1px solid #ddd"
                                            : "1px solid transparent",
                            }}
                            onClick={() => {
                                onSelect(c);
                                onClose();
                            }}
                            title={c === "transparent" ? "ללא" : c}
                        />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

const FreeTextEditorStep = ({
    componentSettingForm,
    setComponentSettingForm,
}: IFreeTextEditorStepProps) => {
    const data = getFreeTextData(componentSettingForm);
    const editorRef = useRef<HTMLDivElement>(null);
    const [showTextColor, setShowTextColor] = useState(false);
    const [showBgColor, setShowBgColor] = useState(false);
    const [showFontSize, setShowFontSize] = useState(false);
    const [currentColor, setCurrentColor] = useState("#000000");
    const [currentBgColor, setCurrentBgColor] = useState("transparent");
    const initializedRef = useRef(false);

    // Initialize editor content once
    useEffect(() => {
        if (editorRef.current && !initializedRef.current) {
            editorRef.current.innerHTML = data.htmlContent;
            initializedRef.current = true;
        }
    }, []);

    const syncToState = useCallback(() => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML;
        setComponentSettingForm((prev) => ({
            ...prev,
            freeTextData: { ...getFreeTextData(prev), htmlContent: html },
        } as any));
    }, [setComponentSettingForm]);

    const updateMeta = (partial: Partial<FreeTextData>) => {
        setComponentSettingForm((prev) => ({
            ...prev,
            freeTextData: { ...getFreeTextData(prev), ...partial },
        } as any));
    };

    const closeAllDropdowns = () => {
        setShowTextColor(false);
        setShowBgColor(false);
        setShowFontSize(false);
    };

    const handleBold = () => {
        exec("bold");
        syncToState();
    };

    const handleItalic = () => {
        exec("italic");
        syncToState();
    };

    const handleUnderline = () => {
        exec("underline");
        syncToState();
    };

    const handleTextColor = (color: string) => {
        exec("foreColor", color);
        setCurrentColor(color);
        syncToState();
    };

    const handleBgColor = (color: string) => {
        if (color === "transparent") {
            exec("hiliteColor", "transparent");
        } else {
            exec("hiliteColor", color);
        }
        setCurrentBgColor(color);
        syncToState();
    };

    const handleFontSize = (size: number) => {
        // execCommand fontSize only supports 1-7, so we use a workaround:
        // wrap selection in a span with inline style
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        if (range.collapsed) {
            setShowFontSize(false);
            return;
        }

        // Use fontSize command with size 7 as a marker, then replace
        exec("fontSize", "7");

        // Find all font elements with size=7 and replace with span
        if (editorRef.current) {
            const bigFonts = editorRef.current.querySelectorAll('font[size="7"]');
            bigFonts.forEach((el) => {
                const span = document.createElement("span");
                span.style.fontSize = `${size}px`;
                span.innerHTML = el.innerHTML;
                el.replaceWith(span);
            });
        }

        syncToState();
        setShowFontSize(false);
    };

    const handleAlign = (align: "right" | "center" | "left") => {
        const commandMap = {
            right: "justifyRight",
            center: "justifyCenter",
            left: "justifyLeft",
        };
        exec(commandMap[align]);
        updateMeta({ defaultAlign: align });
        syncToState();
    };

    return (
        <div className="fte">
            <div className="fte__name-row">
                <label>שם הרכיב</label>
                <input
                    type="text"
                    value={componentSettingForm.name}
                    onChange={(e) =>
                        setComponentSettingForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    placeholder="הכנס שם לרכיב..."
                />
            </div>

            <div className="fte__toolbar">
                {/* Font size */}
                <div className="fte__color-wrapper">
                    <button
                        className="fte__btn fte__btn--fontsize"
                        onClick={() => {
                            setShowFontSize(!showFontSize);
                            setShowTextColor(false);
                            setShowBgColor(false);
                        }}
                        title="גודל טקסט"
                    >
                        <span>{data.defaultFontSize}</span>
                        <span className="fte__dropdown-arrow">▾</span>
                    </button>
                    {showFontSize && (
                        <div
                            className="fte-fontsize-dropdown"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {FONT_SIZES.map((s) => (
                                <button
                                    key={s}
                                    className="fte-fontsize-option"
                                    onClick={() => handleFontSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="fte__separator" />

                {/* Bold */}
                <button
                    className="fte__btn fte__btn--format"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleBold();
                    }}
                    title="מודגש (Ctrl+B)"
                >
                    <strong>B</strong>
                </button>

                {/* Italic */}
                <button
                    className="fte__btn fte__btn--format"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleItalic();
                    }}
                    title="נטוי (Ctrl+I)"
                >
                    <em>I</em>
                </button>

                {/* Underline */}
                <button
                    className="fte__btn fte__btn--format"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleUnderline();
                    }}
                    title="קו תחתון (Ctrl+U)"
                >
                    <span style={{ textDecoration: "underline" }}>U</span>
                </button>

                <div className="fte__separator" />

                {/* Text color */}
                <div className="fte__color-wrapper">
                    <button
                        className="fte__btn fte__btn--color"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setShowTextColor(!showTextColor);
                            setShowBgColor(false);
                            setShowFontSize(false);
                        }}
                        title="צבע טקסט"
                    >
                        <span className="fte__color-letter">A</span>
                        <span
                            className="fte__color-bar"
                            style={{ backgroundColor: currentColor }}
                        />
                    </button>
                    {showTextColor && (
                        <ColorGrid
                            colors={TEXT_COLORS}
                            selected={currentColor}
                            onSelect={handleTextColor}
                            onClose={() => setShowTextColor(false)}
                        />
                    )}
                </div>

                {/* Background color */}
                <div className="fte__color-wrapper">
                    <button
                        className="fte__btn fte__btn--color"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setShowBgColor(!showBgColor);
                            setShowTextColor(false);
                            setShowFontSize(false);
                        }}
                        title="צבע סימון"
                    >
                        <span className="fte__color-letter">🖍</span>
                        <span
                            className="fte__color-bar"
                            style={{
                                backgroundColor:
                                    currentBgColor === "transparent" ? "#fff" : currentBgColor,
                                border:
                                    currentBgColor === "transparent"
                                        ? "1px dashed #999"
                                        : undefined,
                            }}
                        />
                    </button>
                    {showBgColor && (
                        <ColorGrid
                            colors={BG_COLORS}
                            selected={currentBgColor}
                            onSelect={handleBgColor}
                            onClose={() => setShowBgColor(false)}
                        />
                    )}
                </div>

                <div className="fte__separator" />

                {/* Alignment */}
                <button
                    className={`fte__btn fte__btn--align ${data.defaultAlign === "right" ? "active" : ""}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleAlign("right");
                    }}
                    title="יישור לימין"
                >
                    ⫷
                </button>
                <button
                    className={`fte__btn fte__btn--align ${data.defaultAlign === "center" ? "active" : ""}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleAlign("center");
                    }}
                    title="יישור למרכז"
                >
                    ☰
                </button>
                <button
                    className={`fte__btn fte__btn--align ${data.defaultAlign === "left" ? "active" : ""}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleAlign("left");
                    }}
                    title="יישור לשמאל"
                >
                    ⫸
                </button>
            </div>

            {/* Rich text editor area */}
            <div
                className="fte__editor-area"
                onClick={closeAllDropdowns}
            >
                <div
                    ref={editorRef}
                    className="fte__editable"
                    contentEditable
                    dir="rtl"
                    style={{
                        fontSize: `${data.defaultFontSize}px`,
                        textAlign: data.defaultAlign,
                    }}
                    onInput={syncToState}
                    onBlur={syncToState}
                    data-placeholder="הקלד כאן את הטקסט..."
                />
            </div>
        </div>
    );
};

export default FreeTextEditorStep;
