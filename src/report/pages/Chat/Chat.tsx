import BackIcon from "@assets/report/backIcon.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SitePaths } from "../../../router/routes";
import useSessionStorage from "../../../shared/hooks/useSessionStorage";
import { FaultStatus } from "../../../shared/types/params.types";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import {
  FAULT_DATA_SESSION_KEY,
  ZADIK_DATA_SESSION_KEY,
} from "../../../shared/utils/constants";
import Comments from "../../components/Comments/Comments";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import MessageBar from "../../components/MessageBar/MessageBar";
import { useCreateChat } from "../../services/chat/useCreateChat";
import { useGetChatByFault } from "../../services/chat/useGetChatByFault";
import { useGetFaultData } from "../../services/fault/useGetFaultData";
import { IComment } from "../../types/comment.types";
import { FaultStorage } from "../ReportFault/ReportFault";

export const getMillisecondsFromStartOfDay = () => {
  let currentDate = new Date();
  let startOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  return currentDate.getTime() - startOfDay.getTime();
};

export type CommentsByDate = {
  [date: string]: IComment[];
};


type PageParams = Record<'faultId',string>

const Chat = () => {
  const [commentsByDate, setCommentsByDate] = useState<CommentsByDate>(
    {} as CommentsByDate
  );
  const [smoothScrolling, setSmoothScrolling] = useState<boolean>(false);
  const ref = useRef<null | HTMLDivElement>(null);
  const navigate = useNavigate();
  const {faultId} = useParams<PageParams>()

  const scrollDown = () => {
    ref.current?.scrollIntoView({
      behavior: smoothScrolling ? "smooth" : undefined,
    });
  };

  const onSuccessCreateChat = (comment: IComment) => {
    const prevComments =
      commentsByDate[comment.creationTimestamp.toDateString()];
    prevComments && prevComments.push(comment);

    setCommentsByDate((prev) => ({
      ...prev,
      [comment.creationTimestamp.toDateString()]: prevComments ?? [comment],
    }));

    setSmoothScrolling(true);
  };
  const { mutate: mutateCreateChat } = useCreateChat({
    onSuccess: onSuccessCreateChat,
  });

  const { data: faultData } = useGetFaultData(faultId!)

  const addNewComment = (faultNum: string, text: string) => {
    if (!text || text.trim() === "") return;
    const newComment = {
      faultNum: faultNum,
      commentText: text,
      creationTimestamp: new Date(),
    } as IComment;
    mutateCreateChat({ comment: newComment });
  };

  const { data: chatData, isSuccess } = useGetChatByFault(
   faultId! 
  );
  useEffect(() => {

    if (chatData && isSuccess) {
      const groupedComments = {} as CommentsByDate;

      chatData.forEach((comment) => {
        groupedComments[comment.creationTimestamp.toDateString()] =
          groupedComments[comment.creationTimestamp.toDateString()] || [];
        groupedComments[comment.creationTimestamp.toDateString()].push(comment);
      });
      setCommentsByDate(groupedComments);
      setSmoothScrolling(false);
    }
  }, [chatData]);

  useEffect(() => {
    scrollDown();
  }, [commentsByDate]);

  return (
    <PageLayout
      title={`תקלה ${faultData?.faultNum}`}
      subTitle={`צ' ${faultData?.equipment}`}
      backButton={{
        button: <img className="headerButton" src={BackIcon} />,
        function: () => navigate(-1),
      }}
      footerElement={
        <MessageBar
          setMessage={(message) => faultData && addNewComment(faultData.faultNum,message)}
          disable={faultData?.faultStatus === FaultStatus.Done}
        />
      }
    >
      {Object.keys(commentsByDate).map((date) => (
        <Comments
          key={date}
          date={new Date(date)}
          comments={commentsByDate[date]}
          refScroll={ref}
        />
      ))}
    </PageLayout>
  );
};

export default Chat;
