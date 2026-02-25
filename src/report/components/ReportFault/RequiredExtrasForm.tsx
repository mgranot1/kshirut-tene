import AddIcon from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { IOption } from "../../../shared/types/general.types";
import "../../styles/components/report/reportFault/RequiredExtrasForm.scss";
import { Extras, IExtras } from "../../types/fault.types";

export interface IField {
  name: string;
  label: string;
  type: "Autocomplete" | "Select" | "Quantity";
  disabled?: boolean;
  options?: IOption[];
  rules?: Record<string, any>;
  selectedOption?: IOption;
  setSelectedOption?: (option: IOption) => void;
}

export interface IRequiredFormProps {
  extrasData: IExtras[];
  setExtrasData: (extras: IExtras[]) => void;
  control: Control<any>;
}

export const extrasOptions: IOption[] = Object.keys(Extras).map((key) => {
  return { value: key, label: (Extras as any)[key] };
});

const RequiredExtrasForm = ({
  extrasData,
  setExtrasData,
  control,
}: IRequiredFormProps) => {
  const [extraTypeStringValue, setExtraTypeStringValue] = useState<string>("");
  const tempOptions: IOption[] = [{ value: "s", label: "a" }];

  const newRow = () => {
    let addExtras: IExtras[] = [...extrasData, {} as IExtras];
    setExtrasData(addExtras);
  };

  const removeRow = (i: number) => {
    let removedExtras: IExtras[] = [...extrasData];
    removedExtras.splice(i, 1);
    setExtrasData(removedExtras);
  };

  const setSelectedExtra = (extra: string, field: IExtras, index: number) => {
    const extraOption: IOption | undefined = extrasOptions.find(
      (eo) => eo.value === extra
    );
    const newExtrasData = [...extrasData];
    if (extraOption) {
      newExtrasData[index] = {
        extraType: extraOption,
        quantity: undefined,
        type: {} as IOption,
      } as IExtras;
    }
    setExtrasData(newExtrasData);
  };

  const setSelectedType = (type: string, field: IExtras, index: number) => {
    // const typeOption: IOption | undefined = field.options?.find(eo => eo.value === type)
    const typeOption: IOption | undefined = tempOptions?.find(
      (eo) => eo.value === type
    );
    const newExtrasData = [...extrasData];
    if (typeOption) {
      newExtrasData[index].type = typeOption;
      newExtrasData[index] = {
        ...newExtrasData[index],
        quantity: undefined,
        type: typeOption,
      } as IExtras;
    }
    setExtrasData(newExtrasData);
  };

  const setQuantity = (quan: string, field: IExtras, index: number) => {
    if (quan.length <= 2) {
      const newExtrasData = [...extrasData];
      newExtrasData[index].quantity = +quan;
      setExtrasData(newExtrasData);
    }
  };

  return (
    <form className="requiredExtrasForm">
      {extrasData.map((extrasField, i) => {
        return (
          <div
            className="requiredExtrasForm__field requiredExtrasForm__addedExtras"
            key={`${extrasField.extraType}${extrasField.type}${i}`}
          >
            <Remove
              onClick={() => removeRow(i)}
              className="requiredExtrasForm__removeButton"
            />
            <Controller
              key={"label"}
              name={"label"}
              control={control}
              disabled={false}
              render={({ field, fieldState: { error } }) => (
                <Select
                  error={!!error}
                  sx={{ width: "25vw", "& fieldset": { border: "none" } }}
                  variant="standard"
                  value={extrasField.extraType?.value}
                  onChange={(e) =>
                    setSelectedExtra(e.target.value as string, extrasField, i)
                  }
                >
                  {extrasOptions?.map((option) => (
                    <MenuItem key={option?.value} value={option?.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              key={"type"}
              name={"type"}
              control={control}
              disabled={!extrasField.extraType}
              render={({ field, fieldState: { error } }) =>
                extrasField.extraType?.label === Extras.part ? (
                  <Autocomplete
                    {...field}
                    style={{ width: "25vw" }}
                    // options={extrasField.options ? extrasField.options : []}
                    options={tempOptions ? tempOptions : []}
                    getOptionLabel={(option: IOption) => option.label}
                    // onChange={(e) => setSelectedType(e.target.value, extrasField, i)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        error={!!error}
                        helperText={error ? error.message : null}
                        value={extraTypeStringValue}
                        onChange={(e) =>
                          setSelectedType(e.target.value, extrasField, i)
                        }
                      />
                    )}
                  />
                ) : (
                  <Select
                    error={!!error}
                    sx={{ width: "25vw", "& fieldset": { border: "none" } }}
                    variant="standard"
                    disabled={!extrasField.extraType}
                    value={extrasField.type?.value}
                    onChange={(e) =>
                      setSelectedType(e.target.value as string, extrasField, i)
                    }
                  >
                    {
                      // extrasField.options?.map((option) => (
                      tempOptions.map((option) => (
                        <MenuItem key={option?.value} value={option?.value}>
                          {option.label}
                        </MenuItem>
                      ))
                    }
                  </Select>
                )
              }
            />

            <Controller
              key={"quan"}
              name={"quan"}
              control={control}
              disabled={!(extrasField.extraType && extrasField.type)}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  type="number"
                  disabled={!(extrasField.extraType && extrasField.type)}
                  inputProps={{ disableunderline: "true" }}
                  variant="standard"
                  sx={{
                    width: "25vw",
                    border: "none",
                    "& fieldset": { border: "none" },
                  }}
                  error={!!error}
                  helperText={error ? error.message : null}
                  value={extrasField.quantity}
                  onChange={(e) => setQuantity(e.target.value, extrasField, i)}
                ></TextField>
              )}
            />
          </div>
        );
      })}
      <div className="requiredExtrasForm__field" onClick={newRow}>
        <AddIcon className="requiredExtrasForm__addButton" />
        <span>הוסף אמצעי/ח"ח נדרשים</span>
      </div>
    </form>
  );
};

export default RequiredExtrasForm;
