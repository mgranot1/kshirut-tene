import { Box, CircularProgress } from "@mui/material";
import { getGraphColor } from "../../../shared/utils/kshirutPercentColor";
import "./PercentageGraphPie.scss";
import { calcKshirutPercent } from "../../../shared/utils/kshirut.utils";

interface IPercentageGraphPieProps {
  amountAll: number,
  amountNotKashir: number,
}
const PercentageGraphPie = ({ amountAll,amountNotKashir }: IPercentageGraphPieProps) => {
      const percent = calcKshirutPercent(
        amountAll,
        amountNotKashir
      );
  return (
    <div className="pie">
      <div style={{ position: "absolute" }}>
        <CircularProgress
          variant="determinate"
          thickness={4}
          sx={{ color: "#d1d9e4" }}
          size={"4rem"}
          value={100 / 2}
          style={{ position: "relative", transform: "rotate(180deg)" }}
        />

        <Box position="absolute" top={0}>
          <CircularProgress
            variant="determinate"
            sx={{
              // ' .MuiCircularProgress-circle': {
              //     strokeLinecap: 'round',
              // },
              color: getGraphColor(amountAll,amountNotKashir),
            }}
            thickness={4}
            size={"4rem"}
            value={percent / 2}
            style={{ position: "relative", transform: "rotate(180deg)" }}
          />
        </Box>
      </div>
    </div>
  );
};

export default PercentageGraphPie;
