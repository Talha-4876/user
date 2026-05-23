import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../../config";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#eab308", "#a855f7"];
const POLL_INTERVAL = 30000;

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

const Card = ({ title, value, icon, trend, loading }) => (
  <div className="bg-[#0f0f12] border border-white/[0.08] p-5 rounded-xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
    <div className="flex items-start justify-between mb-3">
      <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium">{title}</p>
      {icon && (
        <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
      )}
    </div>
    {loading ? (
      <Skeleton className="h-8 w-24 mt-1" />
    ) : (
      <h2 className="text-white text-2xl font-bold tabular-nums">{value}</h2>
    )}
    {trend !== undefined && !loading && (
      <p className={`text-xs mt-1 font-medium ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
        {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last month
      </p>
    )}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-orange-500/[0.04] to-transparent rounded-xl" />
  </div>
);

const LastUpdated = ({ time, loading }) => (
  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
    <span className={`w-1.5 h-1.5 rounded-full ${loading ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
    {loading ? "Syncing..." : time ? `Last updated: ${time.toLocaleTimeString("en-PK")}` : ""}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1a1a20] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white shadow-xl">
        <p className="text-neutral-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name === "revenue" ? `Rs ${p.value?.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else if (!stats) setLoading(true);

    try {
      const res = await axios.get(`${backendUrl}/api/analytics/stats`);
      if (res.data.success) {
        setStats(res.data.stats);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError("Server returned an error. Please try again.");
      }
    } catch (err) {
      console.error("Analytics fetch failed:", err);
      setError("Could not connect to server. Retrying shortly...");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [stats]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => fetchStats(), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={() => fetchStats(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-xl transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-sm font-semibold">Live Overview</h2>
          <LastUpdated time={lastUpdated} loading={refreshing} />
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 
            bg-white/[0.06] border border-white/[0.08] rounded-xl hover:bg-white/[0.1]
            transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={refreshing ? "animate-spin" : ""}>↻</span>
          Refresh
        </button>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card title="Revenue" value={stats ? `Rs ${Number(stats.totalRevenue).toLocaleString()}` : "—"} icon="💰" trend={stats?.revenueTrend} loading={loading} />
        <Card title="Orders" value={stats?.totalOrders ?? "—"} icon="🛒" trend={stats?.ordersTrend} loading={loading} />
        <Card title="Pending" value={stats?.pendingOrders ?? "—"} icon="⏳" loading={loading} />
        <Card title="Delivered" value={stats?.deliveredOrders ?? "—"} icon="✅" loading={loading} />
        <Card title="Rating" value={stats ? `⭐ ${stats.avgRating}` : "—"} loading={loading} />
      </div>

      {/* ================= LINE CHART ================= */}
      <div className="bg-[#0f0f12] p-5 rounded-xl border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-sm font-semibold">Revenue Analytics</h2>
          <span className="text-[11px] text-neutral-500">Monthly breakdown</span>
        </div>
        {loading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.monthlyRevenue || []}>
              <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 11 }} />
              <YAxis stroke="#555" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line dataKey="revenue" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3, fill: "#f97316" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ================= TOP ITEMS ================= */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="bg-[#0f0f12] p-5 rounded-xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-sm font-semibold">Top Products</h2>
            <span className="text-[11px] text-neutral-500">by sales count</span>
          </div>
          {loading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.topProducts || []}>
                <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 10 }} />
                <YAxis stroke="#555" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#0f0f12] p-5 rounded-xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-sm font-semibold">Sales Distribution</h2>
            <span className="text-[11px] text-neutral-500">top items</span>
          </div>
          {loading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats?.topProducts || []} dataKey="sales" nameKey="name" outerRadius={90} innerRadius={40} paddingAngle={3}>
                  {(stats?.topProducts || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span style={{ color: "#aaa", fontSize: 11 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* ================= ERROR BANNER ================= */}
      {error && stats && (
        <div className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2">
          ⚠️ {error}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;