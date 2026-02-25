import { calcKshirutPercent } from "../../../shared/utils/kshirut.utils";
import { getGraphColor } from "../../../shared/utils/kshirutPercentColor";
import { KshirutAmount } from "../../types/topview.types";
import PercentageGraphPie from "../BarGraph/PercentageGraphPie";
import "./KshirutPercentage.scss";

interface IKshirutPercentageProps {
  kshirutAmount: KshirutAmount;
  isPieVisible: boolean;
  isOverallCard?: boolean;
}

const KshirutPercentage = ({ kshirutAmount, isPieVisible, isOverallCard }: IKshirutPercentageProps) => {
  const percent = calcKshirutPercent(
    kshirutAmount.totalEquipmentsCount,
    kshirutAmount.totalEquipmentsCount - kshirutAmount.kashirEquipmentsCount
  );
  const notKashirAmount = kshirutAmount.totalEquipmentsCount - kshirutAmount.kashirEquipmentsCount
  const textPercatageStyle =  () => {
    let color: string;
    let transform: string;
  
    if (isPieVisible) {
      color = isOverallCard ? 'white' : 'black';
      transform = 'translateY(-1.1rem)';
    } else {
      if (isOverallCard) {
        color =
          kshirutAmount.totalEquipmentsCount === 0
            ? 'white'
            : getGraphColor(kshirutAmount.totalEquipmentsCount, notKashirAmount);
      } else {
        color = getGraphColor(kshirutAmount.totalEquipmentsCount, notKashirAmount);
      }
      transform = 'translateY(-0.7rem)';
    }
  
    return { color, transform };
  };

  return (
    <div className="kshirut-percentage">
      <div className="kshirut-percentage__graph">
        {isPieVisible && <PercentageGraphPie amountAll={kshirutAmount.totalEquipmentsCount}
          amountNotKashir={notKashirAmount} />}
        <span
          style={textPercatageStyle()}
          className="kshirut-percentage__graph--percent"
        >
          {percent}%
        </span>
      </div>
      <div className="kshirut-percentage__data">
        <span className="kshirut-percentage__amount"
          style={{ color: isOverallCard ? 'white' : 'black', marginBottom: isPieVisible ? '0' : '1rem' }}
        >
          {kshirutAmount.kashirEquipmentsCount}/{kshirutAmount.totalEquipmentsCount}
        </span>
      </div>
    </div>
  );
};

export default KshirutPercentage;
