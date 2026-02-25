import {
  default as ErrorOutlineRoundedIcon,
  default as SvgIcon,
} from "@mui/icons-material/ErrorOutlineRounded";
import { omit } from "lodash";
import { useMemo, useState } from "react";
import { useAlertify } from "../../../contexts/AlertContext";
import Chip from "../../../shared/components/Chip/Chip";
import Loader from "../../../shared/components/Loader/Loader";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import { useAddTags } from "../../services/tag/useAddTags";
import { useGetTags } from "../../services/tag/useGetTags";
import { useRemoveTag } from "../../services/tag/useRemoveTag";
import { useGetZadiksData } from "../../services/zadikData/useGetZadiksData";
import { Tag } from "../../types/tag.types";
import AddTagChip from "../AddTagChip/AddTagChip";
import "./KshirutHeadCard.scss";

type KshirutReportHeadCardProps = {
  zadik: IZadikData;
};

const KshirutReportHeadCard = (props: KshirutReportHeadCardProps) => {
  const { data: zadiksData } = useGetZadiksData();
  const { alertify } = useAlertify();

  const isZadikNotInOrgLevel = useMemo(() => {
    return (
      zadiksData &&
      !zadiksData.find((zadik) => zadik.equipment === props.zadik.equipment)
    );
  }, [props.zadik, zadiksData]);

  const [selectedTagsIds, setSelectedTagsIds] = useState<string[]>([]);

  const {
    data: tags,
    isLoading: isGetTagsLoading,
    error,
    isError,
  } = useGetTags(props.zadik.equipment);

  if (isError) {
    const msg: string = (error as any)?.response?.data?.message;
    alertify({
      messageType: "Error",
      msgContent: { message: msg },
    });
  }

  const { mutate: mutatenRemoveTag, isPending: isRemoveTagPending } =
    useRemoveTag(props.zadik.equipment);
  const { mutate: mutateAddTags, isPending: isAddTagsPending } = useAddTags(
    props.zadik.equipment,
    selectedTagsIds
  );

  const tagsInUse = tags?.filter((t) => t.inEquipment) || [];

  const tagsNotInUse: Tag[] =
    tags?.filter((t) => !t.inEquipment).map((t) => omit(t, "inEquipment")) ||
    [];

  const onCheckTag = (tagId: string) => {
    setSelectedTagsIds((prev) =>
      prev?.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...(prev ?? []), tagId]
    );
  };

  return (
    <>
      {(isGetTagsLoading || isRemoveTagPending || isAddTagsPending) && (
        <Loader />
      )}
      <div className="KshirutHeadCard__card">
        {isZadikNotInOrgLevel && (
          <p className="KshirutHeadCard__info">
            <SvgIcon className="KshirutHeadCard__info--icon">
              <ErrorOutlineRoundedIcon />
            </SvgIcon>
            <span className="KshirutHeadCard__info--text1">שים לב!</span>
            <span className="KshirutHeadCard__info--text2">
              הכלי אינו משוייך ליחידה שבחרת
            </span>
          </p>
        )}
        <div className="KshirutHeadCard__title">
          <p className="KshirutHeadCard__zadik">צ' {props.zadik.equipment}</p>
          <p className="KshirutHeadCard__title-desc">{props.zadik.equnrDesc}</p>
        </div>
        <div className="KshirutHeadCard__text">
          <span className="KshirutHeadCard__desc">
            {props.zadik.mainPlatformDesc} | {props.zadik.secPlatformDesc}
          </span>
          <span className="KshirutHeadCard__desc">
            {`${[props.zadik.maamadDesc, props.zadik.purposeDesc].join(
              props.zadik.maamadDesc && props.zadik.purposeDesc ? " | " : ""
            )}`}
          </span>
          <div className="KshirutHeadCard__tags">
            {tags && (
              <>
                {tagsInUse.map((tag) => (
                  <Chip
                    key={tag.id}
                    text={tag.text}
                    action="delete"
                    onAction={() => mutatenRemoveTag({ newTagIds: tag.id })}
                  />
                ))}
                {tagsNotInUse.length > 0 && (
                  <AddTagChip
                    tagOptions={tagsNotInUse}
                    onSaveTags={mutateAddTags}
                    selectedTagsIds={selectedTagsIds}
                    onCheckTag={onCheckTag}
                    cleanSelectedTags={() => setSelectedTagsIds([])}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KshirutReportHeadCard;
