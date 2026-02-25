import Trash from "@assets/dashboard/trash.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { IOption, isIOption } from "../../../shared/types/general.types";
import "./FeatureRow.scss";

export interface IFeatureRow {
  index: number;
  currFeature: IOption;
  featureOptions: IOption[];
  currValue: IOption | string;
  options: IOption[] | null;
  onFeatureDelete: (index: number) => void;
  onFeatureSelect?: (newFeature: IOption) => void;
  onFeatureValueSelect?: (newValue: IOption) => void;
  onFeatureFreeTextValueType?: (feature: string,currValue: string) => void;
  textFieldProps?: Omit<TextFieldProps, 'variant'>;
}

const FeatureRow = ({
  index,
  currFeature,
  featureOptions,
  currValue,
  options,
  onFeatureDelete,
  onFeatureSelect,
  onFeatureValueSelect,
  onFeatureFreeTextValueType,
  textFieldProps = {}
}: IFeatureRow) => {
  return (
    <div className="feature-row">
      <div className="feature-row__input">
        <Select
          className="feature-row__select"
          IconComponent={ExpandMoreIcon}
          onChange={(e) => {
            const selectedFeature: IOption = featureOptions.find(
              (feature) => feature.value === e.target.value
            ) ?? { label: "", value: "" };
            onFeatureSelect?.(selectedFeature);
          }}
          value={currFeature.value}
          displayEmpty
          renderValue={() => currFeature.label}
        >
          {featureOptions.map((option, i) => (
            <MenuItem key={i} value={option.value} sx={{ fontSize: "0.9rem" }}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {/* If We got anything in the options props, than we want to show an autocomplete */}
        {options && isIOption(currValue) ? <Autocomplete
          className="feature-row__value"
          options={options}
          disabled={currFeature.value === ""}
          value={currValue}
          onChange={(e, newValue) => {
            newValue && onFeatureValueSelect?.(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <ExpandMoreIcon />
                  </InputAdornment>
                ),
              }}
              {...(textFieldProps)}
            />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={option.value}
              sx={{ fontSize: "0.9rem", height: "2rem" }}
            >
              {option.label}
            </Box>
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        /> :
        // If no options were given than this is a free text field.
        <TextField className="feature-row__value" value={currValue} onChange={(e) => {
          onFeatureFreeTextValueType?.(currFeature.value, e.currentTarget.value);
        } }  {...textFieldProps} />
         }
      </div>
      <img
        className="feature-row__icon"
        src={Trash}
        onClick={() => onFeatureDelete(index)}
      />
    </div>
  );
};

export default FeatureRow;
