import { appConfig } from "../../config/appConfig.js";
import Icon from "../common/Icon.jsx";
export default function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        {appConfig.logo.imageUrl ? (
          <img src={appConfig.logo.imageUrl} alt="" />
        ) : (
          <Icon name={appConfig.logo.icon} size={26} />
        )}
      </span>
      <span>
        <strong>{appConfig.name}</strong>
        <small>{appConfig.organization}</small>
      </span>
    </div>
  );
}
