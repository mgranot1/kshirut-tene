import { Tooltip } from "@mui/material";

type TooltipWrapperProps = { title: string; text: string };

function TextTooltip(props: TooltipWrapperProps) {
  return (
    <Tooltip title={props.title} placement="bottom-start">
      <span> {props.text} </span>
    </Tooltip>
  );
}

export default TextTooltip;
