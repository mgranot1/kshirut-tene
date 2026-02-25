import { ClickAwayListener } from "@mui/material";
import React, { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { useCurrentPath } from "../../../shared/hooks/useCurrentPath";
import { TScreenActions } from "../../services/screen/screen.service";
import { screenActionsState } from "../../stores/screenActions.store";
import { ScreenMode, screenModeState } from "../../stores/screenMode.store";
import "./CustomScreenGrid.scss";

export type Box = {
  x: number;
  y: number;
  width: number;
  id: string;
} & React.HTMLAttributes<HTMLDivElement>;

type DragTarget = {
  id: string;
  x: number;
  y: number;
  gapX: number;
  gapY: number;
  lastX: number;
  lastY: number;
  scrollX: number;
  scrollY: number;
};

interface ICustomScreenGridProps {
  boxes: Box[];
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>;
}

export const ROW_HEIGHT = 300;
export const UNITS_PER_ROW = 5;
export const UNIT_WIDTH = 100 / UNITS_PER_ROW;

const CustomScreenGrid = ({ boxes, setBoxes }: ICustomScreenGridProps) => {
  const screenMode = useRecoilValue<ScreenMode>(screenModeState);
  const [_, setScreenActions] =
    useRecoilState<TScreenActions>(screenActionsState);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const dragTargetBox = boxes.find((box) => box.id === dragTarget?.id);
  const currentScreenId = useCurrentPath();

  let rowCount =
    boxes.reduce(
      (accumulator, box) => (box.y > accumulator ? box.y : accumulator),
      0
    ) + 2;

  const containerRect = containerRef.current?.getBoundingClientRect?.();
  const UNIT_PIXEL_WIDTH = (containerRect?.width || 0) / UNITS_PER_ROW;

  const paddingGenerator = (cssString: string) => `calc(${cssString} - 0.5rem)`;

  const checkOverlapping = (box: Box, newX: Box["x"], newY: Box["y"]) => {
    if (newX + box.width > UNITS_PER_ROW || newX < 0 || newY < 0) {
      return true;
    }

    for (const box2 of boxes) {
      if (
        box.id !== box2.id &&
        box2.y === newY &&
        ((box2.x <= newX && box2.x + box2.width > newX) ||
          (newX <= box2.x && newX + box.width > box2.x))
      ) {
        return true;
      }
    }

    return false;
  };

  const moveBox = (id: Box["id"], newX: Box["x"], newY: Box["y"]) => {
    const box = boxes.find((b) => b.id === id);

    if (!box) {
      return;
    }

    const diff = { x: box.x - newX, y: box.y - newY };

    setBoxes((boxes) =>
      boxes.map((box) => (box.id === id ? { ...box, x: newX, y: newY } : box))
    );

    if (dragTarget && dragTarget?.id === id) {
      setDragTarget({
        ...dragTarget!,
        x: dragTarget?.x - diff.x,
        y: dragTarget?.y - diff.y,
        lastX: dragTarget.lastX - diff.x,
        lastY: dragTarget.lastY - diff.y,
      });
    }

    setScreenActions((prev) => ({
      ...prev,
      id: currentScreenId,
      compMeta: [
        ...prev.compMeta.filter((i) => i.id !== id),
        { id: id, compRow: newY, compColumn: newX, deletionFlag: false },
      ],
    }));
  };

  const handleDragMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (screenMode !== ScreenMode.Edit) {
      return;
    }

    if (dragTarget !== null && dragTargetBox) {
      // calculate new location
      const expectedX =
        Math.floor(
          (e.nativeEvent.x - (containerRect?.x || 0)) / UNIT_PIXEL_WIDTH
        ) -
        Math.floor(e.nativeEvent.offsetX / UNIT_PIXEL_WIDTH) -
        dragTarget.gapX;
      const expectedY =
        Math.floor((e.nativeEvent.y - (containerRect?.y || 0)) / ROW_HEIGHT) -
        dragTarget.gapY;

      // if new location is not overlap, and the box locaion has actually changed
      if (
        !checkOverlapping(dragTargetBox, expectedX, expectedY) &&
        (dragTargetBox.x !== expectedX || dragTargetBox.y !== expectedY)
      ) {
        // change box location
        moveBox(dragTarget.id, expectedX, expectedY);

        // move the box to it new location smoothly
        setDragTarget((oldDragTarget) => ({
          ...oldDragTarget!,
          x:
            oldDragTarget!.x + (dragTargetBox.x - expectedX) * UNIT_PIXEL_WIDTH,
          y: oldDragTarget!.y + (dragTargetBox.y - expectedY) * ROW_HEIGHT,
        }));
      } else {
        // move the box smoothly
        setDragTarget((oldDragTarget) => {
          if (oldDragTarget) {
            const newX =
              oldDragTarget.x +
              (e.nativeEvent.screenX - oldDragTarget.lastX) *
                (1 / window.devicePixelRatio);
            const newY =
              oldDragTarget.y +
              (e.nativeEvent.screenY - oldDragTarget.lastY) *
                (1 / window.devicePixelRatio);

            return {
              ...oldDragTarget,
              x: newX,
              y: newY,
              lastX: e.nativeEvent.screenX,
              lastY: e.nativeEvent.screenY,
            };
          }

          return oldDragTarget;
        });
      }
    }
  };

  const generateGridBoxes = (): { x: number; y: number }[] => {
    const boxes: { x: number; y: number }[] = [];
    for (let y = 0; y < rowCount; y++) {
      for (let x = 0; x < UNITS_PER_ROW; x++) {
        boxes.push({ x, y });
      }
    }

    return boxes;
  };

  const handleDragScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLDivElement;

    if (target && dragTarget) {
      setDragTarget((oldDragTarget) =>
        oldDragTarget
          ? {
              ...oldDragTarget,
              x: oldDragTarget.x + target.scrollLeft - oldDragTarget.scrollX,
              y: oldDragTarget.y + target.scrollTop - oldDragTarget.scrollY,
              scrollX: target.scrollLeft,
              scrollY: target.scrollTop,
            }
          : oldDragTarget
      );
    }
  };

  return (
    <div
      className="customScreenGrid"
      style={{
        maxHeight: 3 * ROW_HEIGHT + "px",
      }}
      onScroll={handleDragScroll}
    >
      <div
        ref={containerRef}
        className="customScreenGrid__grid"
        style={{
          height: rowCount * ROW_HEIGHT + "px",
        }}
        onMouseMove={handleDragMove}
      >
        {/* add grid background */}
        {screenMode === ScreenMode.Edit &&
          generateGridBoxes().map((box) => {
            return (
              <div
                key={box.x + "" + box.y}
                className="customScreenGrid__dragComponent"
                style={{
                  position: "absolute",
                  top: `calc(${ROW_HEIGHT * box.y}px`,
                  left: `calc(${UNIT_WIDTH * box.x}% + 0.5rem)`,
                  height: paddingGenerator(`${ROW_HEIGHT}px`),
                  width: paddingGenerator(`${UNIT_WIDTH}%`),
                }}
              ></div>
            );
          })}

        {boxes.map((box) => {
          const isDragging = dragTarget?.id === box.id;

          return (
            <ClickAwayListener
              key={box.id}
              mouseEvent={"onMouseUp"}
              onClickAway={(e) => {
                setDragTarget(null);
              }}
            >
              <div
                key={box.id}
                className="customScreenGrid__component"
                draggable={false}
                onMouseDown={(e) => {
                  const gapX =
                    Math.floor(
                      (e.clientX - (containerRect?.x || 0)) / UNIT_PIXEL_WIDTH
                    ) - box.x;

                  setDragTarget({
                    id: box.id,
                    x: 0,
                    y: 0,
                    gapX: gapX,
                    gapY: 0,
                    lastX: e.nativeEvent.screenX,
                    lastY: e.nativeEvent.screenY,
                    scrollX:
                      (
                        containerRef.current?.parentNode as
                          | HTMLDivElement
                          | undefined
                      )?.scrollLeft || 0,
                    scrollY:
                      (
                        containerRef.current?.parentNode as
                          | HTMLDivElement
                          | undefined
                      )?.scrollTop || 0,
                  });
                }}
                onMouseUp={(e) => {
                  setDragTarget(null);
                }}
                style={{
                  position: "absolute",
                  top: `calc(${ROW_HEIGHT * box.y}px${
                    isDragging ? " + " + dragTarget.y + "px" : ""
                  })`,
                  left: `calc(${UNIT_WIDTH * box.x}% + 0.5rem${
                    isDragging ? " + " + dragTarget.x + "px" : ""
                  })`,
                  transform:
                    isDragging && screenMode === ScreenMode.Edit
                      ? "scale(1.05)"
                      : "none",
                  height: paddingGenerator(`${ROW_HEIGHT}px`),
                  width: paddingGenerator(`${UNIT_WIDTH * box.width}%`),
                  transition: isDragging ? "500ms transform" : "500ms all",
                  userSelect: "auto",
                  zIndex: isDragging ? 2 : 1,
                }}
              >
                <>{box.children}</>
              </div>
            </ClickAwayListener>
          );
        })}
      </div>
    </div>
  );
};

export default CustomScreenGrid;
