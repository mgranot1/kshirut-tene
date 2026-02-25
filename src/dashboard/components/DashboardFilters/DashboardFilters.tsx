import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { ReactElement, useEffect, useRef, useState } from "react";
import { IFilterStructure } from "../../hooks/useDbdFilters";
import {
  FieldType,
  IDashboardFiltersValue,
  IFilterField,
  IFilterOption,
  IOptionVal,
} from "../../types/filters.types";
import "./DashboardFilters.scss";
import FilterField from "./FilterField";

interface IDashboardFiltersProps<T> {
  title: string | ReactElement;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fields: IFilterStructure<T>[];
  selectedFilters: IDashboardFiltersValue<T>[];
  setSelectedFilters: (newFilters: IDashboardFiltersValue<T>[]) => void;
  actionButtonText?: string;
  updateFiltersOnChange?: (
    filters: IDashboardFiltersValue<T>[]
  ) => IDashboardFiltersValue<T>[];
  onCancel?: () => void;
}

function DashboardFilters<T>(props: IDashboardFiltersProps<T>) {
  const [filterFields, setFilterFields] = useState<IFilterField<T>[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [filterTree, setFilterTree] = useState<IFilterStructure<T>[]>(
    props.fields
  );
  let optionsCache = useRef<Record<string, IFilterOption[]>>({});
  const collectLeafNodes = (
    filterTree: IFilterStructure<T>[]
  ): IFilterStructure<T>[] => {
    const result: IFilterStructure<T>[] = [];

    for (const node of filterTree) {
      if (node.fieldKey) {
        result.push(node);
      } else if (node.children) {
        result.push(...collectLeafNodes(node.children));
      }
    }

    return result;
  };

  useEffect(() => {
    const handleFilterUpdate = async () => {
      const result = await fetchFilterTreeOptions(props.fields, searchTerm);

      setFilterTree(result);
    
      if (searchTerm) {
        const getExpandedCategories = (
          structure: IFilterStructure<T>[]
        ): Record<string, boolean> => {
          const expanded: Record<string, boolean> = {};
          for (const node of structure) {
            if (!node.fieldKey && node.children) {
              expanded[node.id] = true;
              const childExpanded = getExpandedCategories(node.children);
              Object.assign(expanded, childExpanded);
            }
          }
          return expanded;
        };
        setExpandedCategories(getExpandedCategories(result));
      } else {
        const initialExpanded = getInitialExpandedCategories(result);
        setExpandedCategories(initialExpanded);
      }
    };

    handleFilterUpdate();
  }, [searchTerm, props.fields]);
  useEffect(() => {
    const initFields = async () => {
      // Traverse the entire structure to find all leaf nodes (with fieldKey)
      const leafNodes = collectLeafNodes(props.fields);
      const resolvedFields = await Promise.all(
        leafNodes.map(async (node) => {
          const rawOptions = await node.options!();

          const options: IFilterOption[] = rawOptions.map((o) => ({
            optionTitle: o.text,
            optionValue: o.value,
            isSelected: false,
            isNotEqual: o.isNotEqual ?? false,
          }));

          const vals =
            props.selectedFilters.find((fi) => fi.fieldKey === node.fieldKey)
              ?.values ?? [];

          const selectedOptions = options.map((opt) => {
            const isSelected = vals.some((v) => v.value === opt.optionValue);
            const isNotEqual =
              vals.find((v) => v.value === opt.optionValue)?.isNotEqual ??
              false;

            return {
              ...opt,
              isSelected,
              isNotEqual,
            };
          });

          return {
            fieldKey: node.fieldKey!,
            fieldTitle: node.fieldTitle!,
            fieldType: node.fieldType!,
            dateOptions: node.dateOptions,
            isExpanded: false,
            options: selectedOptions,
          } as IFilterField<T>;
        })
      );

      setFilterFields(resolvedFields);
    };

    initFields();
  }, [props.fields, props.selectedFilters]);
  const getInitialExpandedCategories = (
    structure: IFilterStructure<T>[]
  ): Record<string, boolean> => {
    const expanded: Record<string, boolean> = {};
    for (const node of structure) {
      if (node.isExpanded) {
        expanded[node.id] = true;
      }
      if (!node.fieldKey && node.children) {
        const childExpanded = getInitialExpandedCategories(node.children);
        Object.assign(expanded, childExpanded);
      }
    }
    return expanded;
  };
  const changeField = (
    fieldName: string,
    fieldOption: string,
    value: string | boolean | Date | number
  ) => {
    setFilterFields((oldFields) => {
      let res;

      const isExist = oldFields.find(
        (fi) =>
          fi.fieldTitle === fieldName &&
          fi.options.find((op) => op.optionTitle === fieldOption)
      );

      const updatedFields = oldFields.map((field) => {
        return field.fieldTitle === fieldName
          ? ({
              ...field,
              options: isExist
                ? field.options.map((option) => {
                    return option.optionTitle === fieldOption
                      ? ({
                          ...option,
                          isSelected: !option.isSelected,
                        } as IFilterOption)
                      : option;
                  })
                : [
                    ...field.options,
                    {
                      optionTitle: fieldOption,
                      optionValue: value,
                      isSelected: true,
                    },
                  ],
            } as IFilterField<T>)
          : field;
      });

      // get additional filters depending on curr filters select( for example platforms and subPlatforms for family field)
      if (props.updateFiltersOnChange) {
        const filters = props.updateFiltersOnChange(
          getSelectedFilters(updatedFields)
        );
        res = updatedFields.map((filter: IFilterField<T>) => {
          const currField = filters.find((f) => f.fieldKey === filter.fieldKey);

          return {
            ...filter,
            options: filter.options.map((opt) => {
              const isValueExist = currField?.values.some(
                (o) => o.value === opt.optionValue
              );

              return { ...opt, isSelected: isValueExist };
            }),
          };
        });

        return res;
      }

      return updatedFields;
    });
  };

  const changeExpanded = (fieldName: string) => {
    setFilterFields((oldFields) => {
      return oldFields.map((field) => ({
        ...field,
        isExpanded: field.fieldTitle === fieldName ? !field.isExpanded : false,
      }));
    });
  };

  const clearFilters = () => {
    setFilterFields((curr) => {
      return curr.map((field) => {
        return {
          ...field,
          isExpanded: false,
          options: field.options.map((opt) => ({ ...opt, isSelected: false })),
        };
      });
    });
  };

  const cancelAction = () => {
    clearFilters();
    props.setIsOpen(false);
  };

  /*
~function getSelectedFilters:
  Takes a list of filters, and returns only filters with the isSelected property set to true 
*/
  const getSelectedFilters = (filters: IFilterField<T>[]) => {
    return filters.reduce(
      (accField: IDashboardFiltersValue<T>[], field: IFilterField<T>) => {
        const vals = field.options.reduce(
          (acc: IOptionVal[], curr: IFilterOption) => {
            if (curr.isSelected)
              acc.push({
                text: curr.optionTitle,
                value: curr.optionValue,
                isNotEqual: curr.isNotEqual ?? false,
              });
            return acc;
          },
          []
        );
        if (vals.length > 0)
          accField.push({
            fieldKey: field.fieldKey,
            fieldTitle: field.fieldTitle,
            values: vals,
          });
        return accField;
      },
      []
    );
  };

  const applyFilters = async () => {
    const newFilters = getSelectedFilters(filterFields);

    try {
      props.setSelectedFilters(newFilters);
      cancelAction();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const fetchFilterTreeOptions = async (
    structure: IFilterStructure<T>[],
    searchTerm: string
  ): Promise<IFilterStructure<T>[]> => {
    const resolvedNodes = await Promise.all(
      structure.map(async (node) => {
        // filter case
        if (node.fieldKey) {
          // cached option case
          if (optionsCache.current[node.id]) {
            const cachedOptions = optionsCache.current[node.id];
            const isMatchingTitle = node.fieldTitle?.includes(searchTerm);
            const isMatchingOptions = cachedOptions.some((opt) =>
              opt.optionTitle.includes(searchTerm)
            );
            if (isMatchingTitle || isMatchingOptions) {
              return node;
            }
            return null;
            // uncached option case
          } else {
            const rawOptions = await node.options!();
            const mappedOptions = rawOptions.map((option) => ({
              optionTitle: option.text,
              optionValue: option.value,
              isSelected: false,
              isNotEqual: option.isNotEqual ?? false,
            }));
            optionsCache.current[node.id] = mappedOptions;
            const isMatchingTitle = node.fieldTitle?.includes(searchTerm);
            const isMatchingOptions = mappedOptions.some((opt) =>
              opt.optionTitle.includes(searchTerm)
            );
            if (isMatchingTitle || isMatchingOptions) {
              return node;
            }
            return null;
          }
          // category case
        } else {
          const children = await fetchFilterTreeOptions(
            node.children ?? [],
            searchTerm
          );
          if (children.length > 0) {
            return {
              ...node,
              children,
            };
          }
          return null;
        }
      })
    );
    return resolvedNodes.filter(
      (node): node is IFilterStructure<T> => node !== null
    );
  };

  const renderFilterTree = (structure: IFilterStructure<T>[], depth = 0) => {
    const indent = depth * 1.5; // Indent per hierarchy level

    return (
      <>
        {structure.map((node) => {
          if (node.fieldKey) {
            const field = filterFields.find(
              (f) => f.fieldKey === node.fieldKey
            );
            if (!field) return null;

            return (
              <FilterField
                key={node.id}
                field={field}
                changeField={changeField}
                changeExpanded={changeExpanded}
                disabled={
                  field.fieldType === FieldType.Checkbox &&
                  field.options.length === 0
                }
              />
            );
          } else {
            const isExpanded = expandedCategories[node.id] ?? false;

            return (
              <div key={node.id} className="DashboardFilters__category">
                <h3 onClick={() => toggleCategory(node.id)}>
                  {node.category}
                  <span className="expand-icon">
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </span>
                </h3>
                <div
                  className="DashboardFilters__subCategory"
                  style={{ paddingLeft: `${indent + 1}rem` }}
                >
                  {isExpanded &&
                    node.children &&
                    renderFilterTree(node.children, depth + 1)}
                </div>
              </div>
            );
          }
        })}
      </>
    );
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        props.onCancel && props.onCancel();
        cancelAction();
      }}
    >
      <div className="DashboardFilters">
        <div className="DashboardFilters__header">
          <p>{props.title}</p>
          <button
            className="DashboardFilters__secondaryBtn"
            onClick={clearFilters}
          >
            נקה הכל
          </button>
        </div>
        <hr />
        <div className="DashboardFilters__search">
          <input
            type="text"
            placeholder="חפש סינון..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="DashboardFilters__content">
          {renderFilterTree(filterTree)}
        </div>
        <hr />
        <div className="DashboardFilters__footer">
          <button
            className="DashboardFilters__secondaryBtn"
            onClick={() => {
              props.onCancel && props.onCancel();
              cancelAction();
            }}
          >
            ביטול
          </button>
          <button
            className="DashboardFilters__primaryBtn DashboardFilters__applyBtn"
            onClick={applyFilters}
          >
            {props.actionButtonText ?? "החלת סינונים"}
          </button>
        </div>
      </div>
    </ClickAwayListener>
  );
}

export default DashboardFilters;
