import { SxProps, Theme } from "@mui/material";

const styles = {
  toggle: {
    alignItems: "center",
    width: "2.4em",
    padding: "0",
    "& .MuiSwitch-switchBase": {
      paddingLeft: "0.15em",
      "&.Mui-checked": {
        color: "white",
        transform: "translateX(16px)",
        "& + .MuiSwitch-track": {
          backgroundColor: "var(--general-blue-color)",
          opacity: "1",
        },
      },
    },
    "& .MuiSwitch-track": {
      height: "1.5em",
      opacity: "1",
      backgroundColor: "#E4E5E7",
      borderRadius: "40px",
    },
    "& .MuiSwitch-thumb": {
      WebkitBoxShadow: "0px 3px 2px -1px rgba(0,0,0,0.19)",
      boxShadow: "0px 3px 2px -1px rgba(0,0,0,0.19)",
    },
  },
} satisfies SxProps<Theme>;

export default styles;
