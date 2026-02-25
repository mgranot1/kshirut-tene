import { AdvancedSearch } from "../AdvancedSearch/AdvancedSearch";
import { useGetFields } from "./useGetFields";

export const AdvancedScreenSearch = ({}) => {
  const fields = useGetFields();

  return (
    <div className="advanced-screen-search">
      <AdvancedSearch fields={fields} searchTitle={"חפש מסך"} />
    </div>
  );
};
