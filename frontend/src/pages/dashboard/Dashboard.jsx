import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboardStats } from "../../services/dashboardService.js";
import {
  dashboardStats,
  chartColors,
  activityColumns,
} from "../../config/dashboardConfig.js";
import { statusConfig } from "../../config/statusConfig.js";
import { paths } from "../../config/navigationConfig.js";
import { useResource } from "../../hooks/useResource.js";
import {
  Button,
  Card,
  LoadingState,
  ErrorState,
  PageHeader,
} from "../../components/common/ui.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import Icon from "../../components/common/Icon.jsx";
export default function Dashboard() {
  const { data, loading, error, reload } = useResource(getDashboardStats);
  return (
    <>
      <PageHeader
        page="dashboard"
        actions={
          <>
            <Button variant="secondary" onClick={reload} loading={loading}>
              <Icon name="RefreshCw" size={16} />
              Refresh
            </Button>
            <Button to={paths.instrumentRegister}>
              <Icon name="PlusCircle" size={17} />
              Register instrument
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
            {dashboardStats.map((config) => (
              <StatCard
                key={config.id}
                config={config}
                value={data.stats[config.id]}
              />
            ))}
          </div>
          <div className="dashboard-grid">
            <Card
              title="Registration activity"
              description="Instruments added over the last six reporting months"
            >
              <div className="chart-frame">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart
                    data={data.trend}
                    margin={{ top: 20, right: 22, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid stroke="#edf0f5" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(month) =>
                        new Date(month + "-02").toLocaleString("en", {
                          month: "short",
                        })
                      }
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 13 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      labelFormatter={(month) => "Registrations · " + month}
                    />
                    <Area
                      name="Instruments"
                      type="monotone"
                      dataKey="count"
                      stroke="var(--primary)"
                      fill="var(--primary-soft)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card
              title="Registry status"
              description="Distribution across current records"
            >
              <div className="donut-wrap">
                <div className="donut-center">
                  <strong>{data.stats.total}</strong>
                  <span>instruments</span>
                </div>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={data.statuses}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {data.statuses.map((item) => (
                        <Cell key={item.name} fill={chartColors[item.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        statusConfig[name]?.label || name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {data.statuses.map((item) => (
                  <div key={item.name}>
                    <span>
                      <i style={{ background: chartColors[item.name] }} />
                      {statusConfig[item.name].label}
                    </span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card
            title="Recent activity"
            description="The latest changes in your workspace"
          >
            <DataTable
              rows={data.activities}
              columns={activityColumns}
              pageSize={5}
              label="Recent activity"
            />
          </Card>
        </>
      )}
    </>
  );
}
