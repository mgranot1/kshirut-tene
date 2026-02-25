import "./DashboardTitle.scss";

interface ISDashboardTitleProps {
  title: string;
  subTitle?: string;
}

const DashboardTitle = ({ title, subTitle }: ISDashboardTitleProps) => {
  return (
    <div className="dashboard-title">
      <label>{title}</label>
      {subTitle && <div className="dashboard-title__kshirut">
        <p>{subTitle}</p>
      </div>}
    </div>
  );
};

export default DashboardTitle;
