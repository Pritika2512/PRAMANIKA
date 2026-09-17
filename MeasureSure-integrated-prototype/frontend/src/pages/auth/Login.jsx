import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { loginFields, userRoles } from "../../config/userConfig.js";
import { demoAccounts } from "../../data/mockUsers.js";
import { paths, pageConfig } from "../../config/navigationConfig.js";
import { optionLabel } from "../../utils/format.js";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import { ConfigForm } from "../../components/common/Forms.jsx";
import Icon from "../../components/common/Icon.jsx";
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [account, setAccount] = useState(null);
  return (
    <AuthLayout>
      <div className="auth-card">
        <span className="auth-icon">
          <Icon name="ShieldCheck" size={26} />
        </span>
        <h1>{pageConfig.login.title}</h1>
        <p className="auth-subtitle">{pageConfig.login.subtitle}</p>
        <ConfigForm
          key={account?.id || "empty"}
          compact
          sections={[{ fields: loginFields }]}
          initialValues={account || { email: location.state?.email || "" }}
          submitLabel="Sign in"
          onSubmit={async (values) => {
            await login(values);
            navigate(location.state?.from || paths.dashboard, {
              replace: true,
            });
          }}
        />
        <p className="auth-switch">
          New to the workspace?{" "}
          <Link to={paths.register}>Create an account</Link>
        </p>
        <div className="demo-accounts">
          <p>Explore with a demo account</p>
          <div>
            {demoAccounts.map((user) => (
              <button key={user.id} onClick={() => setAccount(user)}>
                <Icon
                  name={user.role === "ADMIN" ? "ShieldCheck" : "UserCheck"}
                  size={17}
                />
                {optionLabel(userRoles, user.role)}
                <Icon name="ArrowRight" size={15} />
              </button>
            ))}
          </div>
          <small>Choose a role to fill its sample credentials.</small>
        </div>
      </div>
    </AuthLayout>
  );
}
