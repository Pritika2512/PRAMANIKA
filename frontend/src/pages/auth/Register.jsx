import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import { registrationFields } from "../../config/userConfig.js";
import { pageConfig, paths } from "../../config/navigationConfig.js";
import { register } from "../../services/authService.js";
import { ConfigForm } from "../../components/common/Forms.jsx";
import { Modal } from "../../components/common/Modal.jsx";
import { Button } from "../../components/common/ui.jsx";
import Icon from "../../components/common/Icon.jsx";
export default function Register() {
  const [created, setCreated] = useState(null);
  const nav = useNavigate();
  const finish = () => nav(paths.login, { state: { email: created.email } });
  return (
    <AuthLayout>
      <div className="auth-card register-card">
        <h1>{pageConfig.register.title}</h1>
        <p className="auth-subtitle">{pageConfig.register.subtitle}</p>
        <ConfigForm
          compact
          sections={[{ fields: registrationFields }]}
          passwordMeter
          submitLabel="Create account"
          onSubmit={async (values) => setCreated(await register(values))}
        />
        <p className="auth-switch">
          Already registered? <Link to={paths.login}>Sign in</Link>
        </p>
      </div>
      <Modal
        open={!!created}
        onClose={finish}
        title="Account created"
        footer={<Button onClick={finish}>Continue to sign in</Button>}
      >
        <div className="success-content">
          <Icon name="CheckCircle2" size={42} />
          <h3>Welcome, {created?.name}</h3>
          <p>
            Your inspector account is ready. Sign in with the credentials you
            just created.
          </p>
        </div>
      </Modal>
    </AuthLayout>
  );
}
