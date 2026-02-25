import CheckBoxBlankIcon from "@mui/icons-material/CheckBoxOutlineBlankTwoTone";
import CheckBoxIcon from "@mui/icons-material/CheckBoxTwoTone";
import SearchIcon from "@mui/icons-material/SearchRounded";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { ReactNode, useEffect, useState } from "react";
import { FieldType, IFilterField } from "../../types/filters.types";
import "./FilterOptions.scss";

interface IFilterOptionsProps<T> {
  field: IFilterField<T>;
  changeField: (
    fieldName: string,
    fieldOption: string,
    value: string | boolean | Date | number
  ) => void;
}

const MIN_LENGTH_FOR_SEARCH = 9;

function FilterOptions<T>(props: IFilterOptionsProps<T>) {
  const [searchedVal, setSearchedVal] = useState<string>("");
  const [freeText, setFreeText] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    props.field.fieldType === FieldType.DatePicker &&
      props.field.options.length > 0
      ? (props.field.options.find((opt) => opt.isSelected)
          ?.optionValue as Date) ?? null
      : null
  );

  useEffect(() => {
    if (selectedDate !== null) {
      props.changeField(
        props.field.fieldTitle,
        new Date(selectedDate).toLocaleDateString("en-gb", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        new Date(selectedDate)
      );
    }
  }, [selectedDate]);

  const onSearchInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchedVal(event.currentTarget.value);
  };

  const onFreeTextInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFreeText(event.currentTarget.value);
  };

  const saveFreeText = () => {
    props.changeField(props.field.fieldTitle, freeText, freeText);
    setFreeText("");
  };

  const renderOptions: () => ReactNode = () => {
    switch (props.field.fieldType) {
      case FieldType.Checkbox:
        return (
          <>
            {props.field.options.length > MIN_LENGTH_FOR_SEARCH && (
              <div className="FilterOptions__searchLine">
                <SearchIcon className="FilterOptions__searchLineIcon" />
                <input
                  type="text"
                  className="FilterOptions__field FilterOptions__searchLineField"
                  placeholder={`חיפוש ${props.field.fieldTitle}...`}
                  value={searchedVal}
                  onChange={onSearchInputChange}
                  autoComplete="off"
                  inputMode="text"
                />
              </div>
            )}
            {props.field.options
              .filter(
                (o) => searchedVal === "" || o.optionTitle.includes(searchedVal)
              )
              .map((opt, i) => (
                <div
                  className="FilterOptions__line"
                  key={i}
                  onClick={() =>
                    props.changeField(
                      props.field.fieldTitle,
                      opt.optionTitle,
                      opt.optionValue
                    )
                  }
                >
                  <div className="FilterOptions__checkbox">
                    {opt.isSelected ? (
                      <CheckBoxIcon className="FilterOptions__checkbox-selected" />
                    ) : (
                      <CheckBoxBlankIcon className="FilterOptions__checkbox-notSelected" />
                    )}
                  </div>
                  <div
                    className={`FilterOptions__optionText ${
                      opt.isSelected ? "FilterOptions__optionText-bold" : ""
                    }`}
                  >
                    {opt.optionTitle}
                  </div>
                </div>
              ))}
          </>
        );

      case FieldType.TextField:
        return (
          <input
            type="text"
            className=" FilterOptions__field FilterOptions__textField"
            placeholder={`הכנס ${props.field.fieldTitle}...`}
            value={freeText}
            onChange={onFreeTextInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveFreeText();
            }}
            autoComplete="off"
          />
        );

      case FieldType.DatePicker:
        return (
          // <div></div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              // PaperProps={{ sx: classes.date }}
              value={dayjs(selectedDate)}
              // showToolbar={false}
              // componentsProps={{ actionBar: { actions: [] } }}
              // inputFormat="DD.MM.YYYY"
              onChange={(date) => {
                setSelectedDate(date?.toDate() ?? null);
              }}
              // renderInput={(params) => (
              // 	<TextField
              // 		// sx={classes.rootDate}
              // 		InputLabelProps={{ shrink: true }}
              // 		autoComplete="off"
              // 		{...params}
              // 	/>
              // )}
              // label={['מתאריך']}

              // {...props.field.dateOptions}
            />
          </LocalizationProvider>
        );

      default:
        break;
    }
  };

  return (
    <div className="FilterOptions">
      <hr />
      {renderOptions()}
      <hr />
    </div>
  );
}

export default FilterOptions;
