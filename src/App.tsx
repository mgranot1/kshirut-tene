import { createTheme, ThemeProvider } from "@mui/material";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import AlertProvider from "./contexts/AlertContext";
import { useUserUnit } from "./report/hooks/useUserUnit";
import { useGetCurrentUserUnit } from "./report/services/userUnit/useGetCurrentUserUnit";
import RouterProvider from "./router/router";
import { ParmeterProvider } from "./shared/components/ParmeterProvider/ParmeterProvider";
import SessionEndedAlert from "./shared/components/SessionEndedAlert/SessionEndedAlert";
import { initMatomo } from "./shared/utils/matomo.utils";

const theme = createTheme({
  typography: {
    fontFamily: "Heebo",
  },
});

const App: React.FC = () => {
  const [user, setUserUnit] = useUserUnit();
  const { data: currentUserUnit, isSuccess: isCurrentUserUnitSuccess } =
    useGetCurrentUserUnit();

  useEffect(() => {
    if (currentUserUnit) {
      setUserUnit(currentUserUnit);
      initMatomo(currentUserUnit);
    }
  }, [isCurrentUserUnitSuccess]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ParmeterProvider>
          <AlertProvider>
            <SessionEndedAlert />
            {!Object.keys(user).length ? (
              <div>מכניסים אותך...</div>
            ) : !user.username ? (
              <div>אין הרשאה </div>
            ) : (
              <RouterProvider />
            )}
            {import.meta.env.MODE !== "production" && <ReactQueryDevtools />}
          </AlertProvider>
        </ParmeterProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
