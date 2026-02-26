import { useRef, useState, useCallback, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { FreeTextData, TComponentSetting } from "../../types/component.types";
import { ComponentSettingMode } from "../../stores/componentSettingMode.store";
import {
    TEXT_COLORS,
    BG_COLORS,
    FONT_SIZES,
    DEFAULT_FREE_TEXT_DATA,
    ALIGN_COMMAND_MAP,
} from "./FreeTextEditor.constants";
import ColorGrid from "./ColorGrid";
import "./FreeTextEditor.scss";

interface IFreeTextEditorStepProps {
    mode: ComponentSettingMode;
    componentSettingForm: TComponentSetting;
    setComponentSettingForm: Dispatch<SetStateAction<TComponentSetting>>;
}

const getFreeTextData = (form: TComponentSetting): FreeTextData => {
    return (form as any).freeTextData ?? DEFAULT_FREE_TEXT_DATA;
};

/** Apply execCommand and sync HTML back to state */
function exec(command: string, value?: string): void {
    document.execCommand(command, false, value);
}

const FreeTextEditorStep = ({
    mode,
    componentSettingForm,
    setComponentSettingForm,
}: IFreeTextEditorStepProps) => {
    const data: FreeTextData = getFreeTextData(componentSettingForm);
    const editorRef = useRef<HTMLDivElement>(null);
    const [showTextColor, setShowTextColor] = useState<boolean>(false);
    const [showBgColor, setShowBgColor] = useState<boolean>(false);
    const [showFontSize, setShowFontSize] = useState<boolean>(false);
    const [currentColor, setCurrentColor] = useState<string>("#000000");
    const [currentBgColor, setCurrentBgColor] = useState<string>("transparent");
    const initializedRef = useRef<boolean>(false);

    const isViewMode: boolean = mode === ComponentSettingMode.View;

    // Initialize editor content once
    useEffect(() => {
        if (editorRef.current && !initializedRef.current) {
            editorRef.current.innerHTML = data.htmlContent;
            initializedRef.current = true;
        }
    }, []);

    const syncToState = useCallback((): void => {
        if (!editorRef.current) return;
        const html: string = editorRef.current.innerHTML;
        setComponentSettingForm((prev) => ({
            ...prev,
            freeTextData: { ...getFreeTextData(prev), htmlContent: html },
        } as any));
    }, [setComponentSettingForm]);

    const updateMeta = (partial: Partial<FreeTextData>): void => {
        setComponentSettingForm((prev) => ({
            ...prev,
            freeTextData: { ...getFreeTextData(prev), ...partial },
        } as any));
    };

    const closeAllDropdowns = (): void => {
        setShowTextColor(false);
        setShowBgColor(false);
        setShowFontSize(false);
    };

    const handleBold = (): void => {
        exec("bold");
        syncToState();
    };

    const handleItalic = (): void => {
        exec("italic");
        syncToState();
    };

    const handleUnderline = (): void => {
        exec("underline");
        syncToState();
    };

    const handleTextColor = (color: string): void => {
        exec("foreColor", color);
        setCurrentColor(color);
        syncToState();
    };

    const handleBgColor = (color: string): void => {
        if (color === "transparent") {
            exec("hiliteColor", "transparent");
        } else {
            exec("hiliteColor", color);
        }
        setCurrentBgColor(color);
        syncToState();
    };

    const handleFontSize = (size: number): void => {
        // execCommand fontSize only supports 1-7, so we use a workaround:
        // wrap selection in a span with inline style
        const sel: Selection | null = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range: Range = sel.getRangeAt(0);
        if (range.collapsed) {
            setShowFontSize(false);
            return;
        }

        // Use fontSize command with size 7 as a marker, then replace
        exec("fontSize", "7");

        // Find all font elements with size=7 and replace with span
        if (editorRef.current) {
            const bigFonts: NodeListOf<Element> = editorRef.current.querySelectorAll('font[size="7"]');
            bigFonts.forEach((el: Element) => {
                const span: HTMLSpanElement = document.createElement("span");
                span.style.fontSize = `${size}px`;
                span.innerHTML = el.innerHTML;
                el.replaceWith(span);
            });
        }

        syncToState();
        setShowFontSize(false);
    };

    const handleAlign = (align: "right" | "center" | "left"): void => {
        exec(ALIGN_COMMAND_MAP[align]);
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
                    disabled={isViewMode}
                />
            </div>

            {!isViewMode && (
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
            )}

            {/* Rich text editor area */}
            <div
                className="fte__editor-area"
                onClick={closeAllDropdowns}
            >
                <div
                    ref={editorRef}
                    className="fte__editable"
                    contentEditable={!isViewMode}
                    dir="rtl"
                    style={{
                        fontSize: `${data.defaultFontSize}px`,
                        textAlign: data.defaultAlign,
                    }}
                    onInput={syncToState}
                    onBlur={syncToState}
                    data-placeholder={isViewMode ? "" : "הקלד כאן את הטקסט..."}
                />
            </div>
        </div>
    );
};

export default FreeTextEditorStep;
