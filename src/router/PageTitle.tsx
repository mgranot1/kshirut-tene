import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitle = ({ pagetitle }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = pagetitle;
  }, [location, pagetitle]);

  return null;
};

export default PageTitle;
