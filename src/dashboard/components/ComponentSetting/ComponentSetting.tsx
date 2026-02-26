import { Dispatch, SetStateAction, useEffect, useState, ReactElement } from "react";
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
  TComponentFilters,
  TComponentSetting,
} from "../../types/component.types";
import { IDashboardFiltersValue } from "../../types/filters.types";
import MultiStepPopUp from "../MultiStepPopUp/MultiStepPopUp";
import ComponentFilterSetting from "./ComponentFilterSetting";
import { DEFAULT_COMPONENT_SETTING_FORM, FILTER_STEP_TITLES } from "./ComponentSetting.constants";
import ComponentTypeSetting from "./ComponentTypeSetting";
import FreeTextEditorStep from "../FreeTextCard/FreeTextEditor";

interface IComponentSettingProps {
  mode: ComponentSettingMode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  componentId: string;
}

type Step = {
  title: string;
  content: ReactElement;
  validate?: () => boolean;
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
    useState<TComponentSetting>(DEFAULT_COMPONENT_SETTING_FORM);
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
    const steps = getStepsByScreenMode();
    const isValid = steps.every((step) => !step.validate || step.validate());

    if (!isValid) {
      throw new Error("Validation failed");
    }

    setOpen(false);

    const payload = componentSettingForm;

    if (mode === ComponentSettingMode.New) {
      mutateCreateComponentSetting({
        screenId: screenId,
        componentSetting: payload,
      });
      setComponentSettingForm(DEFAULT_COMPONENT_SETTING_FORM);
    } else if (mode === ComponentSettingMode.Edit) {
      mutateUpdateComponentSetting({
        screenId: screenId,
        componentSetting: payload,
      });
      setComponentSettingForm(DEFAULT_COMPONENT_SETTING_FORM);
    }
  };


  const selectComponentTypeStep: Step = {
    title: FILTER_STEP_TITLES[mode],
    content: (
      <ComponentTypeSetting
        componentSettingForm={componentSettingForm}
        setComponentSettingForm={setComponentSettingForm}
      />
    ),
    validate: () => {
      if (!componentSettingForm.type) {
        toast.error("מלא שדות חובה");
        return false;
      }
      return true;
    },

  };

  const selectFiltersStep: Step = {
    title: FILTER_STEP_TITLES[mode],
    content: (
      <ComponentFilterSetting
        mode={mode}
        componentSettingForm={componentSettingForm}
        setComponentSettingForm={setComponentSettingForm}
      />
    ),
    validate: () => {
      if (!componentSettingForm.name || !componentSettingForm.orgLevel[0].length) {
        toast.error("מלא שדות חובה");
        return false;
      }
      return true;
    },
  };

  const freeTextStep: Step = {
    title: FILTER_STEP_TITLES[mode],
    content: (
      <FreeTextEditorStep
        mode={mode}
        componentSettingForm={componentSettingForm}
        setComponentSettingForm={setComponentSettingForm}
      />
    ),
    validate: () => {
      if (!componentSettingForm.name) {
        toast.error("מלא שדות חובה");
        return false;
      }
      return true;
    },
  };

  const stepsByComponentType: Record<ComponentType, Step[]> = {
    [ComponentType.Pie]: [selectComponentTypeStep, selectFiltersStep],
    [ComponentType.PieWithExpected]: [selectComponentTypeStep, selectFiltersStep],
    [ComponentType.FreeText]: [selectComponentTypeStep, freeTextStep],
  }
  const getStepsByScreenMode = (): Step[] => {

    if (mode === ComponentSettingMode.New) {
      return stepsByComponentType[componentSettingForm.type]
    }
    return stepsByComponentType[componentSettingForm.type].slice(1)
  };

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
    setComponentSettingForm(DEFAULT_COMPONENT_SETTING_FORM);
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
      steps={getStepsByScreenMode().map(({ title, content }) => ({ title, content }))}
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
