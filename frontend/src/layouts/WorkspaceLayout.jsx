import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { navigation, paths } from "../config/navigationConfig.js";
import { appConfig } from "../config/appConfig.js";
import { userRoles } from "../config/userConfig.js";
import { initials, optionLabel } from "../utils/format.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { Drawer } from "../components/common/Modal.jsx";
import Icon from "../components/common/Icon.jsx";
import Brand from "../components/layout/Brand.jsx";

function SidebarContent({ close }) {
  const { user } = useAuth();
  const location = useLocation();
  const groups = [
    ...new Set(
      navigation
        .filter((item) => item.roles.includes(user.role))
        .map((item) => item.group),
    ),
  ];
  return (
    <>
      <div className="sidebar-brand">
        <Brand />
      </div>
      <nav aria-label="Main navigation">
        {groups.map((group) => (
          <div className="nav-group" key={group}>
            <p>{group}</p>
            {navigation
              .filter(
                (item) =>
                  item.group === group && item.roles.includes(user.role),
              )
              .map((item) => (
                <NavLink
                  end={
                    item.path !== paths.instruments ||
                    location.pathname === paths.instrumentRegister
                  }
                  key={item.key}
                  to={item.path}
                  onClick={close}
                  className={({ isActive }) =>
                    "nav-item " + (isActive ? "selected" : "")
                  }
                >
                  <Icon name={item.icon} size={19} />
                  {item.label}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">
        <span className="environment-dot" />
        <span>
          {appConfig.projectCode}
          <small>Instrument management</small>
        </span>
      </div>
    </>
  );
}
export default function WorkspaceLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const current = [...navigation]
    .reverse()
    .find((item) => location.pathname.startsWith(item.path));
  return (
    <div className="workspace">
      <aside className="desktop-sidebar">
        <SidebarContent />
      </aside>
      <Drawer open={open} onClose={() => setOpen(false)} title="Navigation">
        <div className="mobile-sidebar">
          <SidebarContent close={() => setOpen(false)} />
        </div>
      </Drawer>
      <div className="workspace-body">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Icon name="Menu" />
          </button>
          <div className="topbar-context">
            {appConfig.projectCode}
            <span>/</span>
            <strong>{current?.label || "Workspace"}</strong>
          </div>
          <div className="topbar-user">
            <span className="avatar">{initials(user.name)}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{optionLabel(userRoles, user.role)}</small>
            </div>
            <button
              className="icon-button"
              aria-label="Sign out"
              title="Sign out"
              onClick={() => {
                logout();
                nav(paths.login);
              }}
            >
              <Icon name="LogOut" size={19} />
            </button>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
        <footer className="workspace-footer">
          <span>
            {appConfig.name} · {appConfig.projectCode}
          </span>
          <span>Version {appConfig.version} · Frontend demo</span>
        </footer>
      </div>
    </div>
  );
}
