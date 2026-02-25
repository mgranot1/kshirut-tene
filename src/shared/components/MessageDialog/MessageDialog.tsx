import { ReactComponent as ErrorLogo } from "@assets/report/errorIcon.svg";
import { ReactComponent as InfoLogo } from "@assets/report/infoIcon.svg";
import { ReactComponent as SuccessLogo } from "@assets/report/success.svg";
import XMarkIcon from "@assets/report/xMark.svg";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import {
  ButtonAction,
  ButtonsDirection,
  IMessage,
  MessageType,
} from "../../../contexts/AlertContext";
import "./MessageDialog.scss";

interface IMessageDialogProps {
  message?: IMessage;
  buttons?: ButtonAction[];
  image?: JSX.Element;
  disableCloseButton?: boolean;
  clickOutsideClose?: boolean;
  buttonsDirection: ButtonsDirection;
  clearMessage: () => void;
}

const logoByType: { [key in MessageType]: JSX.Element } = {
  Error: <ErrorLogo />,
  Info: <InfoLogo />,
  Success: <SuccessLogo />,
  Unknown: <></>,
};

const DEFAULT_MSG_TYPE = "Info";

const isButtonSupplied = (buttons?: ButtonAction[]) =>
  buttons && Array.isArray(buttons) && buttons.length > 0;

const MessageDialog = (props: IMessageDialogProps) => {
  return !!props.message ? (
    <Dialog
      open={!!props.message}
      onClose={(event, reason) => {
        if (!(props.clickOutsideClose && reason === "backdropClick")) {
          !isButtonSupplied(props.buttons) ? props.clearMessage : () => {};
        }
      }}
      classes={{
        paper: "messageDialog",
      }}
      disableEscapeKeyDown
    >
      {!props.disableCloseButton && (
        <div className="close-icon">
          <IconButton
            aria-label="close"
            onClick={(e) => {
              e.stopPropagation();
              props.clearMessage();
            }}
          >
            <img src={XMarkIcon} />
          </IconButton>
        </div>
      )}
      <DialogTitle className="messageDialog__title">
        <div className="messageDialog__title--icon">
          {props.image ??
            logoByType[props.message?.messageType || DEFAULT_MSG_TYPE]}
        </div>
      </DialogTitle>
      <DialogContent
        className="messageDialog__content"
        sx={{ paddingBottom: "0" }}
      >
        <DialogContentText className="messageDialog__content--msg">
          {props.message?.msgContent.message}
        </DialogContentText>
        {props.message?.msgContent?.desc &&
          (typeof props.message?.msgContent?.desc === "string"
            ? props.message?.msgContent?.desc
            : props.message?.msgContent?.desc.map((desc) => (
                <span className="messageDialog__content--desc">{desc}</span>
              )))}
      </DialogContent>
      {props.buttons && (
        <DialogActions
          className="messageDialog__actions"
          sx={{ width: "100%", justifyContent: "space-around" }}
        >
          {isButtonSupplied(props.buttons) &&
            props.buttons?.map(({ text, style, ...buttonProps }, i) => (
              <Button
                key={i}
                className="messageDialog__actions--btn"
                {...buttonProps}
                onClick={(e) => {
                  buttonProps.onClick?.(e);
                  props.clearMessage();
                }}
              >
                {text}
              </Button>
            ))}
        </DialogActions>
      )}
    </Dialog>
  ) : (
    <></>
  );
};

export default MessageDialog;
