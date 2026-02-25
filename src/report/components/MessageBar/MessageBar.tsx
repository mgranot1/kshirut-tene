import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { IconButton, TextareaAutosize } from "@mui/material";
import { useState } from "react";
import "./MessageBar.scss";

interface IMessagesBarProps {
  setMessage: (text: string) => void;
  disable?: boolean;
}

const MessageBar = ({ setMessage, disable }: IMessagesBarProps) => {
  const [text, setText] = useState<string>("");

  const addNewComment = () => {
    setText("");
    setMessage(text);
  };

  const checkText = (textValue) => {
    const messageRegex = /[^א-תa-zA-Z0-9_\" .'*(),-]/g;
    textValue = textValue.replace(messageRegex, "");
    setText(textValue);
  };

  return (
    <div className="messageBar">
      <TextareaAutosize
        disabled={disable}
        className="messageBar__input"
        value={text}
        placeholder="הקלד כאן"
        maxLength={240}
        onChange={(e) => checkText(e.target.value)}
      />
      <IconButton
        className="messageBar__enter"
        disabled={disable || text === ""}
        onClick={() => {
          addNewComment();
        }}
      >
        <ArrowCircleUpIcon color={disable ? "disabled" : "primary"} />
      </IconButton>
    </div>
  );
};

export default MessageBar;
