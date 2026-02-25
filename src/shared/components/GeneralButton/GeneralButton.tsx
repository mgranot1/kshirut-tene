import "./GeneralButton.scss";

interface IGeneralButtonProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  form?: string;
}

const GeneralButton = ({
  text,
  onClick,
  disabled = false,
  form,
}: IGeneralButtonProps) => {
  return (
    <button
      className="general-button"
      onClick={onClick}
      disabled={disabled}
      form={form}
    >
      {text}
    </button>
  );
};

export default GeneralButton;
