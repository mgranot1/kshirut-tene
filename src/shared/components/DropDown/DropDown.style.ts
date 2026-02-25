import { SwipeableDrawer } from "@mui/material";
import { styled } from "@mui/system";

export const Drawer = styled(SwipeableDrawer)({
  "&.MuiPaper-root , .MuiDrawer-paper": {
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",

    "@media (min-width: 1430px)": {
      width: "60vw",
      height: "50vh",
      marginBottom: "5vh !important",
      marginLeft: "20vw",
      borderBottomLeftRadius: "30px",
      borderBottomRightRadius: "30px",
    },
  },
});
