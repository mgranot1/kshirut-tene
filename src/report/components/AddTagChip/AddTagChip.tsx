import AddIcon from "@mui/icons-material/Add";
import { ClickAwayListener } from "@mui/material";
import { useRef, useState } from "react";
import SearchField from "../../../shared/components/SearchField/SearchField";
import { Tag } from "../../types/tag.types";
import "./AddTagChip.scss";

type AddTagChipProps = {
  tagOptions: Tag[];
  selectedTagsIds: string[] | undefined;
  onCheckTag: (tagId: string) => void;
  onSaveTags: () => void;
  cleanSelectedTags: () => void;
};

const AddTagChip = (props: AddTagChipProps) => {
  const addChipRef = useRef<HTMLDivElement>(null);

  const [openTagSelect, setOpenTagSelect] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const filteredTags = props.tagOptions.filter(
    (tag) =>
      tag.text.includes(searchValue) ||
      (props.selectedTagsIds ? props.selectedTagsIds.includes(tag.id) : true)
  );

  const onCleanSelection = () => {
    setOpenTagSelect(false);
    setSearchValue("");
    props.cleanSelectedTags();
  };

  const onFinishPickingTag = () => {
    props.onSaveTags();
    onCleanSelection();
  };

  const outOfBounds: boolean | undefined = addChipRef.current
    ? addChipRef.current.getBoundingClientRect().left < 230
    : undefined;

  return (
    <div
      ref={addChipRef}
      className="AddTag"
      onClick={() => setOpenTagSelect(true)}
    >
      <div className="AddTag__button">
        <span className="AddTag__text">{"הוסף תגיות"}</span>
        <AddIcon className="AddTag__icon" />
      </div>
      {openTagSelect && (
        <ClickAwayListener onClickAway={onCleanSelection}>
          <div className={`SelectTag ${outOfBounds ? "SelectTag--right" : ""}`}>
            <SearchField
              searchValue={searchValue}
              onType={setSearchValue}
              onClear={() => setSearchValue("")}
              placeholder="חפש תגית..."
            />
            {filteredTags.map((tag) => (
              <div className="SelectTag__tag-option" key={tag.id}>
                <input
                  checked={props.selectedTagsIds?.includes(tag.id)}
                  type="checkbox"
                  value={tag.id}
                  onChange={() => props.onCheckTag(tag.id)}
                />
                <label>{tag.text}</label>
              </div>
            ))}
            <div className="SelectTag__save" onClick={onFinishPickingTag}>
              הוסף
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default AddTagChip;
