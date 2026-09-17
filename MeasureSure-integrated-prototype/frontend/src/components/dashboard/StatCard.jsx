import { Link } from "react-router-dom";
import Icon from "../common/Icon.jsx";
export default function StatCard({ config, value }) {
  return (
    <Link to={config.link} className={"stat-card tone-" + config.tone}>
      <div className="stat-top">
        <span>{config.title}</span>
        <span className="stat-icon">
          <Icon name={config.icon} />
        </span>
      </div>
      <strong className="stat-value">{value ?? 0}</strong>
      <div className="stat-bottom">
        <span>{config.note || "View accounts"}</span>
        <Icon name="ArrowRight" size={16} />
      </div>
    </Link>
  );
}
