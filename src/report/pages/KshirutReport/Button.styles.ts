import { SxProps, Theme } from "@mui/material";

const styles = {
  navigateButton: {
    backgroundColor: "#EBF3FF",
    width: "48%",
    height: "3.125rem",
    color: "#3D99FD",
    padding: "0.625rem 0.9375rem",
    borderRadius: "0.625rem",
    gap: "0.375rem",
    fontSize: "1rem",
    fontWeight: "500",
  },
  filled: {
    backgroundColor: "black",
    borderColor: "black",
    borderRadius: "0.5rem",
    fontWeight: "bold",
    color: "white",
    width: "10rem",
    height: "2rem",
    boxShadow: "-0.5px 2px 5px grey",
  },
  bottomAbsButton: {
    backgroundColor: "#OA84FF",
    width: "90%",
    height: "3.125rem",
    fontWeight: "700",
    fontSize: "1.125rem",
    borderRadius: "0.4375rem",
    position: "fixed",
    bottom: "0",
    left: "0",
  },
  toggleGroup: {
    width: "100%",

    justifyContent: "center",
    gap: "2.5rem",
    "&MuiToggleButtonGroup-root": {
      //  justifyItems
    },
  },
  buttonGroup: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    gap: "3rem",
  },
  toggle: {
    border: "0.1px solid #f0f0e2",
    borderRadius: "1rem",
    backgroundColor: "white",
    width: "8rem",
    height: "8rem",
    fontWeight: "700",
    "&.Mui-selected, &.Mui-selected:hover": {
      // bgcolor: '#7D7AFF',
      backgroundColor: "pink",
      color: "white",
    },
    "& :selected": {
      backgroundColor: "pink",
    },
  },
} satisfies SxProps<Theme>;

export default styles;
