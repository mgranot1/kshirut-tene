import { PropsWithChildren, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "../../../shared/components/Loader/Loader";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import DashboardHeader from "./Header/DashboardHeader";

interface IDashboardLayoutProps { }

const DashboardLayout: React.FC<PropsWithChildren<IDashboardLayoutProps>> = (
  props
) => {
  return (
    <div className="DashboardLayout">

      <div className="toaster-container" style={{ zIndex: 10000 }}>
        <Toaster
          toastOptions={{
            success: {
              duration: 5000,
              style: {
                color: "#2ada2a",
                backgroundColor: "#f6faf5",
              },
            },
            error: {
              duration: 5000,
              style: {
                color: "red",
                backgroundColor: "#faf5f5",
              },
            },
          }}
        />
      </div>
      <DashboardSidebar />

      <div className="DashboardMiddle">
        <DashboardHeader />
        <section className="DashboardContent-section">
          <Suspense fallback={<Loader />}>
            <div className="DashboardContent">{props.children}</div>
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
