import { convertDateToTimeDisplay } from "../../../shared/utils/dates.utils";
import { useUserUnit } from "../../hooks/useUserUnit";
import { IComment } from "../../types/comment.types";
import "./CommentBubble.scss";

interface ICommentBubbleProps {
  comment: IComment;
  position: "last" | "first" | "center" | "";
}

const CommentBubble = ({ comment, position }: ICommentBubbleProps) => {
  const [userUnit] = useUserUnit();

  return (
    <div
      className={`commentBubble ${position} ${
        comment.username === userUnit.username ? "right-bubble" : "left-bubble"
      }`}
    >
      <span className="comments__text">{comment.commentText}</span>
      <div className="comments__time">{` ${convertDateToTimeDisplay(
        comment.creationTimestamp
      )}`}</div>
    </div>
  );
};

export default CommentBubble;
