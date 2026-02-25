import React from "react";
import { useUserUnit } from "../../hooks/useUserUnit";
import { IComment } from "../../types/comment.types";
import CommentBubble from "../CommentBubble/CommentBubble";
import "./Comments.scss";

export const dateFormat = (date: Date) => {
  return date
    .toLocaleDateString("he-IL", {
      weekday: "long",
      year: "numeric",
      day: "numeric",
      month: "short",
    })
    .replace("יום ", "")
    .replace(",", "");
};

interface ICommentsProps {
  date: Date;
  comments: IComment[];
  refScroll: React.MutableRefObject<HTMLDivElement | null>;
}

const Comments = ({ date, comments, refScroll }: ICommentsProps) => {
  const [userUnit] = useUserUnit();

  const isLast = (currentIndex: number) => {
    return (
      currentIndex === comments.length - 1 ||
      comments[currentIndex + 1].username !== comments[currentIndex].username
    );
  };

  return (
    <div className="comments">
      <div className="comments__date">{dateFormat(date)}</div>
      {comments.length > 0 &&
        comments.map((comment, index) => {
          return (
            <React.Fragment key={index}>
              <div
                key={comment.commentNum}
                className={`comments__container ${
                  comment.username === userUnit.username
                    ? "right-bubble"
                    : "left-bubble"
                }`}
              >
                <div className="comments__content">
                  {(index === 0 ||
                    comments[index - 1].username !== comment.username) && (
                    <div className="comments__name">
                      {comment.username !== userUnit.username &&
                        (comment.fullName ?? comment.username)}
                    </div>
                  )}
                  <CommentBubble
                    comment={comment}
                    position={isLast(index) ? "last" : ""}
                  />
                </div>
                {/* {comment.username !== userUnit.username && (
							<Avatar className="comments__avatar"></Avatar>
						)} */}
              </div>
            </React.Fragment>
          );
        })}
      <div ref={refScroll} style={{ height: "1px" }}></div>
    </div>
  );
};

export default Comments;
