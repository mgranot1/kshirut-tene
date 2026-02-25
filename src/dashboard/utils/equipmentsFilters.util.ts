import { Params } from "../../shared/services/param/useGetValuesRange";
import { ParamKey } from "../../shared/types/params.types";
import { IOptionVal } from "../types/filters.types";
import { MaterialDescription } from "../types/material.types";

export const getFilterOptionsFromParams = async (
  params: Params,
  param: ParamKey,
  excludeValues?: Array<string>
): Promise<IOptionVal[]> => {
  let paramOptions = params[param];
  if (excludeValues)
    paramOptions = paramOptions.filter((o) => !excludeValues.includes(o.value));

  return paramOptions.map((option) => ({
    text: option.label,
    value: option.value,
  }));
};

export const getMaterialsOptions = async (
  materials: MaterialDescription[] | undefined
): Promise<IOptionVal[]> => {
  return materials
    ? materials.map((md) => ({
        text: `${md.material} - ${md.materialDesc}`,
        value: md.material,
        isNotEqual: false,
      }))
    : [];
};
