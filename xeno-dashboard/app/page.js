"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import OrdersByDateChart from "../components/OrdersByDateChart";
import BusinessMetricsCharts from "../components/BusinessMetricsCharts";
import SettingsPage from "../components/SettingsPage";
import "./dashboard.css";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3006";

export default function Dashboard() {
  const {
    isAuthenticated,
    loading: authLoading,
    user,
    logout,
    getAuthHeaders,
  } = useAuth();

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [ordersData, setOrdersData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [customEvents, setCustomEvents] = useState({
    totalAbandoned: 0,
    checkoutsStarted: 0,
    checkoutsCompleted: 0,
    abandonmentRate: 0,
    conversionRate: 0,
    lostRevenue: 0,
  });
  const [businessMetrics, setBusinessMetrics] = useState({
    sales: [],
    customers: [],
    products: [],
  });
  const [customerListModal, setCustomerListModal] = useState({
    isOpen: false,
    customers: [],
    loading: false,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    search: "",
  });

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const router = useRouter();
  const tenantId = user?.tenantId || "1";

  const fetchBusinessMetrics = async () => {
    try {
      const headers = getAuthHeaders();
      const urls = [
        `${BACKEND_URL}/api/analytics/sales-performance?tenantId=${tenantId}`,
        `${BACKEND_URL}/api/analytics/customer-behavior?tenantId=${tenantId}`,
        `${BACKEND_URL}/api/analytics/product-performance?tenantId=${tenantId}`,
      ];

      const [salesResult, customerResult, productResult] =
        await Promise.allSettled([
          fetch(urls[0], { headers }).then((res) =>
            res.ok ? res.json() : { success: false }
          ),
          fetch(urls[1], { headers }).then((res) =>
            res.ok ? res.json() : { success: false }
          ),
          fetch(urls[2], { headers }).then((res) =>
            res.ok ? res.json() : { success: false }
          ),
        ]);

      const salesData =
        salesResult.status === "fulfilled" && salesResult.value?.success
          ? salesResult.value.data
          : [];
      const customerData =
        customerResult.status === "fulfilled" && customerResult.value?.success
          ? customerResult.value.data
          : [];
      const productData =
        productResult.status === "fulfilled" && productResult.value?.success
          ? productResult.value.data
          : [];

      setBusinessMetrics({
        sales: Array.isArray(salesData) ? salesData : [],
        customers: Array.isArray(customerData) ? customerData : [],
        products: Array.isArray(productData) ? productData : [],
      });
    } catch (error) {
      console.error("Error fetching business metrics:", error);
      setBusinessMetrics({ sales: [], customers: [], products: [] });
    }
  };

  const fetchCustomerList = async (page = 1, search = "") => {
    setCustomerListModal((prev) => ({ ...prev, loading: true }));
    try {
      const headers = getAuthHeaders();
      const endpoint = `/api/customers/list?tenantId=${tenantId}&page=${page}&limit=20&search=${encodeURIComponent(
        search
      )}`;

      const response = await fetch(
        `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCustomerListModal((prev) => ({
          ...prev,
          customers: data.data,
          pagination: data.pagination,
          search: search,
          loading: false,
        }));
      } else {
        setCustomerListModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Error fetching customer list:", error);
      setCustomerListModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const openCustomerListModal = () => {
    setCustomerListModal((prev) => ({ ...prev, isOpen: true }));
    fetchCustomerList(1, "");
  };

  const closeCustomerListModal = () => {
    setCustomerListModal((prev) => ({
      ...prev,
      isOpen: false,
      customers: [],
      search: "",
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    }));
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.allSettled([
        loadDashboard(),
        fetchOrdersByDate(),
        fetchTopCustomers(),
        fetchCustomEvents(),
        fetchBusinessMetrics(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const response = await fetch(
        `/api/proxy?endpoint=/api/dashboard/${tenantId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      } else {
        setStats({
          totalCustomers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
        });
      }
    } catch (error) {
      setStats({
        totalCustomers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
      });
    }
  };

  const fetchOrdersByDate = async () => {
    try {
      let endpoint = `/api/analytics/orders-by-date?tenantId=${tenantId}`;
      if (dateRange.start && dateRange.end) {
        endpoint += `&startDate=${dateRange.start}&endDate=${dateRange.end}`;
      }

      const response = await fetch(
        `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();
      if (data.success) {
        setOrdersData(data.data || []);
      }
    } catch (error) {
      setOrdersData([]);
    }
  };

  const fetchTopCustomers = async () => {
    try {
      const response = await fetch(
        `/api/proxy?endpoint=${encodeURIComponent(
          `/api/analytics/top-customers?tenantId=${tenantId}`
        )}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setTopCustomers(data.data);
      } else {
        setTopCustomers([]);
      }
    } catch (error) {
      setTopCustomers([]);
    }
  };

  const fetchCustomEvents = async () => {
    try {
      let endpoint = `/api/analytics/cart-abandonment?tenantId=${tenantId}`;
      if (dateRange.start && dateRange.end) {
        endpoint += `&startDate=${dateRange.start}&endDate=${dateRange.end}`;
      }

      const response = await fetch(
        `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (data.success) {
        let summary = data.summary || {
          total_abandoned: 0,
          total_completed: 0,
          total_started: 0,
          abandonment_rate: 0,
          abandoned_value: 0,
        };

        const conversionRate =
          summary.total_started > 0
            ? Math.round(
                (summary.total_completed / summary.total_started) * 100 * 100
              ) / 100
            : 0;

        setCustomEvents({
          totalAbandoned: summary.total_abandoned || 0,
          checkoutsStarted: summary.total_started || 0,
          checkoutsCompleted: summary.total_completed || 0,
          abandonmentRate: summary.abandonment_rate || 0,
          conversionRate: conversionRate,
          lostRevenue: summary.abandoned_value || 0,
        });
      } else {
        setCustomEvents({
          totalAbandoned: 0,
          checkoutsStarted: 0,
          checkoutsCompleted: 0,
          abandonmentRate: 0,
          conversionRate: 0,
          lostRevenue: 0,
        });
      }
    } catch (error) {
      setCustomEvents({
        totalAbandoned: 0,
        checkoutsStarted: 0,
        checkoutsCompleted: 0,
        abandonmentRate: 0,
        conversionRate: 0,
        lostRevenue: 0,
      });
    }
  };

  const syncData = async (endpoint, type) => {
    setSyncStatus(` Syncing ${type}...`);
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          endpoint: `/api/sync/${endpoint}`,
          tenantId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSyncStatus(` ${type} synced successfully!`);
        setTimeout(() => {
          loadAllData();
          setTimeout(() => setSyncStatus(""), 3000);
        }, 1000);
      } else {
        setSyncStatus(`❌ ${type} sync failed`);
      }
    } catch (error) {
      console.error("SYNC ERROR:", error);
      setSyncStatus(`❌ ${type} sync failed`);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      router.push("/login");
      return;
    }
    if (isAuthenticated()) {
      loadAllData();
    }
  }, [authLoading, isAuthenticated, tenantId]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchOrdersByDate();
      fetchCustomEvents();
    }
  }, [dateRange, tenantId]);

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f7fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Modern Clean Spinner */}
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #d1d5db",
              borderTop: "4px solid #3E4A8A",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem auto",
            }}
          />

          <h1
            style={{
              fontSize: "1.2rem",
              color: "#374151",
              letterSpacing: "0.03em",
              fontWeight: 600,
            }}
          >
            Loading Xeno Analytics...
          </h1>

          {/* Inline CSS Animation */}
          <style>
            {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
          </style>
        </div>
      </div>
    );
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!isAuthenticated()) return null;

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <div className="logo-images">
          <img src="Images/shopify.png" alt="Shopify" className="logo-img" />
          <img src="Images/cross.gif" alt="×" className="logo-cross" />
          <img src="Images/xeno.png" alt="Xeno" className="logo-img" />
        </div>

        <div className="navbar-actions">
          <button
            className="nav-btn settings-btn"
            onClick={() => setShowSettings(true)}
          >
            Settings
          </button>

          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Settings Page Display */}
      {showSettings && (
        <div className="settings-container">
          <SettingsPage />
        </div>
      )}

      {/* Main Content */}
      {!showSettings && (
        <div className="main-layout">
          {/* Dashboard Content */}
          <div className="dashboard-content">
            {/* Core Metrics */}
            <div className="metrics-grid">
              {/* Total Customers */}
              <div
                onClick={openCustomerListModal}
                className="metric-card clickable"
              >
                <h3 className="metric-title">
                  Total Customers
                  <span className="metric-click-hint">
                    (Click to view list)
                  </span>
                </h3>
                <div className="metric-content">
                  <div className="metric-icon blue">👥</div>
                  <div className="metric-value">
                    {isLoading
                      ? "..."
                      : (stats?.totalCustomers || 0).toLocaleString()}
                  </div>
                </div>
                <div className="click-indicator">👆</div>
              </div>

              {/* Cart Events */}
              <div className="metric-card">
                <h3 className="cart-events-title">Cart Events</h3>
                <div className="cart-events-list">
                  <div className="cart-event-item started">
                    <span>Started</span>
                    <span>{customEvents.checkoutsStarted}</span>
                  </div>
                  <div className="cart-event-item abandoned">
                    <span>Abandoned</span>
                    <span>{customEvents.totalAbandoned}</span>
                  </div>
                  <div className="cart-event-item completed">
                    <span>Completed</span>
                    <span>{customEvents.checkoutsCompleted}</span>
                  </div>
                </div>
                <div className="cart-metrics">
                  <div className="cart-metric-item">
                    <span className="cart-metric-label">Abandonment Rate</span>
                    <span className="cart-metric-value red">
                      {customEvents.abandonmentRate}%
                    </span>
                  </div>
                  <div className="cart-metric-item">
                    <span className="cart-metric-label">Conversion Rate</span>
                    <span className="cart-metric-value green">
                      {customEvents.conversionRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="chart-section">
              <OrdersByDateChart
                apiData={ordersData}
                startDate={dateRange.start}
                endDate={dateRange.end}
                setStartDate={(date) =>
                  setDateRange((prev) => ({ ...prev, start: date }))
                }
                setEndDate={(date) =>
                  setDateRange((prev) => ({ ...prev, end: date }))
                }
                isLoading={isLoading}
              />
            </div>

            {/* Business Metrics Charts */}
            <BusinessMetricsCharts
              salesData={businessMetrics.sales}
              customerData={businessMetrics.customers}
              productData={businessMetrics.products}
              isLoading={isLoading}
            />

            {/* Secondary Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <h3 className="metric-title">Total Orders</h3>
                <div className="metric-content">
                  <div className="metric-icon green">📦</div>
                  <div className="metric-value">
                    {isLoading
                      ? "..."
                      : (stats?.totalOrders || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <h3 className="metric-title">Total Revenue</h3>
                <div className="metric-content">
                  <div className="metric-icon purple">💰</div>
                  <div className="metric-value">
                    ₹
                    {isLoading
                      ? "..."
                      : (stats?.totalRevenue || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Customers */}
            <div className="top-customers-card">
              <h3 className="top-customers-title">Top 5 Customers by Spend</h3>

              {topCustomers &&
              Array.isArray(topCustomers) &&
              topCustomers.length > 0 ? (
                <div className="top-customers-grid">
                  {topCustomers.slice(0, 5).map((customer, index) => (
                    <div key={customer?.id || index} className="customer-card">
                      <div className="customer-header">
                        <div
                          className={`customer-rank ${
                            index === 0
                              ? "gold"
                              : index === 1
                              ? "silver"
                              : index === 2
                              ? "bronze"
                              : "other"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="customer-name">
                          {customer?.name ||
                            customer?.email ||
                            "Unknown Customer"}
                        </div>
                      </div>
                      <div className="customer-spend">
                        ${(customer?.totalSpent || 0).toFixed(2)}
                      </div>
                      <div className="customer-orders">
                        {customer?.ordersCount || 0} orders
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <p className="empty-state-text">
                    No customer data available.
                  </p>
                  <p className="empty-state-subtext">
                    {isLoading
                      ? "Loading customers..."
                      : "Click sync to load data."}
                  </p>
                </div>
              )}
            </div>

            {/* Sync Controls */}
            <div className="sync-controls">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="sync-btn settings"
              >
                <span>⚙️</span>SETTINGS
              </button>

              {[
                { endpoint: "customers", label: "SYNC CUSTOMERS", icon: "👥" },
                { endpoint: "products", label: "SYNC PRODUCTS", icon: "📦" },
                { endpoint: "orders", label: "SYNC ORDERS", icon: "🛍️" },
                { endpoint: "all", label: "SYNC ALL", icon: "⚡" },
              ].map((item) => (
                <button
                  key={item.endpoint}
                  onClick={() =>
                    syncData(item.endpoint, item.label.split(" ")[1])
                  }
                  className="sync-btn primary"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Status Message */}
            {syncStatus && <div className="status-message">{syncStatus}</div>}
          </div>
        </div>
      )}

      {/* Customer List Modal */}
      {customerListModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                👥 Customer List ({customerListModal.pagination.total}{" "}
                customers)
              </h2>
              <button
                onClick={closeCustomerListModal}
                className="modal-close-btn"
              >
                ✕ Close
              </button>
            </div>

            <div className="modal-search">
              <input
                type="text"
                placeholder="🔍 Search customers by name or email..."
                value={customerListModal.search}
                onChange={(e) => {
                  const searchValue = e.target.value;
                  setCustomerListModal((prev) => ({
                    ...prev,
                    search: searchValue,
                  }));
                  setTimeout(() => {
                    if (customerListModal.search === searchValue) {
                      fetchCustomerList(1, searchValue);
                    }
                  }, 500);
                }}
                className="modal-search-input"
              />
            </div>

            <div className="modal-table-container">
              {customerListModal.loading ? (
                <div className="modal-loading">
                  <div className="modal-loading-icon">⏳</div>
                  <p className="modal-loading-text">Loading customers...</p>
                </div>
              ) : customerListModal.customers.length > 0 ? (
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Email</th>
                      <th className="text-right">Total Spent</th>
                      <th className="text-center">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerListModal.customers.map((customer) => (
                      <tr key={customer.id}>
                        <td>
                          <div className="customer-table-avatar-cell">
                            <div className="customer-table-avatar">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="customer-table-name">
                              {customer.name}
                            </span>
                          </div>
                        </td>
                        <td className="customer-table-email">
                          {customer.email}
                        </td>
                        <td className="customer-table-spend">
                          ${customer.totalSpent.toFixed(2)}
                        </td>
                        <td className="customer-table-orders">
                          {customer.ordersCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="modal-empty-state">
                  <div className="modal-empty-icon">👥</div>
                  <p className="modal-empty-text">No customers found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
