import { Switch } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import toggleStyles from "./IosSwitch.styles";
import "./Toggle.scss";

interface IToggleProps {
  text?: string;
  name: string;
  control: Control<any>;
  readOnly?: boolean;
}

const Toggle = (props: IToggleProps) => {
  return (
    <div className="toggle">
      {props.text && <p>{props.text}</p>}
      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { onChange, value, onBlur } }) => (
          <Switch
            sx={toggleStyles.toggle}
            checked={value ? true : false}
            onChange={(e) => {
              onBlur();
              onChange(e);
            }}
            disabled={props.readOnly}
          />
        )}
      />
    </div>
  );
};

export default Toggle;
