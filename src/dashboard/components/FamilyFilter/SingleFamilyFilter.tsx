import "./SingleFamilyFilter.scss";

interface ISingleFamilyFilterProps {
  title: string;
  code: string;
  isSelected: boolean;
  handleSelect: (code: string) => void;
}

function SingleFamilyFilter(props: ISingleFamilyFilterProps) {
  return (
    <div
      className={`SingleFamilyFilter ${props.isSelected ? "SingleFamilyFilter__selected" : ""}`}
      onClick={() => props.handleSelect(props.code)}
    >
      <span className="SingleFamilyFilter__text">{props.title}</span>
    </div>
  );
}

export default SingleFamilyFilter;
