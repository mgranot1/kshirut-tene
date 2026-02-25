import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  catalogSearchAtom,
  INITIAL_SEARCH_FEILDS,
} from "../stores/catalogSearch.store";
import { SearchFields } from "../types/advancedSearch.type";

export const useAdvancedSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFieldsAtom, setSearchFieldsAtom] =
    useRecoilState(catalogSearchAtom);
  const [searchFields, setSearchFields] = useState<SearchFields>(
    INITIAL_SEARCH_FEILDS
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setSearchFields(searchFieldsAtom);
  }, []);

  useEffect(() => {
    setSearchFields(searchFieldsAtom);
  }, [searchFieldsAtom, isOpen]);

  const handleInputChange = useCallback(
    (field: keyof SearchFields, value: string) => {
      // On click "clear..."
      if (!value) {
        setSearchFields((prev) => ({
          ...prev,
          [field]: [],
        }));
      } else if (field === "categoryIds" || field === "creators") {
        setSearchFields((prev) => {
          const exists = prev[field].includes(value);

          return {
            ...prev,
            [field]: exists
              ? prev[field].filter((v) => v != value)
              : [...prev[field], value],
          };
        });
      } else {
        setSearchFields((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    },
    []
  );

  const handleSearch = useCallback(() => {
    setSearchFieldsAtom(searchFields);
    closeSearch();
  }, [searchFields, setSearchFieldsAtom, closeSearch]); //,

  const handleReset = useCallback(() => {
    setSearchFields({ ...INITIAL_SEARCH_FEILDS });
    setSearchFieldsAtom(INITIAL_SEARCH_FEILDS);
  }, []);

  return {
    isOpen,
    setIsOpen,
    searchFields,
    toggleOpen,
    handleInputChange,
    handleSearch,
    handleReset,
  };
};
