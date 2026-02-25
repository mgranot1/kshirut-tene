import { useEffect, useMemo, useState } from "react";
import { useNavigate, Location, NavigateOptions } from "react-router-dom";
import { SitePaths } from "../../../router/routes";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import { useGetZadikData } from "../../services/zadikData/useGetZadikData";
import { useGetZadiksData } from "../../services/zadikData/useGetZadiksData";
import { LocationState as KshirutLocationState } from "../../pages/KshirutReport/KshirutReport";
import "./AutoCompleteZadiks.scss";
import { LocationState } from "../../pages/ReportFault/ReportFault";

interface IAutoCompleteZadiksProps {}

const AutoCompleteZadiks = ({}: IAutoCompleteZadiksProps) => {
  const navigate = useNavigate();
  const { data: zadiksData } = useGetZadiksData();

  const [searchItems, setSearchItems] = useState<IZadikData[]>(
    zadiksData ?? []
  );

  const itemsCount = useMemo<number>(() => searchItems.length, [searchItems]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const onSuccessGetZadikData = (zadikData: IZadikData) => {
    navigate(`../${SitePaths.KSHIRUT_REPORT}/${zadikData.equipment}`, {state: { backButtonState: { path: -1 } }});
  };

  const { mutate: mutateGetZadikData } = useGetZadikData({
    onSuccess: onSuccessGetZadikData,
  });

  useEffect(() => {
    const scrollableElement = document.getElementById("page");
    const handleScroll = () => {
      setShowDropdown(false);
    };

    if (!scrollableElement) return;

    scrollableElement.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    document.addEventListener("click", handleScroll);
    return () => {
      scrollableElement.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleScroll);
    };
  }, []);

  const handleSelect = (e) => {
    mutateGetZadikData({ equipment: e.target.value });
  };

  const handleChange = (searchValue: string) => {
    if (searchValue.length >= 3) {
      setShowDropdown(true);
      const searchResult =
        zadiksData?.filter((z) =>
          z.equipment.toString().includes(searchValue)
        ) ?? [];
      setSearchItems(searchResult);
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search"
        value={searchValue}
        onChange={(e) => {
          /^\d{0,6}$/.test(e.target.value) && setSearchValue(e.target.value);
          handleChange(e.target.value);
        }}
        placeholder="חיפוש כלי..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSelect(e);
          }
        }}
      />
      {showDropdown && (
        <ul className="eq-list">
          <p>{`${itemsCount} תוצאות`}</p>
          {searchItems?.map((z) => (
            <li
              key={z.equipment}
              value={z.equipment}
              onClick={(e) => {
                handleSelect(e);
              }}
            >
              {z.equipment}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteZadiks;
