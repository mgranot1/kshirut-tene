import { Autocomplete, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import useGetCategories from "../../services/category/useGetCategories";
import { ICategory } from "../../types/category.types";
import { IScreen } from "../../types/screen.types";
import { FormFields } from "../ComponentSetting/ComponentFilterSetting";
import style from "./ScreenSetting.style";
import "./ScreenSettingContent.scss";

interface IScreenSettingProps {
  screen: IScreen;
  setScreen: Dispatch<SetStateAction<IScreen>>;
}
type ScreenSetting = {
  name: string;
  category: string;
  color: string;
};

const ScreenSettingContent = ({ screen, setScreen }: IScreenSettingProps) => {
  const { data: allCategories } = useGetCategories();

  const formFields: FormFields<ScreenSetting>[] = [
    {
      key: "name",
      title: "שם המסך",
      required: true,
      content: (
        <input
          className="screenSettingContent__input"
          value={screen.name}
          onChange={(e) =>
            setScreen((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="הכנס שם"
          maxLength={100}
          required={true}
          type="text"
        />
      ),
    },
    {
      key: "category",
      title: "קטגוריה",
      required: true,
      content: (
        <Autocomplete
          renderInput={(params) => (
            <TextField
              className="screenSettingContent__autoComplete"
              required
              sx={style.input}
              placeholder="הכנס קטגוריה"
              {...params}
              inputProps={{ ...params?.inputProps, maxLength: 100 }}
            />
          )}
          freeSolo
          options={allCategories ?? []}
          value={
            { id: screen.categoryId, name: screen.categoryName } as ICategory
          }
          filterSelectedOptions
          getOptionLabel={(option: ICategory | string) => {
            return (option as ICategory).name || "";
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            handleCategory(e.target.value);
          }}
        />
      ),
    },
    {
      key: "color",
      title: "צבע",
      required: false,
      content: (
        <div className="screenSettingContent__color-box">
          <div className="screenSettingContent__color-text">{`${screen.color.toLocaleUpperCase()}`}</div>
          <input
            type="color"
            value={screen.color}
            onChange={(e) =>
              setScreen((prev) => ({ ...prev, color: e.target.value }))
            }
          />
        </div>
      ),
    },
  ];

  const handleCategory = (name: string) => {    
    const currentCategory = allCategories?.find(
      (i) => i.name === name.replace(/^[\s\n\r]+|[\s\n\r]+$/g, "")
    ) || { id: "", name };

    setScreen((prev) => ({
      ...prev,
      categoryName: name,
      categoryId: currentCategory.id,
    }));
  };

  return (
    <div className="screenSettingContent">
      {formFields.map((field) => (
        <div key={field.key} className="screenSettingContent__row">
          <div>
            <span>{field.title}</span>
            {field.required && (
              <span className="screenSettingContent__required"> * </span>
            )}
          </div>
          {field.content}
        </div>
      ))}
    </div>
  );
};

export default ScreenSettingContent;
