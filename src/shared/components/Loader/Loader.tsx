import CircularProgress from "@mui/material/CircularProgress";
import "./Loader.scss";

interface IProps {}

const Loader: React.FC<IProps> = () => {
  return (
    <>
      <div className="loader">
        <p className="loader__circle">
          <CircularProgress sx={{ color: "black" }} thickness={5} />
        </p>
      </div>
    </>
  );
};

export default Loader;
