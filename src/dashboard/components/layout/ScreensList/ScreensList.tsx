import React, {useState } from "react";
import { useAlertifyBeforeNavigateCustomScreen } from "../../../hooks/useAlertifyBeforeNavigateCustomScreen";
import ScreenSetting from "../../ScreenSetting/ScreenSetting";
import Folder from "../Folder/Folder";
import "./ScreensList.scss";
import { emptyListMessage, listTitle } from "./const";
import { useScreensByOwnership } from "./useScreensByOwnership";
import { useOpenIndex } from "./useOpenIndex";

const ScreensList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { navigateFromCustomScreen } = useAlertifyBeforeNavigateCustomScreen();
  const { screenByOwnership, isLoading } = useScreensByOwnership();
  const { openIndex, setOpenIndex, uniqueId } = useOpenIndex()

  return (
    <>
      <div className="ScreensList">
        <button
          className="ScreensList__button"
          onClick={() => navigateFromCustomScreen(() => setOpen(true))}
        >
          + יצירת מסך חדש
        </button>
        {Object.keys(screenByOwnership).map((owner) => (
          <React.Fragment key={owner}>
            <span className="ScreensList__title">{listTitle[owner]}</span>
            {isLoading ? <span>טעינת מסכים...</span> :
              Object.keys(screenByOwnership[owner]).length > 0 ? (
                <div className="ScreensList__folders">
                  {Object.keys(screenByOwnership[owner]).map((category) => (
                    <Folder
                      key={uniqueId(category, owner)}
                      id={uniqueId(category, owner)}
                      name={screenByOwnership[owner][category][0]?.categoryName}
                      screens={screenByOwnership[owner][category]}
                      isOpen={openIndex === uniqueId(category, owner)}
                      onToggleFolder={() =>
                        setOpenIndex((prev) =>
                          prev === uniqueId(category, owner)
                            ? null
                            : uniqueId(category, owner)
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <span className="ScreensList__noData">{emptyListMessage[owner]}</span>
              )}
          </React.Fragment>
        ))}
      </div>
      <ScreenSetting
        key='newScreen'
        open={open}
        setOpen={setOpen}
        currentScreenId=""
      />
    </>
  );
};

export default ScreensList;
