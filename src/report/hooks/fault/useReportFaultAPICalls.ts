import { SubmitHandler, UseFormSetValue } from "react-hook-form";
import toast from "react-hot-toast";
import { Location, useLocation, useNavigate } from "react-router-dom";
import { useAlertify } from "../../../contexts/AlertContext";
import { IKshirutData } from "../../../shared/types/kshirutData.types";
import {
  CLOSED_FAULT_STATUSES,
  FaultStatus,
  Kshirut,
  TransportationType,
} from "../../../shared/types/params.types";
import {
  MatomoCategory,
  matomoEvent,
} from "../../../shared/utils/matomo.utils";

import { queryClient } from "../../../queryClient";
import { SitePaths } from "../../../router/routes";
import { TurnOptional } from "../../../shared/types/general.types";
import { QueryKeys } from "../../../shared/types/query.types";
import {
  IFaultDataForm,
  LocationState as ReportLocationState,
} from "../../pages/ReportFault/ReportFault";
import { useCreateChat } from "../../services/chat/useCreateChat";
import { useCreateFault } from "../../services/fault/useCreateFault";
import { useUpdateFault } from "../../services/fault/useUpdateFault";
import { useGetKshirutData } from "../../services/kshirutData/useGetKshirutData";
import { useUpdateKshirutData } from "../../services/kshirutData/useUpdateKshirutData";
import { useUpdateView } from "../../services/view/useUpdateView";
import { useGetZadikQuery } from "../../services/zadikData/useGetZadikData";
import { IComment } from "../../types/comment.types";
import { IFault } from "../../types/fault.types";
import { LogTypes } from "../../types/log.types";
import { useUserUnit } from "../useUserUnit";

interface UseReportFaultAPICallsProps {
  dirtyFieldsLength: number;
  afterSubmit: (data: IFault, message?: string) => void;
  afterAddNewMessage: (comment: IComment) => void;
  faultStatusFromDB: FaultStatus;
  selectedFault: TurnOptional<IFault, "faultNum">;
  defaultStatus: string;
  setValue: UseFormSetValue<IFaultDataForm>;
}

type LocationState = {
  fromNotKashir?: boolean;
  kshirutData?: IKshirutData;
} | null;

const useReportFaultAPICalls = ({
  dirtyFieldsLength,
  afterSubmit,
  afterAddNewMessage,
  faultStatusFromDB,
  selectedFault,
  defaultStatus,
  setValue,
}: UseReportFaultAPICallsProps) => {
  const [userUnit, _] = useUserUnit();
  const { alertify } = useAlertify();
  const navigate = useNavigate();

  const location: Location<LocationState> = useLocation();

  const {
    data: kshirutDataBeforeChanges,
    isSuccess: isGetkshirutDataSuccess,
    refetch: kshirutDataRefetch,
  } = useGetKshirutData(selectedFault.equipment);

  //TODO: Currently only needed for it's secPlatform data. Consider replacing it with a fix of the secPlatform field in getKshirutData.
  const { data: getZadikData } = useGetZadikQuery({
    equipment: selectedFault.equipment,
  });

  const onSuccessUpdateKshirutData = () => {
    kshirutDataRefetch();
  };

  const onSuccessUpdateFaultData = (
    updatedFault: IFault,
    // By post, it means POST to the server.
    dataBeforePost: { faultData: IFault; kshirutData: IKshirutData }
  ) => {
    afterSubmit(updatedFault);
    let openFaultsAmount = dataBeforePost.kshirutData.openFaults;

    const hasStatusChanged =
      !faultStatusFromDB ||
      faultStatusFromDB !== dataBeforePost.faultData.faultStatus;

    const oldStatusIsClosed = CLOSED_FAULT_STATUSES.includes(faultStatusFromDB);

    const newStatusIsClosed = CLOSED_FAULT_STATUSES.includes(
      dataBeforePost.faultData.faultStatus as FaultStatus
    );

    if (hasStatusChanged) {
      if (oldStatusIsClosed && !newStatusIsClosed) {
        openFaultsAmount++;
      }

      if (!oldStatusIsClosed && newStatusIsClosed) {
        openFaultsAmount--;
      }
    }

    if (
      isGetkshirutDataSuccess &&
      kshirutDataBeforeChanges &&
      // If any changes in kshirut
      Object.keys(dataBeforePost.kshirutData).some(
        (key) =>
          kshirutDataBeforeChanges[key] !== dataBeforePost.kshirutData[key]
      )
    ) {
      mutateKshirutData(dataBeforePost.kshirutData);
    }
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.GetKshirutData, dataBeforePost.faultData.equipment],
    });
    toast.success("עדכון תקלה נשמר בהצלחה");
  };

  const onSuccessCreateChat = (comment: IComment) => {
    afterAddNewMessage(comment);
  };

  const onSuccssCreateFault = (
    newFaultData: IFault,
    variables: { faultData: IFault; kshirutData: IKshirutData }
  ) => {
    let openFaultsAmount = variables.kshirutData.openFaults;

    const newStatusIsOpen = !CLOSED_FAULT_STATUSES.includes(
      variables.faultData.faultStatus as FaultStatus
    );

    if (newStatusIsOpen) openFaultsAmount++;
    afterSubmit(newFaultData);
    mutateKshirutData(variables.kshirutData!);
    mutateUpdateView({ logTypeKey: newFaultData.faultNum });

    const faultLocationState: ReportLocationState = {
      backButton: {
        path: `../${SitePaths.KSHIRUT_REPORT}/${newFaultData.equipment}`,
      },
    };
    navigate(`../${SitePaths.FAULT_REPORT}?faultId=${newFaultData.faultNum}`, {
      state: faultLocationState,
    });

    toast.success("עדכון תקלה נשמר בהצלחה");
  };

  const { mutate: mutateCreateFault } = useCreateFault({
    onsuccss: onSuccssCreateFault,
  });

  const { mutate: mutateUpdateFault } = useUpdateFault({
    onSuccess: onSuccessUpdateFaultData,
  });

  const { mutate: mutatenCreateChat } = useCreateChat({
    onSuccess: onSuccessCreateChat,
  });

  const { mutate: mutateKshirutData } = useUpdateKshirutData({
    onSuccess: onSuccessUpdateKshirutData,
  });
  const { mutate: mutateUpdateView } = useUpdateView(LogTypes.Fault);

  const doFaultCreationProcess = async (
    formData: IFaultDataForm,
    faultData: TurnOptional<IFault, "faultNum">,
    kshirutData: IKshirutData
  ) => {
    const faultForCreate: IFault = {
      ...formData,
      faultNum: faultData?.faultNum || "",
      faultStatus: formData?.faultStatus ?? FaultStatus.Opened,
      equipment: selectedFault.equipment,
      transportationType:
        formData.faultStatus === FaultStatus.WaitingForTransportation &&
        formData.isWinchRequired
          ? TransportationType.WinchRequired
          : "",
      reqSquad:
        formData.faultStatus === FaultStatus.WaitingForSquad
          ? formData.reqSquad
          : "",
      squad:
        formData.faultStatus === FaultStatus.WaitingForSquad
          ? formData.squad
          : "",
      changeUser: userUnit.username,
      means: faultData.means,
      hhs: faultData.hhs,
      comments: [],
    };
    if (
      location.state?.fromNotKashir &&
      location.state?.kshirutData &&
      isGetkshirutDataSuccess
    ) {
      kshirutData = {
        ...kshirutData,
        kshirut: location.state.kshirutData.kshirut,
        warKshirut: location.state.kshirutData.warKshirut,
        decidingNonKshirutCause:
          location.state.kshirutData.decidingNonKshirutCause,
      };
    }
    mutateCreateFault({ faultData: faultForCreate, kshirutData: kshirutData });

    matomoEvent(
      "report fault",
      MatomoCategory.ClICK,
      faultForCreate.faultNum,
      Number(faultForCreate.equipment)
    );
  };

  const doFaultUpdateProcess = async (
    formData: IFaultDataForm,
    faultData: IFault,
    kshirutData: IKshirutData
  ) => {
    if (
      !Object.keys(faultData).some(
        (key) =>
          formData[key] !== faultData[key] &&
          !["hhs", "comments", "means"].includes(key)
      )
    ) {
      return;
    }

    const faultForUpdate: IFault = {
      ...formData,
      faultStatus: formData?.faultStatus ?? FaultStatus.Opened,
      equipment: selectedFault.equipment,
      faultNum: faultData?.faultNum ? faultData.faultNum : "",
      changeUser: userUnit.username,
      comments: faultData?.comments,
      means: faultData.means,
      hhs: faultData.hhs,
      transportationType:
        formData.faultStatus === FaultStatus.WaitingForTransportation &&
        formData.isWinchRequired
          ? TransportationType.WinchRequired
          : "",
      reqSquad:
        formData.faultStatus === FaultStatus.WaitingForSquad
          ? formData.reqSquad
          : "",
      squad:
        formData.faultStatus === FaultStatus.WaitingForSquad
          ? formData.squad
          : "",
    };

    mutateUpdateFault({ faultData: faultForUpdate, kshirutData: kshirutData });
  };

  const alertOnHulia = () => {
    alertify({
      messageType: "Error",
      msgContent: {
        message: "יש למלא חוליה נדרשת",
      },
      buttons: [
        {
          text: "סגירה",
          onClick: () => {},
          variant: "contained",
        },
      ],
    });
  };

  const alertOnKshirut = (data: IFaultDataForm) => {
    const kshirutToSend: IKshirutData = {
      ...(kshirutDataBeforeChanges || ({} as IKshirutData)),
      phisicalLocation: data.phisicalLocation,
      phisicalLocationDesc: data.phisicalLocationDesc,
    };
    const faultNum = selectedFault.faultNum;

    alertify({
      messageType: "Unknown",
      msgContent: { message: "האם הצ' כשיר?" },
      buttons: [
        {
          text: "לא",
          onClick: () => {
            data.faultStatus = defaultStatus || FaultStatus.Opened;
            setValue("faultStatus", defaultStatus);
            if (!faultNum) {
              doFaultCreationProcess(data, selectedFault, kshirutToSend);
            } else {
              doFaultUpdateProcess(
                data,
                { ...selectedFault, faultNum },
                kshirutToSend
              );
            }
            toast.error("סגירת התקלה נכשלה, חובה תקלה אחת פתוחה לצ' לא כשיר");
          },
          variant: "outlined",
        },
        {
          text: "כן",
          onClick: () => {
            if (!faultNum) {
              doFaultCreationProcess(data, selectedFault, {
                ...kshirutToSend,
                kshirut: Kshirut.Kashir,
                warKshirut: Kshirut.Kashir,
              });
            } else {
              doFaultUpdateProcess(
                data,
                { ...selectedFault, faultNum },
                {
                  ...kshirutToSend,
                  kshirut: Kshirut.Kashir,
                  warKshirut: Kshirut.Kashir,
                }
              );
            }
            navToKshirutReport(selectedFault.equipment);
          },
          variant: "contained",
        },
      ],
    });
  };

  const navToKshirutReport = (zadikId: string): void => {
    const familyCode = getZadikData?.secPlatform.split(".")[0] ?? undefined;
    navigate(`../${SitePaths.KSHIRUT_REPORT}/${zadikId}`, {
      state: {
        backButtonState: {
          path: familyCode
            ? `${SitePaths.FAMILY}/${familyCode}`
            : SitePaths.HOME,
        },
      },
    });
  };

  const onSubmit: SubmitHandler<IFaultDataForm> = (
    formData: IFaultDataForm
  ) => {
    if (
      dirtyFieldsLength === 0 ||
      !selectedFault ||
      !kshirutDataBeforeChanges
    ) {
      return;
    }

    if (
      formData.faultStatus === FaultStatus.WaitingForSquad &&
      !formData.reqSquad
    ) {
      alertOnHulia();
      return;
    }

    const kshirut: IKshirutData = {
      ...kshirutDataBeforeChanges,
    } as IKshirutData;
    kshirut.phisicalLocation = formData.phisicalLocation;
    kshirut.phisicalLocationDesc = formData.phisicalLocationDesc;

    const isTotallyKashir =
      kshirut &&
      kshirut.kshirut === Kshirut.Kashir &&
      kshirut.warKshirut === Kshirut.Kashir;

    const isFaultToBeClosed = CLOSED_FAULT_STATUSES.includes(
      formData.faultStatus as FaultStatus
    );

    const isNewFault = !selectedFault.faultNum;

    if (
      isFaultToBeClosed &&
      !isTotallyKashir &&
      ((isNewFault && kshirutDataBeforeChanges.openFaults === 0) ||
        (!isNewFault && kshirutDataBeforeChanges.openFaults === 1))
    ) {
      alertOnKshirut(formData);
    } else {
      if (isNewFault) {
        doFaultCreationProcess(formData, selectedFault, kshirut);
      } else {
        doFaultUpdateProcess(
          formData,
          { ...selectedFault, faultNum: selectedFault.faultNum! },
          kshirut
        );
      }
    }
  };

  const handleNewMessage = (newMessage: string) => {
    if (!newMessage || newMessage.trim() === "") return;

    const newComment: IComment = {
      faultNum: selectedFault?.faultNum,
      commentText: newMessage,
      creationTimestamp: new Date(),
      username: userUnit.username,
    } as IComment;
    mutatenCreateChat({ comment: newComment });

    return;
  };

  return { onSubmit, handleNewMessage };
};

export default useReportFaultAPICalls;
