import { MRT_ColumnDef, MRT_RowData } from "material-react-table";
import React, { useMemo } from "react";
import toast from "react-hot-toast";
import { queryClient } from "../../queryClient";
import { QueryKeys } from "../../shared/types/query.types";
import useDeleteVariant from "../services/variant/useDeleteVariant";
import useGetTableVariants from "../services/variant/useGetTableVariant";
import useUpsertVariant from "../services/variant/useUpsertVariant";
import {
  IVariant,
  IVariantConfiguration,
  TableVariant,
  TableVariantBase,
  TableVariantValues,
  VariantType,
} from "../types/variant.types";
import {
  convertIVariantToTableVariant,
  convertTableVariantToIVariant,
} from "../utils/tableVariant.utils";

/*
~ hook useTableVariants
    handles the usage of table variants across the application including adding, removing and switching table variants.
    tableId is a parameter given to the hook as the identifier for the table for which to get the variants
*/
export const useTableVariants = <T extends MRT_RowData>(
  tableId: string,
  columns: MRT_ColumnDef<T>[],
  options?: {
    onVariantChange?: <B extends TableVariant<T>>(data: { variant: B }) => void;
    onVariantAdd?: <B extends TableVariant<T>>(data: { newVariant: B }) => void;
    onVariantEdit?: <B extends TableVariant<T>>(data: {
      changedVariant: B;
    }) => void;
    onVariantDelete?: (data: { variantId: number }) => void;
    onVariantClear?: () => void;
    onLoad?: () => void;
  }
) => {
  const isInitialized = React.useRef<boolean>(false);
  const { data: variants, isFetched } = useGetTableVariants(tableId);
  const [activeVariantId, setActiveVariantId] = React.useState<
    TableVariant<T>["variantId"] | null
  >(null);

  const { mutateAsync: upsertVariantRequest } = useUpsertVariant(() => {});
  const { mutateAsync: deleteVariantRequest } = useDeleteVariant(() => {});

  React.useEffect(() => {
    if(isInitialized.current === false && isFetched) {
      isInitialized.current = true;
      options?.onLoad?.();
    }
  },[isFetched])

  // A variant with the default values attached.
  // It's the variant given on application startup before the user selects a new variant
  const initialVariant = useMemo<
    Omit<TableVariantBase<T>, "values"> & {
      values: Required<TableVariantValues<T>>;
    }
  >(() => {
    const columnOrder = columns.reduce(
      (idList: string[], column) =>
        column.id ? [...idList, column.id] : idList,
      []
    );
    return {
      isDefault: false,
      isGlobal: false,
      type: VariantType.table,
      variantDescription: "",
      values: {
        tableId,
        columnOrder,
      },
    };
  }, []);

  /*
~ function getVariant
  a getter for a variant by it's index in the variantList
  Takes the just addedVariant in account
*/
  function getVariant(id: number): TableVariant<T> {
    const variant = (
      queryClient.getQueryData([
        QueryKeys.GetVariants,
        VariantType.table,
        tableId,
      ]) as TableVariant<T>[]
    ).find((variant) => variant.variantId == id);
    if (!variant) {
      throw "Variant Not Found !";
    }
    return variant;
  }

  /*
~ function createVariant
   private 
   creates a new Table Variant.
*/
  async function createVariant(
    name: string,
    configurations?: Partial<IVariantConfiguration> & { variantId?: number },
    values?: Partial<Omit<TableVariantValues<T>, "tableId">>
  ): Promise<TableVariant<T> | undefined> {
    const newVariant: TableVariantBase<T> = {
      isDefault: false,
      isGlobal: false,
      ...configurations,
      type: VariantType.table,
      variantDescription: name,
      values: {
        tableId: tableId,
        columnOrder: values?.columnOrder,
      },
    };
    const createdVariant = await toast.promise(
      upsertVariantRequest(convertTableVariantToIVariant(newVariant)),
      {
        error: "תקלה בהוספת וריאנט",
        loading: "יוצר וריאנט...",
        success: "הוריאנט נוצר בהצלחה !",
      }
    );
    const convertedVariant = !createdVariant
      ? undefined
      : convertIVariantToTableVariant<T>(createdVariant, tableId);
    return convertedVariant;
  }

  /*
~ function updateVariant
   private 
   updates the selected Table Variant on server.
*/
  async function updateVariant(
    variantId: number,
    configurations?: Partial<IVariantConfiguration>,
    values?: Partial<Omit<TableVariantValues<T>, "tableId">>
  ): Promise<TableVariant<T> | undefined> {
    const updateVariant: TableVariant<T> = {
      isDefault: false,
      isGlobal: false,
      variantDescription: "",
      ...configurations,
      type: VariantType.table,
      values: {
        tableId: tableId,
        columnOrder: values?.columnOrder,
      },
      variantId,
    };

    const updatedVariant = await toast.promise(
      upsertVariantRequest(convertTableVariantToIVariant(updateVariant)),
      {
        error: "תקלה בעריכת וריאנט",
        loading: "עורך וריאנט...",
        success: "הוריאנט נערך בהצלחה !",
      }
    );

    const convertedVariant = !updatedVariant
      ? undefined
      : convertIVariantToTableVariant<T>(updatedVariant, tableId);
    return convertedVariant;
  }

  /*
~ function deleteVariant
*/
  async function deleteVariant(
    variantId: IVariant["variantId"]
  ): Promise<void> {
    let index =
      variants?.findIndex((variant) => variant.variantId == variantId) ?? -1;
    if (index !== -1) {
      await toast.promise(deleteVariantRequest(variantId), {
        success: "הוריאנט נמחק",
        error: "מחיקת הוריאנט נכשלה",
        loading: "מוחק את הוריאנט...",
      });
    }
    queryClient.setQueryData(
      [QueryKeys.GetVariants, VariantType.table, tableId],
      (prev: TableVariant<T>[]) => [...prev.slice(0,index), ...prev.slice(index+1) ]
    );
    options?.onVariantDelete?.({ variantId });
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.GetVariants, VariantType.table, tableId],
    });
    applyVariant(null);
  }

  /*
~ function switchToVariant 
    Makes the chosen variant the active one
*/
  function switchToVariant(variantId: number | null): void {
    setActiveVariantId(variantId);
  }

  /*
~ function applyVariant
  responsible for the order of operation for the process of changing a variant and
  updating the hook states accordingly
*/
  function applyVariant(variantId: number | null) {
    switchToVariant(variantId);
    if (variantId == null) {
      options?.onVariantClear?.();
      return;
    }
    options?.onVariantChange?.({
      variant: getVariant(variantId),
    });
  }

  /*
~ function addVariant
  responsible for the order of operation for the process of adding a new variant and
  updating the hook states accordingly
*/
  async function addVariant(
    name: string,
    configurations?: Partial<IVariantConfiguration>,
    values?: Partial<Omit<TableVariantValues<T>, "tableId">>
  ): Promise<{ variant: TableVariant<T> }> {
    const addedVariant = await createVariant(name, configurations, values);
    if (!addedVariant) {
      const message = "שגיאה ביצירת וריאנט";
      throw message;
    }
    queryClient.setQueryData(
      [QueryKeys.GetVariants, VariantType.table, tableId],
      (prev: TableVariant<T>[]) => [...prev, addedVariant]
    );
    options?.onVariantAdd?.({
      newVariant: addedVariant,
    });
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.GetVariants, VariantType.table, tableId],
    });
    return { variant: addedVariant };
  }

  /*
~ function editVariant
  responsible for the order of operation for the process of editing a variant and
  updating the table accordingly
  */
  async function editVariant(
    id: number,
    configurations?: Partial<IVariantConfiguration>,
    values?: Partial<TableVariantValues<T>>
  ): Promise<{ variant: TableVariant<T> }> {
    const originalVariant = getVariant(id);

    const updatedVariant = await updateVariant(
      originalVariant.variantId,
      { ...originalVariant, ...configurations },
      { ...originalVariant.values, ...values }
    );

    if (!updatedVariant) {
      const message = "שגיאה בעדכון וריאנט";
      throw message;
    }
    const variantIndex = variants.findIndex(
      (variant) => variant.variantId == id
    );
    variantIndex !== -1 &&
      queryClient.setQueryData(
        [QueryKeys.GetVariants, VariantType.table, tableId],
        (prev: TableVariant<T>[]) => [
          ...prev.slice(0, variantIndex),
          updatedVariant,
          ...prev.slice(variantIndex + 1),
        ]
      );
    options?.onVariantEdit?.({ changedVariant: updatedVariant });
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.GetVariants, VariantType.table, tableId],
    });

    return { variant: updatedVariant };
  }

  return {
    variantList: variants,
    activeVariantId,
    getVariant,
    deleteVariant,
    switchToVariant,
    applyVariant,
    addVariant,
    editVariant,
    initialVariant,
  };
};

export default useTableVariants;
