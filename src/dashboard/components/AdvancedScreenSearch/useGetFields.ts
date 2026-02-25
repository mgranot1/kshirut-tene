import { useMemo } from "react";
import useGetCategories from "../../services/category/useGetCategories";
import useGetScreenCreators from "../../services/screen/useGetScreenCreators";
import { ISearchField } from "../../types/advancedSearch.type";
import { FieldType } from "../../types/filters.types";
import { getCategoryOptions } from "../../utils/category.utils";
import { getScreenCreators } from "../../utils/screen.utils";

export const useGetFields = () => {
  const { data: allCategories } = useGetCategories();
  const { data: screenCreators } = useGetScreenCreators();

  const fields: ISearchField[] = useMemo(() => {
    return [
      {
        fieldKey: "screenName",
        fieldTitle: "שם מסך",
        fieldType: FieldType.TextField,
        options: () => [],
      },
      {
        fieldKey: "screenId",
        fieldTitle: "מזהה מסך",
        fieldType: FieldType.TextField,
        options: () => [],
      },
      {
        fieldKey: "categoryIds",
        fieldTitle: "קטגוריה",
        fieldType: FieldType.Checkbox,
        options: () => getCategoryOptions(allCategories ?? []),
      },
      {
        fieldKey: "creators",
        fieldTitle: "בעלים",
        fieldType: FieldType.Checkbox,
        options: () => getScreenCreators(screenCreators ?? []),
      },
    ];
  }, [screenCreators, allCategories]);

  return fields;
};
