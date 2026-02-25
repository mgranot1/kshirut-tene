import { useState } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import IconButton from "@mui/material/IconButton";
import './SharedIcon.scss'

type IconSize = 'medium' | 'large';

interface ISharedIconProps {
    isShared: boolean;
    onToggleSharedStatus: (value: boolean) => void;
    size: IconSize
}

const SharedIcon = ({ isShared, onToggleSharedStatus, size }: ISharedIconProps) => {
    const [isFavorite, setIsFavorite] = useState<boolean>(isShared);

    const handleToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        onToggleSharedStatus(isFavorite);
        setIsFavorite((prev) => !prev);
    }

    return (<IconButton
        sx={{ padding: 0 }}
        className={`shared-icon ${size}-icon`}
        onClick={handleToggle}
    >
        {isFavorite ? (
            <StarRateIcon className="shared-icon__star" />
        ) : (
            <StarBorderIcon />
        )}
    </IconButton>)

}

export default SharedIcon;