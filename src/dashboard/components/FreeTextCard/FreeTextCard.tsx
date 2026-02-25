import type { FreeTextData } from "../../types/component.types";
import "./FreeTextCard.scss";

interface IFreeTextCardProps {
    data: FreeTextData;
}

const FreeTextCard = ({ data }: IFreeTextCardProps) => {
    return (
        <div
            className="free-text-card__display"
            style={{
                fontSize: `${data.defaultFontSize}px`,
                textAlign: data.defaultAlign,
            }}
            dangerouslySetInnerHTML={{ __html: data.htmlContent || "טקסט חופשי" }}
        />
    );
};

export default FreeTextCard;
