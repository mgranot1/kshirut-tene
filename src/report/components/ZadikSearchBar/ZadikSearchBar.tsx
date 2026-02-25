import FiltersIcon from "@assets/report/filters.svg";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import { isNoFilter } from "../../utils/filterZadiks.util";
import AutoCompleteZadiks from "../AutoCompleteZadiks/AutoCompleteZadiks";
import { IFilters } from "../FilterSheet/FilterSheet";
import "./ZadikSearchBar.scss";

type Props = {
  zadikData: IZadikData[] | undefined;
  selectedFilters: IFilters | undefined;
  onFilterButtonClick: () => void;
};

function ZadikSearchBar(props: Props) {
  return (
    <div className="ZadikSearchBar">
      {props.zadikData && <AutoCompleteZadiks />}
      <button
        className={`ZadikSearchBar__filter-button${props.selectedFilters &&  isNoFilter(props.selectedFilters) ? "" : "--on"}`}
        onClick={props.onFilterButtonClick}
      >
        <img className="ZadikSearchBar--icon" src={FiltersIcon} />
      </button>
    </div>
  );
}

export default ZadikSearchBar;
