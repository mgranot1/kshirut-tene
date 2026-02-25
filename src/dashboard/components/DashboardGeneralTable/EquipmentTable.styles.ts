import { SxProps, Theme } from "@mui/material";

const styles = {
  KingdomTable: {
    headCell: {
      backgroundColor: "#f3f5f4",
      // backgroundColor: '#EBEBED',
      border: "1.2px solid rgb(237, 240, 240)",
      // border: '0px 0 1px 1px solid #EBEBED',
      // color: '#3e4f52',
      color: "#6E7591",
      fontWeight: "bold",
      "& .Mui-TableHeadCell-Content .Mui-TableHeadCell-Content-Labels": {
        justifyContent: "space-between",
        width: "inherit",
      },
      "*": {
        fontWeight: "500",
      },
    },
    bodyCell: {
      border: "1.2px solid rgb(237, 240, 240)",
      fontFamily: "inherit",
      "& .MuiButtonBase-root": {
        fontWeight: "inherit",
      },
    },
    displayColumn: {
      rowActions: {
        headCell: {
          backgroundColor: "#f3f5f4",
          border: "1.2px solid rgb(237, 240, 240)",
          fontWeight: "500",
          boxShadow: "none",
          color: "#6E7591",
        },
        bodyCell: {
          backgroundColor: "white",
          border: "1.2px solid rgb(237, 240, 240)",
          boxShadow: "none",
        },
      },
      rowSelect: {
        headCell: {
          zIndex: "2",
          boxShadow: "none",
          backgroundColor: "#f3f5f4",
          border: "1.2px solid rgb(237, 240, 240)",
          fontWeight: "500",
          "& .PrivateSwitchBase-input": {
            zIndex: 2,
          },
        },
        bodyCell: {
          zIndex: "2",
          boxShadow: "none",
          backgroundColor: "white",
          border: "1.2px solid rgb(237, 240, 240)",
          "& .PrivateSwitchBase-input": {
            zIndex: 2,
          },
        },
      },
    },
  },
} satisfies SxProps<Theme>;

export default styles;
