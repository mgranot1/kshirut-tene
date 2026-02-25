import "./Footer.scss";

interface IFooterProps {
  content: JSX.Element;
}

const Footer = ({ content }: IFooterProps) => {
  return <div className="footer">{content}</div>;
};

export default Footer;
