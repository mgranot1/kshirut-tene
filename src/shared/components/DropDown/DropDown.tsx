import SearchIcon from "@mui/icons-material/Search";
import { Box, List, ListItem } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { IDropDownOption } from "../../types/general.types";
import "./DropDown.scss";
import { Drawer } from "./DropDown.style";

interface IDropDownProps {
  title: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  optionList: IDropDownOption[];
  onSelect: (option: IDropDownOption) => void;
  presentSearch?: boolean;
}
const getText = (tree) => {
  if (typeof tree === "string") {
    return tree;
  } else if (!tree?.props.children) {
    return "";
  } else if (typeof tree.props.children === "string") {
    return tree.props.children;
  }

  return tree.props.children
    .map((child: ReactNode) => {
      return getText(child);
    })
    .join(" ");
};

const DropDown: React.FC<IDropDownProps> = ({
  title,
  optionList,
  onSelect,
  open,
  setOpen,
  presentSearch = true,
}) => {
  const [filter, setFilter] = useState<string>("");
  const [scrollEl, setScrollEl] = useState<HTMLUListElement | null>(null);
  const scrollRef = useCallback((element: HTMLUListElement) => {
    setScrollEl(element);
  }, []);

  const mappedLines = optionList
    .filter((i) => getText(i.label).includes(filter))
    .map((i, index) => (
      <ListItem
        key={index}
        className="dropdown__listItem"
        onClick={() => {
          toggleDrawer();
          onSelect(i);
        }}
      >
        {<>{i.label}</>}
      </ListItem>
    ));

  const elementVirtualizer = useVirtualizer({
    count: mappedLines.length,
    estimateSize: () => 65,
    overscan: 1,
    getScrollElement: () => scrollEl,
  });

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  if (!optionList || optionList.length <= 0) {
    return;
  }

  return (
    <Drawer
      classes={{ modal: "dropDown__modal" }}
      anchor={"bottom"}
      open={open}
      onOpen={toggleDrawer}
      onClose={toggleDrawer}
    >
      <div className="dropDown">
        <div className="dropDown__content">
          <p className="dropDown__title">{title}</p>
          {optionList.length > 2 && presentSearch && (
            <div className="dropdown__input">
              <SearchIcon className="dropdown__search" />
              <input
                className="dropdown__textFeild"
                onChange={(i) => setFilter(i.target.value)}
                placeholder={`חיפוש...`}
              />
            </div>
          )}
          <List className="dropdown__list">
            <Box
              ref={scrollRef}
              sx={{
                position: "relative",
                height: `${elementVirtualizer.getTotalSize()}px`,
              }}
            >
              {elementVirtualizer.getVirtualItems().map((item) => {
                return (
                  <div
                    key={item.key}
                    data-index={item.index}
                    ref={elementVirtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${item.start}px)`,
                    }}
                  >
                    {mappedLines[item.index]}
                  </div>
                );
              })}
            </Box>
          </List>
        </div>
      </div>
    </Drawer>
  );
};
export default DropDown;
