import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import "./ImportButtons.scss";

const ImportButtons = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="import-buttons">
            <Button
                className="import-buttons__trigger"
                variant="outlined"
                onClick={handleClick}
                startIcon={<FileDownloadOutlinedIcon />}
                endIcon={<KeyboardArrowDownIcon className={open ? "rotate" : ""} />}
            >
                ייבוא נתונים
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                className="import-menu"
                PaperProps={{
                    elevation: 3,
                    className: "import-menu__paper",
                }}
            >
                <MenuItem onClick={handleClose} className="import-menu__item">
                    <div className="import-menu__icon-wrapper">
                        <LayersOutlinedIcon />
                    </div>
                    <div className="import-menu__text">
                        <Typography className="import-menu__title">ייבוא מסך מלא</Typography>
                        <Typography className="import-menu__description">
                            יצירת עותק חדש של מסך זה עם כל רכיביו
                        </Typography>
                    </div>
                </MenuItem>
                <MenuItem onClick={handleClose} className="import-menu__item">
                    <div className="import-menu__icon-wrapper">
                        <NearMeOutlinedIcon />
                    </div>
                    <div className="import-menu__text">
                        <Typography className="import-menu__title">ייבוא רכיבים סלקטיבי</Typography>
                        <Typography className="import-menu__description">
                            בחירה ידנית של רכיבים מהמסך לייבוא למסך אחר
                        </Typography>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default ImportButtons;
