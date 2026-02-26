import "./ColorGrid.scss";

interface IColorGridProps {
    colors: readonly (readonly string[])[];
    selected: string;
    onSelect: (color: string) => void;
    onClose: () => void;
}

const ColorGrid = ({
    colors,
    selected,
    onSelect,
    onClose,
}: IColorGridProps) => (
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

export default ColorGrid;
