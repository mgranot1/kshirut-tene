import Chip from "../../../shared/components/Chip/Chip";

interface IFilterChipProps {
  headerText: string;
  isNotEqual?: boolean;
  value: string;
  onDelete: () => void;
}

const FilterChip: React.FC<IFilterChipProps> = (props) => {
  return (
    <Chip
      text={props.headerText}
      action="delete"
      onAction={props.onDelete}
      filterOptions={{ boldedText: props.value, isNotEqual: props.isNotEqual }}
    />
  );
};

export default FilterChip;
