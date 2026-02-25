import { SxProps, Theme } from "@mui/material";

const styles = {
  input: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      height: "2.25rem",

      alignItems: "center",
      "&.Mui-focused fieldset": {
        borderColor: "#b4b4b8",
      },
    },
  },
} satisfies SxProps<Theme>;

export default styles;
