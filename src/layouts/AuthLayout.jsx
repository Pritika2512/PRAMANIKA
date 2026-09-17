import Brand from "../components/layout/Brand.jsx";
import { appConfig } from "../config/appConfig.js";
import Icon from "../components/common/Icon.jsx";
export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-aside">
        <Brand />
        <div className="auth-message">
          <span className="eyebrow">{appConfig.projectCode}</span>
          <h1>
            Every instrument.
            <br />
            One clear record.
          </h1>
          <p>{appConfig.description}</p>
          <div className="auth-feature">
            <Icon name="Scale" />
            <span>Manage instrument registrations</span>
          </div>
          <div className="auth-feature">
            <Icon name="LayoutDashboard" />
            <span>Keep registry activity in view</span>
          </div>
          <div className="auth-feature">
            <Icon name="Users" />
            <span>Coordinate your workspace team</span>
          </div>
        </div>
        <small>Instrument management workspace</small>
      </aside>
      <main className="auth-main">
        <div className="auth-mobile-brand">
          <Brand />
        </div>
        {children}
      </main>
    </div>
  );
}
