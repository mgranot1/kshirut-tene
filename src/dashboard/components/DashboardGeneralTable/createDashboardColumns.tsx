import { MRT_ColumnDef } from "material-react-table";
import useLocalStorage from "../../../shared/hooks/useLocalStorage";
import { IOption } from "../../../shared/types/general.types";
import { MaterialTypes } from "../../../shared/types/mean.types";
import { Kshirut, ParamKey } from "../../../shared/types/params.types";
import { ORG_LEVEL_KEY } from "../../../shared/utils/constants";
import {
  compareTimestamps,
  convertDateToTimeDisplay,
} from "../../../shared/utils/dates.utils";
import { KshirutType } from "../../stores/kshirutType.store";
import {
  OrganizationalLevel,
  OrgLevelCode,
} from "../../types/dashboardOrgLevel.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import TextTooltip from "../TextTooltip/TextTooltip";

type ForceDetails = {
  title: string;
  value: boolean;
};

const getKshirutTag = (
  kshirut: Kshirut | ""
): [iconClass: string, title: string] => {
  let title = "";
  let iconClass = "";
  switch (kshirut) {
    case Kshirut.Kashir:
      title = "כשיר";
      iconClass = "green";
      break;
    case Kshirut.Not_Kashir || Kshirut.Not_relevant:
      title = "לא כשיר";
      iconClass = "red";
      break;
    case "":
      title = "לא דווח";
      iconClass = "grey";
      break;
  }

  return [title, iconClass];
};

export type CreateDashboardColumnsParams = {
  options: Record<
    Extract<keyof GeneralDashboardTableRow, Exclude<ParamKey, "kshirut">>,
    IOption[]
  >;
  kshirutType: KshirutType;
};

export const createDashboardColumns = (
  params: CreateDashboardColumnsParams
): MRT_ColumnDef<GeneralDashboardTableRow>[] => [
  {
    accessorKey: "equipment",
    id: "equipment",
    enableClickToCopy: true,
    header: "מספר צ'",
    size: 120,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },

  {
    accessorKey: "material",
    header: "חומר",
    id: "material",
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
    size: 120,
  },

  {
    accessorKey: "faultNum",
    id: "faultNum",
    header: "מספר תקלה",
    size: 140,
    Cell: ({ cell, row }) => (
      <TextTooltip title={cell.getValue<string>()} text={cell.getValue<string>()} />
    ),
  },

  {
    accessorKey: "expectedTime",
    header: "צפי תיקון",
    id: "expectedTime",
    Cell: ({ cell }) => {
      const cellMessage: string =
        params.options.expectedTime.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return cellMessage ? (
        <div className="table-tags">
          <p className="table-tag extra-large icon time-icon">{cellMessage}</p>
        </div>
      ) : null;
    },
  },

  {
    accessorKey: "description",
    id: "description",
    header: "תיאור חומר",
    enableClickToCopy: true,
    size: 200,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    accessorKey: "materialFamily",
    id: "materialFamily",
    header: "משפחה",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ row }) => {
      const cellValue = row.original.materialFamilyDesc ?? "חסר";
      return <TextTooltip title={cellValue} text={cellValue} />;
    },
  },
  {
    accessorKey: "mainPlatform",
    id: "mainPlatform",
    header: "פלטפורמה",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ cell, row }) => {
      const innerString = row.original.mainPlatformDesc;
      return cell.getValue<string>() ? (
        <TextTooltip title={innerString} text={innerString} />
      ) : (
        <span> חסר </span>
      );
    },
  },
  {
    accessorKey: "secPlatform",
    id: "secPlatform",
    header: "תת פלטפורמה",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ cell, row }) => {
      const innerString = row.original.secPlatformDesc;
      return cell.getValue<string>() ? (
        <TextTooltip title={innerString} text={innerString} />
      ) : (
        <span> חסר </span>
      );
    },
  },
  {
    accessorKey: "warKshirut",
    id: "warKshirut",
    header: "כשירות מלחמה",
    size: 160,
    Cell: ({ cell, row }) => {
      const [title, iconClass] = getKshirutTag(cell.getValue<Kshirut>());

      return (
        title && (
          <div className="table-tags">
            <span className={`table-tag icon ${iconClass} medium`}>
              {title}
            </span>
          </div>
        )
      );
    },
  },
  {
    accessorKey: "kshirut",
    id: "kshirut",
    header: "כשירות שגרה",
    size: 150,
    Cell: ({ cell, row }) => {
      const [title, iconClass] = getKshirutTag(cell.getValue<Kshirut>());

      return (
        title && (
          // showKshirut &&
          <div className="table-tags">
            <span className={`table-tag icon ${iconClass} medium`}>
              {title}
            </span>
          </div>
        )
      );
    },
  },
  {
    accessorKey: "decidingNonKshirutCause",
    id: "decidingNonKshirutCause",
    header: "סיבת אי כשירות קובעת",
    size: 150,
    Cell: ({ cell }) => {
      const cellMessage: string =
        params.options.decidingNonKshirutCause.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return cellMessage ? (
        <div className="table-tags">
          <p className="table-tag extra-large icon time-icon">{cellMessage}</p>
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "tags",
    header: "תגיות",
    size: 200,
    id: "tags",
    Cell: ({ cell }) => {
      const tagValues: string[] = cell.getValue<string[]>() || [];
      const labels = tagValues
        .map(
          (value) =>
            params.options.tags.find((option) => option.value === value)?.label
        )
        .filter(Boolean);
      return labels.length ? (
        <div className="table-tags tags-container">
          {labels.map((label, index) => (
            <p key={index} className="table-tag">
              {label}
            </p>
          ))}
        </div>
      ) : null;
    },
  },

  {
    accessorKey: "routineTplnr",
    id: "routineTplnr",
    header: "שיוך שגרה",
    enableClickToCopy: true,
    size: 200,
    Cell: ({ cell, row }) => {
      const innerString =
        row.original.routineTplnr + " - " + row.original.routineTplnrDesc;
      return cell.getValue<string>() ? (
        <TextTooltip title={innerString} text={innerString} />
      ) : (
        <span> חסר </span>
      );
    },
  },
  {
    accessorKey: "warTplnr",
    id: "warTplnr",
    header: "ציוות קרבי",
    enableClickToCopy: true,
    size: 200,
    Cell: ({ cell, row }) => {
      const innerString =
        row.original.warTplnr + " - " + row.original.warTplnrDesc;
      return (
        cell.getValue<string>() && (
          <TextTooltip title={innerString} text={innerString} />
        )
      );
    },
  },
  {
    accessorKey: "isGdudManeuvering",
    id: "isGdudManeuvering",
    header: "גדוד בלחימה",
    enableClickToCopy: false,
    size: 145,
    Cell: ({ cell }) => (
      <div className="table-tags">
        <div
          className={`table-tag large icon ${
            cell.getValue<boolean>() ? "green" : "red"
          }`}
        >
          <div>
            <span> {cell.getValue<boolean>() ? "בלחימה" : "לא בלחימה"} </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "job",
    id: "job",
    header: "תפקיד",
    enableClickToCopy: true,
    size: 110,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    accessorKey: "pluga",
    id: "pluga",
    header: "פלוגה",
    enableClickToCopy: true,
    size: 110,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    accessorKey: "equipmentTask",
    id: "equipmentTask",
    header: "משימת הכלי",
    size: 150,
    Cell: ({ cell }) => {
      const cellMessage: string =
        params.options.equipmentTask.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return cellMessage ? (
        <div className="table-tags">
          <p className="table-tag extra-large icon time-icon">{cellMessage}</p>
        </div>
      ) : null;
    },
  },
  {
    accessorFn: (row) =>
      [
        { title: 'אג"מי', value: row.isAgamForce },
        { title: "לוגיסטי", value: row.isLogisticForce },
      ] as ForceDetails[],
    id: "forces",
    header: "מכפיל כח",
    size: 200,
    Cell: ({ cell }) => {
      return (
        <div className="table-tags">
          {Object.values(cell.getValue<ForceDetails[]>())
            .filter((force) => force.value)
            .map((force) => {
              return (
                <div key={`tag-${force.title}`} className="table-tags">
                  <div className="table-tag medium">
                    <div>
                      <span className="tag-header"> {force.title} </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      );
    },
  },
  {
    accessorFn: (row) =>
      row.lastUpdateTimestamp
        ? ` 📆 ${row.lastUpdateTimestamp.toLocaleDateString(
            "en-gb"
          )} | ⌚ ${convertDateToTimeDisplay(row.lastUpdateTimestamp)}`
        : "",
    id: "lastUpdateTimestamp",
    header: "תאריך עדכון אחרון",
    sortingFn: (rowA, rowB) =>
      compareTimestamps(
        rowA.original.lastUpdateTimestamp,
        rowB.original.lastUpdateTimestamp
      ),
  },
  {
    accessorFn: (row) => {
      const [selectedOrganizationalLevel] =
        useLocalStorage<OrganizationalLevel>(ORG_LEVEL_KEY);

      const currentTree =
        selectedOrganizationalLevel?.[OrgLevelCode.TREE_TYPE][0]?.label ?? "";

      // If the pikud desc starts with the name of the TreeType, remove the TreeType
      const pikudName =
        currentTree && row.pikudDesc
          ? row.pikudDesc.replace(currentTree, "").replace(/^ *- */g, "")
          : row.pikudDesc;

      return pikudName ? pikudName : row.pikud;
    },
    id: "pikud",
    header: "פיקוד",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ cell, row }) => {
      return (
        cell.getValue<string>() && (
          <TextTooltip
            title={cell.getValue<string>()}
            text={cell.getValue<string>()}
          />
        )
      );
    },
  },
  {
    accessorKey: "ugda",
    id: "ugda",
    header: "אוגדה",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ cell, row }) => {
      const innerString = row.original.ugdaDesc
        ? row.original.ugdaDesc
        : row.original.ugda;
      return (
        innerString && <TextTooltip title={innerString} text={innerString} />
      );
    },
  },
  {
    accessorKey: "utzva",
    id: "utzva",
    header: "חטיבה",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ cell, row }) => {
      const innerString = row.original.utzvaDesc
        ? row.original.utzvaDesc
        : row.original.utzvaDesc;
      return innerString ? (
        <TextTooltip title={innerString} text={innerString} />
      ) : (
        <span> חסר </span>
      );
    },
  },
  {
    accessorKey: "maamad",
    id: "maamad",
    header: "מעמד",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ cell, row }) => {
      const innerString = row.original.maamadDesc
        ? row.original.maamadDesc
        : row.original.maamad;
      return (
        innerString && <TextTooltip title={innerString} text={innerString} />
      );
    },
  },
  {
    accessorKey: "purpose",
    id: "purpose",
    header: "יעוד",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ cell, row }) => {
      const innerString = row.original.purposeDesc
        ? row.original.purposeDesc
        : row.original.purpose;
      return (
        innerString && <TextTooltip title={innerString} text={innerString} />
      );
    },
  },
  {
    accessorKey: "essence",
    id: "essence",
    enableClickToCopy: true,
    header: "מהות התקלה",
    size: 200,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    accessorFn: (row) =>
      row.createTimestamp
        ? ` 📆 ${row.createTimestamp.toLocaleDateString(
            "en-gb"
          )} | ⌚ ${convertDateToTimeDisplay(row.createTimestamp)}`
        : "",
    id: "createTimestamp",
    header: "תאריך יצירה",
    sortingFn: (rowA, rowB) =>
      compareTimestamps(
        rowA.original.createTimestamp,
        rowB.original.createTimestamp
      ),
  },
  {
    accessorFn: (row) =>
      row.changeTimestamp
        ? ` 📆 ${row.changeTimestamp.toLocaleDateString(
            "en-gb"
          )} | ⌚ ${convertDateToTimeDisplay(row.changeTimestamp)}`
        : "",
    id: "changeTimestamp",
    header: "תאריך שינוי אחרון",
    sortingFn: (rowA, rowB) =>
      compareTimestamps(
        rowA.original.changeTimestamp,
        rowB.original.changeTimestamp
      ),
  },
  {
    accessorKey: "physicalLocation",
    id: "physicalLocation",
    header: "מיקום פיזי",
    enableClickToCopy: true,
    size: 135,
    Cell: ({ cell, row }) => {
      const locationMessage: string =
        params.options.physicalLocation.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return <TextTooltip title={locationMessage} text={locationMessage} />;
    },
  },
  {
    accessorKey: "physicalLocationDetails",
    id: "physicalLocationDetails",
    header: "תאור מיקום פיזי",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    id: "faultStatus",
    accessorKey: "faultStatus",
    header: "סטטוס",
    size: 200,
    Cell: ({ cell }) => {
      const cellMessage: string =
        params.options.faultStatus.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return (
        <div className="table-tags">
          <p className="table-tag extra-large icon stop-icon">{cellMessage}</p>
        </div>
      );
    },
  },
  {
    id: "dereg",
    accessorKey: "dereg",
    header: "דרג טיפול",
    enableClickToCopy: true,
    size: 130,
    Cell: ({ cell }) => {
      const cellMessage: string =
        params.options.dereg.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return <TextTooltip title={cellMessage} text={cellMessage} />;
    },
  },
  {
    id: "grindType",
    accessorKey: "grindType",
    header: "סוג שחיקה",
    size: 135,
    Cell: ({ cell }) => {
      const cellMessage: string =
        params.options.grindType.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return <TextTooltip title={cellMessage} text={cellMessage} />;
    },
  },
  {
    id: "availabilityInhibitor",
    accessorKey: "availabilityInhibitor",
    header: "מעכבי זמינות",
    size: 150,
    Cell: ({ cell }) => {
      const cellMessage: string =
        params.options.availabilityInhibitor.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return <TextTooltip title={cellMessage} text={cellMessage} />;
    },
  },
  {
    id: "transportationType",
    accessorFn: (row) =>
      params.options.transportationType.find(
        (option) => option.value === row.transportationType
      )?.label ?? "",
    header: "סוג הובלה",
    size: 130,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },

  {
    id: "mobileAbility",
    accessorKey: "mobileAbility",
    header: "יכולת תנועה",
    size: 140,
    Cell: ({ cell }) => {
      const cellMessage: string =
        params.options.mobileAbility.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return <TextTooltip title={cellMessage} text={cellMessage} />;
    },
  },

  {
    id: "faultHh",
    accessorFn: (row) =>
      row.faultHh?.filter((i) => i.missingParts === MaterialTypes.Missing)
        .length || "",
    header: "חלקי חילוף",
    size: 135,
  },
  {
    id: "faultHhProblem",
    accessorFn: (row) =>
      row.faultHh?.filter(
        (i) =>
          i.missingParts === MaterialTypes.Missing &&
          (i.material === "" || !i.isValid)
      ).length || "",
    header: "בעיה בחלקי חילוף",
    size: 175,
  },
  {
    id: "faultEmz",
    accessorFn: (row) =>
      row.faultEmz?.filter((i) => i.missingParts === MaterialTypes.Missing)
        .length || "",
    header: "אמצעים נדרשים",
    size: 165,
  },
  {
    id: "faultEmzProblem",
    accessorFn: (row) =>
      row.faultEmz?.filter(
        (i) =>
          i.missingParts === MaterialTypes.Missing &&
          (i.material === "" || !i.isValid)
      ).length || "",
    header: "בעיה באמצעים",
    size: 160,
  },
  {
    id: "reqSquad",
    accessorKey: "reqSquad",
    header: "חוליה נדרשת",
    enableClickToCopy: true,
    size: 150,
    Cell: ({ cell }) => {
      const cellMessage: string =
        params.options.reqSquad.find(
          (option) => option.value === cell.getValue<string>()
        )?.label ?? "";

      return <TextTooltip title={cellMessage} text={cellMessage} />;
    },
  },
  {
    id: "squad",
    accessorKey: "squad",
    header: "חוליה מוקצת",
    enableClickToCopy: true,
    size: 150,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    id: "contact",
    accessorKey: "contact",
    header: "איש קשר",
    enableClickToCopy: true,
    size: 170,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "מספר טלפון",
    enableClickToCopy: true,
    size: 200,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    id: "note",
    accessorKey: "note",
    header: "הערה",
    enableClickToCopy: true,
    size: 200,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
];

export default createDashboardColumns;
