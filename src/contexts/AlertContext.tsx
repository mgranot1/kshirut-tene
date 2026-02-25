import { ButtonProps } from "@mui/material";
import { createContext, useContext, useMemo, useState } from "react";
import MessageDialog from "../shared/components/MessageDialog/MessageDialog";

export type MessageType = "Success" | "Error" | "Info" | "Unknown";
export type ButtonsDirection = "Vertical" | "Horizontal";

export type APIFunctionalityError = {
  code?: number;
  message: string;
  desc?: string | string[];
};

export interface IMessage {
  messageType: MessageType;
  msgContent: APIFunctionalityError;
}

export enum ButtonStyle {
  Bold = "primary",
  Thin = "secondary",
  UnderlinedText = "underlined",
}

export interface ICloseButton {
  disableCloseButton?: boolean;
  clickOutsideClose?: boolean;
}

export type ButtonAction = {
  text: string;
} & ButtonProps;

export interface IAlertify extends IMessage {
  buttons?: ButtonAction[];
  img?: JSX.Element;
  buttonsDirection?: ButtonsDirection;
  closeButton?: ICloseButton;
}

interface IAlertContext {
  alertify: (message: IAlertify) => void;
  clear: () => void;
}

const AlertContext = createContext({} as IAlertContext);

const AlertProvider = ({ children }: any) => {
  const [message, setMessage] = useState<IMessage>();
  const [closeButton, setCloseButton] = useState<ICloseButton>();
  const [buttons, setButtons] = useState<ButtonAction[]>();
  const [image, setImage] = useState<JSX.Element>();
  const [buttonsDirection, setButtonsDirection] =
    useState<ButtonsDirection>("Horizontal");

  const providerValue = useMemo(
    () => ({
      alertify: ({
        buttons,
        img,
        buttonsDirection,
        closeButton,
        ...msgContent
      }: IAlertify) => {
        setMessage(msgContent);
        setButtons(buttons);
        setImage(img);
        setCloseButton(closeButton);
        setButtonsDirection(buttonsDirection || "Horizontal");
      },
      clear: () => {
        setMessage(undefined);
        setButtons(undefined);
        setImage(undefined);
        setCloseButton(undefined);
        setButtonsDirection("Horizontal");
      },
    }),
    []
  );

  return (
    <AlertContext.Provider value={providerValue}>
      {
        <MessageDialog
          message={message}
          buttons={buttons}
          image={image}
          buttonsDirection={buttonsDirection}
          clickOutsideClose={closeButton?.clickOutsideClose}
          disableCloseButton={closeButton?.disableCloseButton}
          clearMessage={() => {
            providerValue.clear();
          }}
        />
      }
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertify = () => useContext(AlertContext);
export default AlertProvider;
