import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { appConfig } from "../config/appConfig.js";
import { pageConfig, paths } from "../config/navigationConfig.js";
import { roles } from "../config/userConfig.js";
import WorkspaceLayout from "../layouts/WorkspaceLayout.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import InstrumentList from "../pages/instruments/InstrumentList.jsx";
import InstrumentRegistration from "../pages/instruments/InstrumentRegistration.jsx";
import InstrumentDetails from "../pages/instruments/InstrumentDetails.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import UserManagement from "../pages/admin/UserManagement.jsx";
import InspectionList from "../pages/inspections/InspectionList.jsx";
import InspectionDetails from "../pages/inspections/InspectionDetails.jsx";
import InspectionForm from "../pages/inspections/InspectionForm.jsx";
import CertificateList from "../pages/certificates/CertificateList.jsx";
import CertificateDetails from "../pages/certificates/CertificateDetails.jsx";
import CertificateByInspection from "../pages/certificates/CertificateByInspection.jsx";
import VerificationHistory from "../pages/verification/VerificationHistory.jsx"; 
import { Button, EmptyState } from "../components/common/ui.jsx";
function Protected({ allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user)
    return (
      <Navigate
        to={paths.login}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  if (allowedRoles && !allowedRoles.includes(user.role))
    return (
      <EmptyState
        title="Administrator access required"
        description={`Your inspector account can use the ${pageConfig.dashboard.title} and instrument registry.`}
        action={<Button to={paths.dashboard}>Return to {pageConfig.dashboard.title}</Button>}
      />
    );
  return <Outlet />;
}
function PageMetadata() {
  const location = useLocation();
  useEffect(() => {
    const key =
      Object.keys(paths).find((key) => paths[key] === location.pathname) ||
      (location.pathname.startsWith(paths.instruments + "/")
        ? "instrumentDetail"
        : "");
    document.title =
      (pageConfig[key]?.title ? pageConfig[key].title + " · " : "") +
      appConfig.name;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", appConfig.description);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}
export default function AppRoutes() {
  return (
    <>
      <PageMetadata />
      <Routes>
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.register} element={<Register />} />
        <Route element={<Protected />}>
          <Route element={<WorkspaceLayout />}>
            <Route path={paths.dashboard} element={<Dashboard />} />
            <Route path={paths.instruments} element={<InstrumentList />} />
            <Route
              path={paths.instrumentRegister}
              element={<InstrumentRegistration />}
            />
            <Route
              path={paths.instrumentDetail}
              element={<InstrumentDetails />}
            />
            <Route
              path={paths.inspections}
              element={<InspectionList />}
            />
            <Route
              path={paths.verificationHistory}
              element={<VerificationHistory />}
            />
            <Route
              path={paths.inspectionNew}
              element={<InspectionForm />}
            />

            <Route
              path="/inspections/:id"
              element={<InspectionDetails />}
            />
            <Route path={paths.certificates} element={<CertificateList />} />
            <Route path={paths.certificateByInspection} element={<CertificateByInspection />} />
            <Route path={paths.certificateDetail} element={<CertificateDetails />} />
            <Route element={<Protected allowedRoles={[roles.ADMIN]} />}>
              <Route path={paths.admin} element={<AdminDashboard />} />
              <Route path={paths.users} element={<UserManagement />} />
            </Route>
          </Route>
        </Route>
        <Route path="/" element={<Navigate to={paths.dashboard} replace />} />
        <Route
          path="*"
          element={
            <div className="standalone-state">
              <EmptyState
                title="Page not found"
                description="This page is not part of the instrument management workspace."
                action={<Button to={paths.dashboard}>Go to {pageConfig.dashboard.title}</Button>}
              />
            </div>
          }
        />
      </Routes>
    </>
  );
}
