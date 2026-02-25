import React, { useEffect, useMemo, useRef, useState } from "react";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { SitePaths } from "../../../router/routes";
import useFormNav from "../../../shared/hooks/useFormNav";
import { TurnOptional } from "../../../shared/types/general.types";
import { MaterialTypes } from "../../../shared/types/mean.types";
import {
  CLOSED_FAULT_STATUSES,
  FaultStatus,
  TransportationType,
} from "../../../shared/types/params.types";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import CommentBubble from "../../components/CommentBubble/CommentBubble";
import { dateFormat } from "../../components/Comments/Comments";
import MessageBar from "../../components/MessageBar/MessageBar";
import ReportFaultForm from "../../components/ReportFault/ReportFaultForm";
import ReportFaultLayout from "../../components/ReportFault/ReportFaultLayout";
import useReportFaultAPICalls from "../../hooks/fault/useReportFaultAPICalls";
import useReportFaultFields from "../../hooks/fault/useReportFaultFields";
import { useUserUnit } from "../../hooks/useUserUnit";
import { useGetFaultData } from "../../services/fault/useGetFaultData";
import { useUpdateViewOnLoad } from "../../services/view/useUpdateView";
import { IComment } from "../../types/comment.types";
import { IFault } from "../../types/fault.types";
import { LogTypes } from "../../types/log.types";
import "./ReportFault.scss";

export interface IFaultDataForm {
  faultStatus: string;
  essence: string;
  expectedTime: string;
  grindType: string;
  availabilityInhibitor: string;
  contact: string;
  phoneNumber: string;
  mobileAbility: string;
  note: string;
  dereg: string;
  squad: string;
  reqSquad: string;
  phisicalLocation: string;
  phisicalLocationDesc: string;
  isWinchRequired: boolean;
}

export type FaultStorage = Pick<IFault, "faultNum" | "faultStatus">;

export type LocationState = {
  backButton?: { path: string };
};

export type props = {
  fault: TurnOptional<IFault, "faultNum">;
  zadikData: IZadikData;
};

const FaultForm: React.FC<props> = ({ fault, zadikData }) => {
  const [userUnit, _] = useUserUnit();

  const locationState: LocationState | undefined = useLocation().state;

  const errorRef = useRef<null | HTMLDivElement>(null);
  const [DBFaultStatus, setDBFaultStatus] = useState<FaultStatus>(
    FaultStatus.Opened
  );
  const [lastComment, setLastComment] = useState<IComment>();

  useUpdateViewOnLoad(LogTypes.Fault, fault.faultNum);

  const { refetch: refetchFault } = useGetFaultData(fault?.faultNum);
  const isNewFault = useMemo(() => !fault?.faultNum, [fault?.faultNum]);

  const {
    control,
    formState: { dirtyFields, isValid, defaultValues, isDirty },
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
  } = useForm<IFaultDataForm>({ shouldFocusError: true });

  useEffect(() => {
    if (fault?.faultNum) {
      setLastComment(
        fault.comments?.length > 0
          ? fault.comments[fault.comments?.length - 1]
          : undefined
      );

      setDBFaultStatus(fault.faultStatus as FaultStatus);
      reset({
        ...fault,
        isWinchRequired:
          fault.transportationType === TransportationType.WinchRequired,
      });
    } else {
      reset({
        faultStatus: FaultStatus.Opened,
        phisicalLocation: zadikData?.phisicalLocation,
        phisicalLocationDesc: zadikData?.phisicalLocationDesc,
        phoneNumber: "",
      } as IFaultDataForm);
    }
  }, [fault, reset]);

  const formData = watch();

  const faultClosedInDB = CLOSED_FAULT_STATUSES.includes(DBFaultStatus);
  const faultClosedInForm = CLOSED_FAULT_STATUSES.includes(
    formData.faultStatus as FaultStatus
  );

  const fieldsAreReadOnly: boolean = faultClosedInDB && faultClosedInForm;

  const afterSubmit = (resData: IFault) => {
    reset((prev) => prev);

    setDBFaultStatus(resData.faultStatus as FaultStatus);
    refetchFault();
  };

  const afterAddNewMessage = (comment: IComment) => {
    trigger();
    toast.success("נשמר בהצלחה");

    setLastComment(comment);
  };

  const { onSubmit, handleNewMessage } = useReportFaultAPICalls({
    dirtyFieldsLength: Object.keys(dirtyFields).length,
    afterSubmit,
    afterAddNewMessage,
    faultStatusFromDB: DBFaultStatus,
    selectedFault: fault,
    defaultStatus: defaultValues?.faultStatus || FaultStatus.Opened,
    setValue,
  });

  const onerror: SubmitErrorHandler<IFaultDataForm> = (error) => {
    if (Object.keys(error).length > 0)
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const {
    goBack: normalGoBack,
    goTo: normalGoTo,
    nav: rawNav,
  } = useFormNav({
    canSave: isValid,
    fieldsChanged: isDirty,
    onSave: handleSubmit(onSubmit, onerror),
    backOptions: {
      path: locationState?.backButton?.path
        ? locationState.backButton.path
        : undefined,
    },
  });

  const { topFields, statusFields, faultDataFields, goremMetapelFields } =
    useReportFaultFields({
      formFaultStatus: formData.faultStatus as FaultStatus,
      fieldsAreReadOnly,
      formPhisicalLocation: formData.phisicalLocation,
    });

  const goToAdditionals = () => {
    if (isNewFault) {
      toast.error("לא ניתן לבחור חלקי חילוף ואמצעים עד סיום הדיווח");
      return;
    }

    if (!isValid) {
      trigger();
      errorRef?.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!fault.faultNum) {
      toast.error("בעיה בנתוני התקלה");
      return;
    }

    normalGoTo(`${SitePaths.FAULT_HH_EMZ}/${fault.faultNum}`, {
      readOnly: fieldsAreReadOnly,
    });
  };

  useEffect(() => {
    if (fault?.faultStatus !== FaultStatus.WaitingForTransportation) {
      setValue("isWinchRequired", false);
    }
    if (fault?.faultStatus !== FaultStatus.WaitingForSquad) {
      setValue("reqSquad", "");
      setValue("squad", "");
    }
  }, [fault?.faultStatus]);

  const countErrors = (): number => {
    const hhErrors =
      fault?.hhs?.filter(
        (i) => i.missingParts === MaterialTypes.Missing && !i.isValid
      ).length ?? 0;
    const meansErrors =
      fault?.means?.filter(
        (i) => i.missingParts === MaterialTypes.Missing && !i.isValid
      ).length ?? 0;
    return hhErrors + meansErrors;
  };

  const goToChat = (faultNum: string) => {
    normalGoTo(`${SitePaths.CHAT}/${faultNum}`, {
      readOnly: fieldsAreReadOnly,
    });
  };
  return (
    <>
      <ReportFaultLayout
        isNewFault={isNewFault}
        equipment={zadikData.equipment}
        faultNum={fault?.faultNum ?? ""}
        faultStatus={fault?.faultStatus}
        goBack={normalGoBack}
        goToChat={goToChat}
      >
        <div>
          <Toaster />
        </div>
        <div className="reportFault">
          <p className="reportFault__messageTitle desc">{formData.essence}</p>
          {!isNewFault && (
            <div className="reportFault__messageContainer">
              {lastComment ? (
                <>
                  <div className="reportFault__date">
                    {dateFormat(lastComment.creationTimestamp)}
                  </div>
                  <div
                    className={`reportFault__lastMessageContainer ${
                      lastComment.username === userUnit.username
                        ? "right"
                        : "left"
                    }`}
                  >
                    <div className="reportFault__commenter">
                      {lastComment.username !== userUnit.username &&
                        lastComment.fullName}
                    </div>
                    <CommentBubble comment={lastComment} position="last" />
                  </div>
                </>
              ) : (
                <div></div>
              )}

              <MessageBar
                disable={!fault || fault.faultStatus === FaultStatus.Done}
                setMessage={handleNewMessage}
              />
            </div>
          )}

          <ReportFaultForm
            selectedFault={{ ...fault, faultNum: fault.faultNum ?? "" }}
            topFields={topFields}
            faultDataFields={faultDataFields}
            goremMetapelFields={goremMetapelFields}
            statusFields={statusFields}
            formControl={control}
            isError={countErrors() > 0}
            onNavToAdditionals={goToAdditionals}
            onFormSubmit={handleSubmit(onSubmit, onerror)}
          />
          <div
            ref={(e) => {
              errorRef.current = e;
            }}
          />
        </div>
      </ReportFaultLayout>
    </>
  );
};
export default FaultForm;
