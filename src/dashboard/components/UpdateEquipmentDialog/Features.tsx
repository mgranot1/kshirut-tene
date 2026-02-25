import Button from "@mui/material/Button";
import { useEffect, useMemo, useState } from "react";
import { IOption } from "../../../shared/types/general.types";
import {
  EmptyFeatureKey,
  Feature,
  FeatureMap,
  FeatureMapElement,
  OptionsForAFeature,
} from "../../types/updateEquipment.type";
import FeatureRow, { IFeatureRow } from "./FeatureRow";
import "./Features.scss";

interface IFeaturesProps<T extends string> {
  featureMap: FeatureMap<T>;
  features: Feature<T>[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature<T>[]>>;
}

const Features = <T extends string>({
  featureMap,
  features,
  setFeatures,
}: IFeaturesProps<T>) => {
  const [optionsForFeature, setOptionsForFeature] = useState<
    OptionsForAFeature<T>
  >({} as OptionsForAFeature<T>);

  const addFeature = () => {
    setFeatures((prev) => [...prev, { id: "" } as Feature<T>]);
  };

  const deleteFeature = (featureToDlt: T | EmptyFeatureKey) => {
    const indexToDelete = features.findIndex((f) => f.id === featureToDlt);
    setFeatures(
      (prev) =>
        [
          ...prev.slice(0, indexToDelete),
          ...prev.slice(indexToDelete + 1),
        ] as Feature<T>[]
    );
  };

  const featuresList = useMemo<FeatureMapElement<T>[]>(
    () => Object.values(featureMap),
    [featureMap]
  );

  useEffect(() => {
    const getOptions = async () => {
      try {
        const optionList: OptionsForAFeature<T> = {} as OptionsForAFeature<T>;
        const getOptions = Object.values(featureMap).map(
          async (featureInfo: FeatureMapElement<T>) => {
            if (featureInfo.id === "" || !featureInfo.options) return;
            optionList[featureInfo.id] = await featureInfo.options();
          }
        );

        await Promise.all(getOptions);

        setOptionsForFeature(optionList);
      } catch (error) {
        console.error(error);
      }
    };
    getOptions();
  }, []);

  const handleSelectFeature = (
    selectedFeature: T | EmptyFeatureKey,
    featureIndex: number
  ) => {
    setFeatures(
      features.map((feature, index) =>
        index === featureIndex ? { id: selectedFeature, value: "" } : feature
      )
    );
  };

  const handleSelectFeatureValue = (
    id: T | EmptyFeatureKey,
    newValue: string
  ) => {
    setFeatures(
      features.map((feature) =>
        feature.id === id ? { id, value: newValue } : feature
      )
    );
  };

  return (
    <div className="features">
      <div className="features__list">
        {features.map((chosenFeature, index) => {
          const currFeatureInfo = featuresList.find(
            (featureInfo) => featureInfo.id === chosenFeature.id
          );
          if (!currFeatureInfo) {
            return;
          }

          const availableOptions =
            chosenFeature.id !== ""
              ? featuresList.filter((featureInfo) => featureInfo.id !== "")
              : featuresList;

          const featureOptions: IOption[] = availableOptions
            .filter((option) => {
              return (
                option.id === chosenFeature.id ||
                !features.some(
                  (selectedFeature) => selectedFeature.id === option.id
                )
              );
            })
            .map((feature) => ({ label: feature.title, value: feature.id }));

          const valOptions = optionsForFeature[currFeatureInfo.id] ?? null;

          /* This const is responsible for the type of text field the FeatureRow will use.
          /  It sets the correct props for the FeatureRow render */  
          const onInputType: Pick<IFeatureRow,'options'|'onFeatureValueSelect'|'currValue'> | Pick<IFeatureRow,'onFeatureFreeTextValueType'|'currValue'|'options'|'textFieldProps'> = valOptions ?
           { //If we have options field, than it is a autocomplete type of field
            options: valOptions,
            onFeatureValueSelect: (newVal) => handleSelectFeatureValue(chosenFeature.id, newVal.value),
            currValue: valOptions.find(
              (valOpt) => valOpt.value === chosenFeature.value
            ) ?? { label: "", value: "" }
          } :
          { //If we have no options field, than it is a free text
            onFeatureFreeTextValueType: ( feature, newVal ) => handleSelectFeatureValue(chosenFeature.id,newVal),
            currValue: features.find(feature => feature.id === chosenFeature.id )?.value ?? "",
            options: null,
            textFieldProps: { inputProps: { maxLength: currFeatureInfo.config?.maxLength } }
          }

          return (
            <FeatureRow
              key={`${chosenFeature.id}-${index}`}
              index={index}
              currFeature={
                featureOptions.find(
                  (featureOption) => featureOption.value === chosenFeature.id
                ) ?? { label: "", value: "" }
              }
              featureOptions={featureOptions}
              onFeatureDelete={() => deleteFeature(chosenFeature.id)}
              onFeatureSelect={(selectedFeature) =>
                handleSelectFeature(
                  selectedFeature.value as T | EmptyFeatureKey,
                  index
                )
              }
              {...onInputType}
            />
          );
        })}
      </div>
      <Button
        className="features__button"
        disabled={features.length >= featuresList.length - 1}
        onClick={addFeature}
      >
        + הוספת מאפיין
      </Button>
    </div>
  );
};

export default Features;
