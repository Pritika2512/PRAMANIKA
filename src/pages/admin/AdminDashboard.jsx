import { getDashboardStats } from "../../services/dashboardService.js";
import { useResource } from "../../hooks/useResource.js";
import { adminStats, activityColumns } from "../../config/dashboardConfig.js";
import { paths } from "../../config/navigationConfig.js";
import {
  Button,
  Card,
  PageHeader,
  LoadingState,
  ErrorState,
} from "../../components/common/ui.jsx";
import Icon from "../../components/common/Icon.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
export default function AdminDashboard() {
  const { data, loading, error, reload } = useResource(getDashboardStats);
  return (
    <>
      <PageHeader
        page="admin"
        actions={
          <>
            <Button variant="secondary" onClick={reload} loading={loading}>
              <Icon name="RefreshCw" size={17} />
              Refresh
            </Button>
            <Button to={paths.users}>
              <Icon name="Users" size={17} />
              Manage users
            </Button>
          </>
        }
      />
      {error ? (
        <ErrorState message={error} retry={reload} />
      ) : loading ? (
        <LoadingState />
      ) : (
        <>
          <div className="stat-grid">
            {adminStats.map((config) => (
              <StatCard
                key={config.id}
                config={config}
                value={data.stats[config.id]}
              />
            ))}
          </div>
          <div className="admin-banner">
            <span className="admin-banner-icon">
              <Icon name="ShieldCheck" size={30} />
            </span>
            <div>
              <h2>Workspace access</h2>
              <p>
                {data.stats.pendingUsers} accounts awaiting activation. Review
                roles and account status from user management.
              </p>
            </div>
            <Button to={paths.users + "?status=PENDING"} variant="secondary">
              Review accounts
              <Icon name="ArrowRight" size={16} />
            </Button>
          </div>
          <Card
            title="Workspace activity"
            description="Account and instrument changes across your team"
          >
            <DataTable
              columns={activityColumns}
              rows={data.activities}
              label="Workspace activity"
            />
          </Card>
        </>
      )}
    </>
  );
}
