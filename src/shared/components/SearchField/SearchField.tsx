import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import React from "react";

type ISearchFieldProps = {
  searchValue: string;
  onType?: (str: string) => void;
  onClear?: () => void;
  onSearch?: () => void;
  expandOnFocus?: boolean;
};

type IProps = ISearchFieldProps & Omit<TextFieldProps, "variant">;

const SearchField: React.FC<IProps> = ({
  onType,
  onClear,
  onSearch,
  expandOnFocus,
  searchValue,
  ...props
}) => {
  const textFieldSX = {
    "& .MuiInputBase-root": {
      width: "clamp( 4.5vh , 10vw, 10em )",
      borderRadius: "10px",
      paddingLeft: "0.5em",
      paddingRight: "0.5em",
      height: "2.25rem",
      fontWeight: "500",
      fontFamily: "inherit",
      fontSize: "1rem",
      transition: "width 0.25s",
      letterSpacing: "0.01rem",
      backgroundColor: "white",
    },
  };

  if (expandOnFocus) {
    textFieldSX["& .Mui-focused"] = {
      width: "15vw",
    };
  }

  return (
    <TextField
      sx={textFieldSX}
      InputProps={{
        endAdornment: searchValue.length > 0 && (
          <InputAdornment position="end">
            <Tooltip title="נקה שורה">
              <CloseRoundedIcon onClick={onClear} />
            </Tooltip>
          </InputAdornment>
        ),
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon />
          </InputAdornment>
        ),
      }}
      value={searchValue}
      onChange={(event) => {
        onType?.(event.currentTarget.value);
      }}
      onKeyDown={(event) => {
        switch (event.key) {
          case "Enter":
            onSearch?.();
            break;
        }
      }}
      {...props}
    />
  );
};

export default SearchField;
