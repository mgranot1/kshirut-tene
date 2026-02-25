import { ListItem } from "@mui/material";
import PercentGraph from "../../../shared/components/PercentGraph/PercentGraph";
import { calcPercent } from "../../../shared/utils/percentage.util";
import "./FamilyKshirutCard.scss";

interface IFamilyKshirutCardProps {
  name: string;
  totalAmount: number;
  kshirimAmount: number;
}

const FamilyKshirutCard = (props: IFamilyKshirutCardProps) => {
  const percent = calcPercent(props.kshirimAmount, props.totalAmount);

  return (
    <ListItem className="FamilyKshirutCard">
      <div className="FamilyKshirutCard__data">
        <p className="FamilyKshirutCard__name">{props.name}</p>
        <div className="FamilyKshirutCard__amount">
          <div>
            <p>{props.totalAmount}</p>
          </div>
          /
          <span>
            <b>{props.kshirimAmount}</b> כשירים
          </span>
        </div>
      </div>
      <div className="FamilyKshirutCard__graph">
        <div className="FamilyKshirutCard__graphBox">
          <PercentGraph percent={percent} amountAll={props.totalAmount} amountNotKashir={props.totalAmount - props.kshirimAmount} />
        </div>
        <p
          className={
            "FamilyKshirutCard__percent " +
            `${props.totalAmount > 0 && percent === 0 ? "FamilyKshirutCard__percent--red" : ""}`
          }
        >
          {percent}%
        </p>
      </div>
    </ListItem>
  );
};

export default FamilyKshirutCard;
