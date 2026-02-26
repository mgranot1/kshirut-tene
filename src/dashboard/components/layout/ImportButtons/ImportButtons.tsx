import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { ScreenMode, screenModeState } from "../../../stores/screenMode.store";
import { selectedComponentsState } from "../../../stores/selectedComponents.store";
import "./ImportButtons.scss";

import { useNavigate } from "react-router-dom";
import React from "react";
import { useCurrentPath } from "../../../../shared/hooks/useCurrentPath";
import { DASHBOARD_PREFIX } from "../../../../router/router.constant";
import { listTitle } from "../ScreensList/const";
import { useScreensByOwnership } from "../ScreensList/useScreensByOwnership";

const ImportButtons = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [screenMode, setScreenMode] = useRecoilState(screenModeState);
    const [selectedComponents, setSelectedComponents] = useRecoilState(selectedComponentsState);
    const { screenByOwnership, isLoading } = useScreensByOwnership();
    const currentScreenId = useCurrentPath();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectiveImportClick = () => {
        setScreenMode(ScreenMode.Select);
        setSelectedComponents([]);
        handleClose();
    };

    const handleCancelSelect = () => {
        setScreenMode(ScreenMode.ReadOnly);
        setSelectedComponents([]);
    };

    const handleScreenClick = (screenId: string, screenName: string) => {
        // Here we would normally perform the import, 
        // but as requested for now: "בלחיצה על שם המסך ננותב למסך זה עם הרכיבים החדשים"
        setScreenMode(ScreenMode.ReadOnly);
        handleClose();
        navigate(`/${DASHBOARD_PREFIX}/customScreen/${screenId}`, { state: { screenName, importedComponents: selectedComponents } });
    };

    if (screenMode === ScreenMode.Select) {
        return (
            <div className="import-buttons select-mode">
                <Button
                    className="import-buttons__trigger select-mode-btn"
                    variant="contained"
                    onClick={handleClick}
                    startIcon={<FileDownloadOutlinedIcon />}
                    endIcon={<KeyboardArrowDownIcon className={open ? "rotate" : ""} />}
                >
                    ייבוא למסך...
                </Button>
                <Button
                    className="import-buttons__cancel"
                    variant="contained"
                    onClick={handleCancelSelect}
                    sx={{
                        bgcolor: "#e2e8f0",
                        color: "#475569",
                        "&:hover": { bgcolor: "#cbd5e1" },
                        textTransform: "none",
                        boxShadow: "none"
                    }}
                >
                    ביטול
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    className="import-popup"
                    PaperProps={{
                        className: "import-popup__paper"
                    }}
                >
                    <div className="import-popup__content">
                        <Typography className="import-popup__header">הגדרות ייבוא</Typography>
                        <div className="import-popup__setting">
                            <Typography>עדכון שמות ויחידות לפני ייבוא</Typography>
                            <input type="checkbox" className="import-popup__checkbox" />
                        </div>
                        <div className="import-popup__screens">
                            {isLoading ? (
                                <Typography sx={{ p: 2, textAlign: "center" }}>טעינת מסכים...</Typography>
                            ) : (
                                Object.entries(screenByOwnership).map(([owner, categories]) => {
                                    const allScreensInGroup = Object.values(categories).flat();

                                    // Static mock screens to add if they don't exist in data
                                    const mockScreens = [
                                        { id: "SCR01", name: "מסך ראשי", color: "#1976d2" },
                                        { id: "SCR02", name: "מסך טנקים", color: "#388e3c" }
                                    ];

                                    const displayScreens = [...allScreensInGroup];

                                    // Add mock screens to "My Screens" if missing
                                    if (owner === "my") {
                                        mockScreens.forEach(mock => {
                                            if (!displayScreens.some(s => s.name === mock.name)) {
                                                displayScreens.push({
                                                    ...mock,
                                                    categoryId: "CAT01",
                                                    categoryName: "כללי",
                                                    creator: "demo_user",
                                                    changeTimestamp: new Date()
                                                });
                                            }
                                        });
                                    }

                                    const filteredScreens = displayScreens.filter(s => s.id !== currentScreenId);

                                    return filteredScreens.length > 0 ? (
                                        <div key={owner}>
                                            <Typography className="import-popup__group-title">
                                                {listTitle[owner]}
                                            </Typography>
                                            {filteredScreens.map(screen => (
                                                <div
                                                    key={screen.id}
                                                    className="import-popup__screen-item"
                                                    onClick={() => handleScreenClick(screen.id, screen.name)}
                                                >
                                                    <span className="screen-dot" style={{ backgroundColor: screen.color || "#10b981" }}></span>
                                                    <span className="screen-name">{screen.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null;
                                })
                            )}
                        </div>
                    </div>
                </Menu>
            </div>
        );
    }

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
                <MenuItem onClick={handleSelectiveImportClick} className="import-menu__item">
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
