import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { useCurrentPath } from "../../../shared/hooks/useCurrentPath";
import { useComponentFilters } from "../../hooks/useComponentFilters";
import { useCreateComponentSetting } from "../../services/component/useCreateComponentSetting";
import { useGetComponentData } from "../../services/component/useGetComponentData";
import { useGetComponentSetting } from "../../services/component/useGetComponentSetting";
import { useUpdateComponentSetting } from "../../services/component/useUpdateComponentSetting";
import { ComponentSettingMode } from "../../stores/componentSettingMode.store";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import {
  ComponentType,
  RangePercent,
  TComponentFilters,
  TComponentSetting,
} from "../../types/component.types";
import { emptyOrganizationalLevel } from "../../types/dashboardOrgLevel.types";
import { IDashboardFiltersValue } from "../../types/filters.types";
import MultiStepPopUp from "../MultiStepPopUp/MultiStepPopUp";
import ComponentFilterSetting from "./ComponentFilterSetting";
import ComponentTypeSetting from "./ComponentTypeSetting";
import FreeTextEditorStep from "../FreeTextCard/FreeTextEditorStep";

interface IComponentSettingProps {
  mode: ComponentSettingMode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  componentId: string;
}

export const defaultComponentSettingForm: TComponentSetting = {
  id: "",
  name: "",
  type: ComponentType.Pie,
  compColumn: 0,
  compRow: 0,
  orgLevel: { ...emptyOrganizationalLevel },
  filters: [],
  rangePercent: {
    toSevereThreshold: 60,
    toWarningThreshold: 80,
  } as RangePercent,
};

const ComponentSetting = ({
  open,
  setOpen,
  mode,
  componentId,
}: IComponentSettingProps) => {
  const screenId = useCurrentPath();
  const kshirutType = useRecoilValue(kshirutTypeState);
  const [componentSettingForm, setComponentSettingForm] =
    useState<TComponentSetting>(defaultComponentSettingForm);
  const { componentFiltersFields } = useComponentFilters();
  const { refetch: refetchComponentTitle } = useGetComponentData(
    componentId,
    kshirutType.value
  );
  const { mutate: mutateCreateComponentSetting } = useCreateComponentSetting();
  const onComponentUpdateSuccess = () => {
    refetchComponentTitle();
  };
  const { mutate: mutateUpdateComponentSetting } = useUpdateComponentSetting({
    onSuccess: onComponentUpdateSuccess,
  });
  const { data: componentSetting, isSuccess } =
    useGetComponentSetting(componentId);

  const handleSubmit = (mode: ComponentSettingMode) => {
    const isFreeTextType = componentSettingForm.type === ComponentType.FreeText;
    if (
      !componentSettingForm.name ||
      (!isFreeTextType && !componentSettingForm.orgLevel[0].length)
    ) {
      toast.error("מלא שדות חובה");
      throw new Error("error");
    }
    setOpen(false);

    const payload = componentSettingForm;

    if (mode === ComponentSettingMode.New) {
      mutateCreateComponentSetting({
        screenId: screenId,
        componentSetting: payload,
      });
      setComponentSettingForm(defaultComponentSettingForm);
    } else if (mode === ComponentSettingMode.Edit) {
      mutateUpdateComponentSetting({
        screenId: screenId,
        componentSetting: payload,
      });
      setComponentSettingForm(defaultComponentSettingForm);
    }
  };

  const typeStep = {
    title: "הגדרת רכיב חדש",
    content: (
      <ComponentTypeSetting
        componentSettingForm={componentSettingForm}
        setComponentSettingForm={setComponentSettingForm}
      />
    ),
  };

  const filterStep = {
    title:
      mode === ComponentSettingMode.Edit
        ? "הגדרת רכיב"
        : mode === ComponentSettingMode.View
          ? "הגדרות רכיב"
          : "הגדרת רכיב חדש",
    content: (
      <ComponentFilterSetting
        mode={mode}
        componentSettingForm={componentSettingForm}
        setComponentSettingForm={setComponentSettingForm}
      />
    ),
  };

  const freeTextStep = {
    title: "עריכת טקסט חופשי",
    content: (
      <FreeTextEditorStep
        componentSettingForm={componentSettingForm}
        setComponentSettingForm={setComponentSettingForm}
      />
    ),
  };

  const isFreeText = componentSettingForm.type === ComponentType.FreeText;

  const steps =
    mode === ComponentSettingMode.New
      ? isFreeText
        ? [typeStep, freeTextStep]
        : [typeStep, filterStep]
      : isFreeText
        ? [freeTextStep]
        : [filterStep];

  const completeFieldTexts = async (
    filters: IDashboardFiltersValue<TComponentFilters>[]
  ) => {
    const selectedFiltersPromise = filters.map(async (filter) => {
      const componentFilters = componentFiltersFields.find(
        (field) => field.fieldKey === filter.fieldKey
      );

      const filterOptions = await componentFilters?.options();

      return {
        ...filter,
        fieldTitle: componentFilters?.fieldTitle ?? "",
        values: filter.values.map((val) => {
          const text = filterOptions?.length
            ? (filterOptions.find((o) => o.value === val.value)?.text ?? "")
            : val.value;

          return {
            ...val,
            text: text,
          };
        }),
      };
    });

    const res = await Promise.all(selectedFiltersPromise);
    let newFilters: IDashboardFiltersValue<TComponentFilters>[] = [];
    res.forEach((field) =>
      newFilters.push(field as IDashboardFiltersValue<TComponentFilters>)
    );

    return newFilters;
  };

  const handleClose = () => {
    setOpen((prev) => !prev);
    setComponentSettingForm(defaultComponentSettingForm);
  };

  useEffect(() => {
    const completeComponentSetting = async () => {
      if (isSuccess) {
        const filters = await completeFieldTexts(componentSetting.filters);
        setComponentSettingForm({ ...componentSetting, filters: filters });
      }
    };

    completeComponentSetting();
  }, [JSON.stringify(componentSetting), isSuccess]);

  return (
    <MultiStepPopUp
      open={open}
      steps={steps}
      onClose={handleClose}
      onSubmit={() => {
        handleSubmit(mode);
      }}
      height="50vh"
      isEditMode={mode !== ComponentSettingMode.View}
      disable={mode === ComponentSettingMode.View}
    />
  );
};

export default ComponentSetting;
