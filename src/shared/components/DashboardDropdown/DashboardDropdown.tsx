import ArrowIconCurrent from "@assets/dashboard/down-arrow-black.svg";
import ArrowIconNext from "@assets/dashboard/down-arrow-gray.svg";
import CheckBoxBlankIcon from "@mui/icons-material/CheckBoxOutlineBlankTwoTone";
import CheckBoxIcon from "@mui/icons-material/CheckBoxTwoTone";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Paper, Tooltip } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { PaperProps } from "@mui/material/Paper";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import React, { useMemo, useState } from "react";
import { IOption } from "../../types/general.types";
import "./DashboardDropdown.scss";

export type DropdownStyle =
  | "underline"
  | "currentExpandMore"
  | "expandMore"
  | "border"
  | "border white"
  | "";

interface IDashboardDropdownProps {
  open?: boolean;
  onOuterClick?: (open: boolean) => void;
  onLabelClick?: (open: boolean) => void;
  style: DropdownStyle;
  placeholder: string;
  title?: string;
  values: IOption[];
  options: IOption[];
  autocomplete?: boolean;
  resettable?: boolean;
  onSelect: (newValue: IOption, index?: number) => void;
  textFieldProps?: TextFieldProps;
  searchContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  isMulti?: boolean;
}

const DashboardDropdown = ({
  style,
  values,
  placeholder,
  title = "",
  options,
  autocomplete = true,
  resettable = true,
  textFieldProps,
  searchContainerProps,
  onSelect,
  isMulti = false,
  open,
  onOuterClick,
  onLabelClick,
}: IDashboardDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onLabelClick?.(!open);
  };

  const handleSelect = (
    selectedValue: IOption,
    e: React.MouseEvent,
    isMulti: boolean = false,
    index?: number
  ) => {
    if (!isMulti) {
      onOuterClick?.(false);
      setAnchorEl(null);
    }
    e.stopPropagation();
    setSearchValue("");
    onSelect(selectedValue,index);
  };

  const ClickAwayComponent = useMemo(
    () =>
      React.forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
        return (
          <ClickAwayListener onClickAway={() => onOuterClick?.(false)}>
            <Paper ref={ref} component="div" {...props} />
          </ClickAwayListener>
        );
      }),
    []
  );  

  return (
    <div className="dashboard-dropdown">
      <div
        className={`dashboard-dropdown__container ${
          style === "border" || style === "border white" ? style : ""
        }`}
        onClick={handleClick}
        {...searchContainerProps}
      >
        <Tooltip
          ref={(el: HTMLDivElement) => setAnchorEl(el)}
          title={
            values.length > 1
              ? values.map((val) => (
                  <>
                    {val.label}
                    <br />
                  </>
                ))
              : null
          }
          placement="top"
          arrow
        >
          <label className={`dashboard-dropdown__label ${style}`}>
            {title ? title : placeholder}
          </label>
        </Tooltip>

        {style === "currentExpandMore" && (
          <img
            src={ArrowIconCurrent}
            style={{ transform: "scale(0.4)", cursor: "pointer" }}
          />
        )}
        {(style === "expandMore" || style === "border" || style === "border white") && (
          <img src={ArrowIconNext} style={{ transform: "scale(0.4)" }} />
        )}
      </div>

      {open && (
        <Menu
          className="dashboard-dropdown__menu"
          open
          slots={{
            paper: ClickAwayComponent,
          }}
          classes={{ paper: "dashboard-dropdown__menu--paper" }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          anchorEl={anchorEl}
        >
          {autocomplete && (
            <TextField
              {...textFieldProps}
              className="dashboard-dropdown__search"
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSearchValue(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              value={searchValue}
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchValue && (
                  <IconButton onClick={() => setSearchValue("")}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
          )}
          <div className="dashboard-dropdown__items">
            {resettable && (
              <MenuItem
                className="dashboard-dropdown__item"
                onClick={(e) => handleSelect({} as IOption, e, undefined)}
                sx={{ color: "#a39a9a" }}
              >
                {options.length === 0 ? "בטעינה..." : "נקה..."}
              </MenuItem>
            )}
            {options
              .filter((o) => o.label?.includes(searchValue))
              .map((option, i) => (
                <MenuItem
                  className="dashboard-dropdown__item"
                  key={i}
                  onClick={(e) => handleSelect(option, e, isMulti,i)}
                >
                  {isMulti && (
                    <div className="dashboard-dropdown__checkbox">
                      {values.find((val) => val.value === option.value) ? (
                        <CheckBoxIcon className="dashboard-dropdown__checkbox-selected" />
                      ) : (
                        <CheckBoxBlankIcon className="dashboard-dropdown__checkbox-notSelected" />
                      )}
                    </div>
                  )}

                  <span>{option.label}</span>
                </MenuItem>
              ))}
          </div>
        </Menu>
      )}
    </div>
  );
};

export default DashboardDropdown;
