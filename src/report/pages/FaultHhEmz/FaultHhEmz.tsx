import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Loader from "../../../shared/components/Loader/Loader";
import useFormNav from "../../../shared/hooks/useFormNav";
import { paramsAtom } from "../../../shared/stores/params.store";
import { IDropDownOption } from "../../../shared/types/general.types";
import {
  IMean,
  IMeanErr,
  MaterialTypes
} from "../../../shared/types/mean.types";
import HhEmzLayout from "../../components/HhEmzLayout/HhEmzLayout";
import MissingPartUnit from "../../components/MissingPartUnit/MissingPartUnit";
import { useGetFaultData } from "../../services/fault/useGetFaultData";
import { useGetHHDescriptionByMaterial } from "../../services/fault/useGetHHDescriptionByMaterial";
import { useGetHHDescriptions } from "../../services/fault/useGetHHDescriptions";
import { useUpdateFault } from "../../services/fault/useUpdateFault";
import { IFault, IMaterialDesc } from "../../types/fault.types";
import { IHH, IHHErr } from "../../types/hh.types";
import "./FaultHhEmz.scss";
import KshirutFaultService from "../../services/fault/Fault.service";

export const MAX_LENGTH_DESCRIPTION = 40;

export type PageParams = Record<'faultId',string>

const FaultHhEmz = () => {
  const {faultId} = useParams<PageParams>() as PageParams;
  const location = useLocation();
  const pageIsReadOnly: boolean = location.state?.readOnly;

  const [localHh, setLocalHh] = useState<IHHErr[]>([]);
  const [localEmz, setLocalEmz] = useState<IMeanErr[]>([]);
  const [currentFault, setCurrentFault] = useState<IFault>({} as IFault);
  const [options, setOptions] = useState<IDropDownOption[]>([]);
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const { goBack, goTo } = useFormNav({
    canSave: true,
    fieldsChanged: dataChanged,
    onSave: () => saveData(),
  });
  const {
    data: faultData,
    isSuccess: isGetFaultDataSuccess,
    isLoading: isGetFaultDataLoading,
  } = useGetFaultData(faultId);

  const {
    data: materialHhDbDescs,
    refetch: materialHhDbDescsRefetch,
    isSuccess: isHHDescriptionsSuccess,
  } = useGetHHDescriptions(faultId);

  const params = useRecoilValue(paramsAtom);

  const ontHHDescriptionByMaterialSuccess = (
    hHDescriptionByMaterialData: IMaterialDesc[],
    variables: {
      missingPart: IHHErr;
      index: number;
    }
  ) => {
    const editedLocalHh = [...localHh];

    if (hHDescriptionByMaterialData.length > 0) {
      setLocalHh((prev) => {
        editedLocalHh[variables.index] = {
          ...variables.missingPart,
          isValid: true,
          materialDbDesc: hHDescriptionByMaterialData[0].materialDesc,
          isDuplicateMkt:
            localHh
              .slice(0, variables.index)
              .some(
                (material) =>
                  material.material === variables.missingPart.material
              ) ||
            localHh
              .slice(variables.index + 1, localHh.length)
              .some(
                (material) =>
                  material.material === variables.missingPart.material
              ),
        };
        return editedLocalHh;
      });

      return;
    }

    setLocalHh((prev) => {
      editedLocalHh[variables.index] = {
        ...variables.missingPart,
        isValid: false,
        materialDbDesc: "",
        isDuplicateMkt:
          localHh
            .slice(0, variables.index)
            .some(
              (material) => material.material === variables.missingPart.material
            ) ||
          localHh
            .slice(variables.index + 1, localHh.length)
            .some(
              (material) => material.material === variables.missingPart.material
            ),
      };

      return editedLocalHh;
    });
  };
  const { mutate: hHDescriptionByMaterialMutate } =
    useGetHHDescriptionByMaterial({
      onsuccss: ontHHDescriptionByMaterialSuccess,
    });

  const onSuccessUpdateFaultData = async (updateFaultData: IFault) => {
    setLocalHh(
      updateFaultData.hhs.map((hh) => {
        return {
          ...hh,
          materialDbDesc: hh.materialDbDesc,
          isValid: hh.isValid,
          isEdited: false,
        };
      }) as IHHErr[]
    );

    setLocalEmz(
      updateFaultData.means.map((emz) => ({
        ...emz,
        isEdited: false,
      })) as IMeanErr[]
    );

    setCurrentFault((prev) => ({
      ...prev,
      means: updateFaultData.means,
      hhs: updateFaultData.hhs,
    }));
    setDataChanged(false);

    toast.success("עדכון תקלה נשמר בהצלחה");
  };
  const { mutate: updateFaultMutate } = useUpdateFault({
    onSuccess: onSuccessUpdateFaultData,
  });

  useEffect(() => {
    setDataChanged(
      localHh.some((hh) => hh.isEdited) ||
        localEmz.some((m) => m.isEdited) ||
        dataChanged
    );
  }, [localHh, localEmz]);

  useEffect(() => {
    const fetchStatusOptions = async () => {
      setOptions([
        ...params.missingPartStatus.map((i) => ({
          value: i.value,
          label: <div className="missingPart__status">{i.label}</div>,
        })),
        { value: "", label: <div className="missingPart__noStatus"></div> },
      ]);
    };

    fetchStatusOptions();
  }, []);

  useEffect(() => {
    if (faultData && isHHDescriptionsSuccess) {
      setCurrentFault(faultData);
      setLocalEmz(
        faultData.means.map((item: IMean) => ({
          ...item,
          isEmpty: false,
          isEdited: false,
          isValid: true,
          isDuplicateMkt: false,
        }))
      );

      setLocalHh(
        faultData.hhs.map((item: IHH) => {
          return {
            ...item,
            isEmpty: false,
            isEdited: false,
            isMktErr: false,
            isDuplicateMkt: false,
          };
        })
      );
    }
  }, [faultData, isHHDescriptionsSuccess]);

  const navToFault = () => {
    goBack();
  };

  const convertMaterialToError = (
    localMaterial: IHHErr | IMeanErr,
    index: number,
    materials: IHHErr[] | IMeanErr[]
  ): IHHErr | IMeanErr => {
    const material = { ...localMaterial };

    material.isEmpty = material.material === "" && material.materialDesc === "";
    material.isDuplicateMkt =
      material.material !== "" &&
      materials.slice(0, index).find((j) => j.material === material.material)
        ? true
        : false;

    return material;
  };

  const saveHHAndEmz = () => {
    const newFault: IFault = {
      ...currentFault,
      hhs: localHh.map(
        ({
          faultNum,
          material,
          materialDesc,
          quantity,
          missingParts,
          sequenceNumber,
        }) =>
          ({
            faultNum,
            material,
            materialDesc,
            quantity,
            missingParts,
            sequenceNumber,
          }) as IHH
      ),
      means: localEmz.map(
        ({
          faultNum,
          material,
          materialDesc,
          quantity,
          missingParts,
          sequenceNumber,
        }) =>
          ({
            faultNum,
            material,
            materialDesc,
            quantity,
            missingParts,
            sequenceNumber,
          }) as IMean
      ),
    };
    updateFaultMutate({ faultData: newFault });
  };

  const saveData = async () => {
    if (!dataChanged) return;

    const emzErrors: IMeanErr[] = [...localEmz].map((emz, index, array) =>
      convertMaterialToError(emz, index, array)
    );

    const hhErrors: IHHErr[] = [...localHh].map((hh, index, array) =>
      convertMaterialToError(hh, index, array)
    );

    const isError: boolean = emzErrors
      .concat(hhErrors)
      .some(
        (material: IHHErr | IMeanErr) =>
          material.isEmpty || material.isDuplicateMkt
      );

    setLocalEmz(emzErrors);
    setLocalHh(hhErrors);

    if (isError) return;

    saveHHAndEmz();
    setDataChanged(false);
  };

  const onMaterialNumberEnter = async (missingPart: IHHErr, index: number) => {
    hHDescriptionByMaterialMutate({
      missingPart: missingPart,
      index: index,
    });
  };

  const onAddEmz = () => {
    setLocalEmz([
      ...localEmz,
      {
        material: "",
        materialDesc: "",
        materialDbDesc: "",
        missingParts: MaterialTypes.NoStatus,
        quantity: 1,
        faultNum: currentFault.faultNum,
        isEmpty: false,
        isEdited: true,
        isValid: true,
        isDuplicateMkt: false,
      } as IMeanErr,
    ]);
  };
  const onAddHh = () => {
    setLocalHh([
      ...localHh,
      {
        material: "",
        materialDesc: "",
        quantity: 1,
        missingParts: MaterialTypes.NoStatus,
        faultNum: currentFault.faultNum,
        isEdited: true,
        isEmpty: false,
        isValid: true,
        isDuplicateMkt: false,
      } as IHHErr,
    ]);
  };
  return (
    <>
      {isGetFaultDataLoading && <Loader />}
      <Toaster />
      {isGetFaultDataSuccess && (
        <HhEmzLayout
          faultNum={faultId}
          navToFault={navToFault}
          pageIsReadOnly={pageIsReadOnly}
          saveData={saveData}
          dataChanged={dataChanged}
        >
          <div className="faultHhEmz">
            <p className="faultHhEmz__title">ח''ח נדרשים</p>

            <div className="faultHhEmz__card">
              {localHh?.map((missingPart, index) => (
                <MissingPartUnit
                  key={index}
                  unit={missingPart}
                  setLocalMaterial={setLocalHh}
                  index={index}
                  options={options}
                  unitType="hh"
                  disabled={pageIsReadOnly}
                  onMaterialNumberEnter={(e) =>
                    onMaterialNumberEnter(missingPart, index)
                  }
                  setDataChanged={setDataChanged}
                />
              ))}
              <button
                className="faultHhEmz__addBtn"
                onClick={() => onAddHh()}
                disabled={pageIsReadOnly}
              >
                <div className="addUnit">
                  <p className="addUnit__txt">+ הוספה</p>
                </div>
              </button>
            </div>

            <p className="faultHhEmz__title">אמצעים נדרשים</p>
            <div className="faultHhEmz__card">
              {localEmz?.map((emz, index) => (
                <MissingPartUnit
                  key={index}
                  unit={emz}
                  setLocalMaterial={setLocalEmz}
                  index={index}
                  options={options}
                  unitType="emz"
                  disabled={pageIsReadOnly}
                  setDataChanged={setDataChanged}
                />
              ))}

              <button
                className="faultHhEmz__addBtn"
                onClick={() => onAddEmz()}
                disabled={pageIsReadOnly}
              >
                <div className="addUnit">
                  <p className="addUnit__txt">+ הוספה</p>
                </div>
              </button>
            </div>
          </div>
        </HhEmzLayout>
      )}
    </>
  );
};

export default FaultHhEmz;
