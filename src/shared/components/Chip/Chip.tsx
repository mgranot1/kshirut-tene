import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { Tooltip } from "@mui/material";
import { forwardRef, Ref } from "react";
import "./Chip.scss";

export type TagProps = {
  text: string;
  action: "delete" | "add";
  onAction: () => void;
  filterOptions?: {
    boldedText: string;
    isNotEqual?: boolean;
  };
  disableTooltip?: boolean;
};

const Chip = forwardRef((props: TagProps, ref: Ref<HTMLDivElement>) => {
  const regularText = `${props.text}${props.filterOptions ? ":" : ""}`;

  const filterValueText = props.filterOptions
    ? `${props.filterOptions.boldedText} ${props.filterOptions.isNotEqual ? "≠" : ""} `
    : undefined;

  const relevantIcon =
    props.action === "delete" ? (
      <ClearIcon className="FilterChip__action-icon" />
    ) : props.action === "add" ? (
      <AddIcon className="FilterChip__action-icon" />
    ) : null;

  return (
    <Tooltip
      title={props.filterOptions?.boldedText || props.text}
      disableHoverListener={props.disableTooltip}
    >
      <div className="FilterChip" ref={ref}>
        <div className="FilterChip__text">
          <div className="FilterChip__headerText">{regularText}</div>
          {filterValueText && (
            <div className="FilterChip__valueText">{filterValueText}</div>
          )}
        </div>
        <hr />
        <div className="FilterChip__action-button" onClick={props.onAction}>
          {relevantIcon}
        </div>
      </div>
    </Tooltip>
  );
});

export default Chip;
