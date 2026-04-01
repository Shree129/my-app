import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const ORDER_COLLECTIONS = [
  "allDoormatOrders",
  "allPillowOrders",
  "allBedsheetOrders",
  "allCurtainOrders",
  "allSofaOrders",
];

const SOURCE_TO_MAIN_COLLECTION = {
  allDoormatOrders: "doormatOrders",
  allPillowOrders: "pillowOrders",
  allBedsheetOrders: "bedsheetOrders",
  allCurtainOrders: "curtainOrders",
  allSofaOrders: "sofaOrders",
};

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [availabilityRows, setAvailabilityRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState("");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout");
    }
  };

  const getRowTimestamp = (row) => {
    return (
      row.createdAt?.seconds ||
      row.orderedAt?.seconds ||
      row.timestamp?.seconds ||
      row.requestedAt?.seconds ||
      row.updatedAt?.seconds ||
      0
    );
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      let allOrders = [];

      for (const colName of ORDER_COLLECTIONS) {
        const snapshot = await getDocs(collection(db, colName));

        snapshot.forEach((snap) => {
          const data = snap.data();

          allOrders.push({
            id: snap.id,
            firestoreId: snap.id,
            ...data,
            source: colName,
            rowType: "order",
            displayName:
              data.name ||
              data.productName ||
              data.model_name ||
              data.product_id ||
              "Unknown Product",
            numericPrice: Number(
              String(data.price || data.rate || data.MRP || 0).replace(/[^\d.]/g, "")
            ),
            category:
              data.category ||
              colName.replace("all", "").replace("Orders", "") ||
              "-",
          });
        });
      }

      const availabilitySnap = await getDocs(collection(db, "productAvailability"));

      const availabilityData = availabilitySnap.docs.map((snap) => {
        const data = snap.data();

        return {
          id: snap.id,
          firestoreId: snap.id,
          ...data,
          source: "productAvailability",
          rowType: "availability",
          product_id: String(data.productId || data.product_id || ""),
          productId: String(data.productId || data.product_id || ""),
          displayName:
            data.productName ||
            data.name ||
            data.model_name ||
            `Curtain ${data.productId || data.product_id || ""}`,
          numericPrice: Number(
            String(data.price || data.rate || data.MRP || 0).replace(/[^\d.]/g, "")
          ),
          address:
            data.address ||
            data.approvedAddress ||
            data.deliveryAddress ||
            "-",
          approvedForEmail:
            data.approvedForEmail ||
            data.buyerEmail ||
            data.email ||
            "",
          category: data.category || "Curtain",
          status: data.isAvailable ? "Available" : "Not Available",
          isAvailable: data.isAvailable ?? true,
          updatedAt: data.updatedAt || data.createdAt || null,
        };
      });

      allOrders.sort((a, b) => getRowTimestamp(b) - getRowTimestamp(a));
      availabilityData.sort((a, b) => getRowTimestamp(b) - getRowTimestamp(a));

      setOrders(allOrders);
      setAvailabilityRows(availabilityData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const mergedRows = useMemo(() => {
    const normalizedOrders = orders.map((o) => ({
      ...o,
      product_id: String(o.product_id || o.productId || ""),
      rowKey: `${o.source}-${o.firestoreId}`,
      sortTime: getRowTimestamp(o),
    }));

    const normalizedAvailability = availabilityRows.map((a) => ({
      ...a,
      product_id: String(a.product_id || a.productId || ""),
      rowKey: `${a.source}-${a.firestoreId}`,
      sortTime: getRowTimestamp(a),
    }));

    const combined = [...normalizedAvailability, ...normalizedOrders];
    combined.sort((a, b) => b.sortTime - a.sortTime);

    return combined;
  }, [orders, availabilityRows]);

  const stats = useMemo(() => {
    const totalOrders = mergedRows.length;

    const totalRevenue = mergedRows.reduce(
      (sum, row) => sum + (row.numericPrice || 0),
      0
    );

    const totalProducts = new Set(
      mergedRows.map(
        (row) => `${row.category}-${row.product_id || row.productId || row.displayName}`
      )
    ).size;

    const totalCustomers = new Set(
      mergedRows.map(
        (row) =>
          row.approvedForEmail ||
          row.buyerEmail ||
          row.email ||
          row.address ||
          row.firestoreId
      )
    ).size;

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
    };
  }, [mergedRows]);

  const categoryData = useMemo(() => {
    const counts = {};

    mergedRows.forEach((row) => {
      const key = row.category || "Other";
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [mergedRows]);

  const salesBarData = useMemo(() => {
    return mergedRows.slice(0, 8).map((row) => ({
      name: row.product_id || row.productId || row.displayName,
      price: row.numericPrice || 0,
    }));
  }, [mergedRows]);

  const lineData = useMemo(() => {
    const revenueMap = {};

    mergedRows.forEach((row) => {
      const seconds = getRowTimestamp(row);

      const label = seconds
        ? new Date(seconds * 1000).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })
        : "Unknown";

      if (!revenueMap[label]) {
        revenueMap[label] = 0;
      }

      revenueMap[label] += row.numericPrice || 0;
    });

    return Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }, [mergedRows]);

  const toggleStatus = async (row) => {
    try {
      setTogglingId(row.rowKey || row.id);
      setError("");

      if (row.rowType === "availability") {
        const newIsAvailable = !(row.isAvailable ?? row.status === "Available");
        const newStatus = newIsAvailable ? "Available" : "Not Available";

        await setDoc(
          doc(db, "productAvailability", row.firestoreId || `Curtain_${row.productId}`),
          {
            category: row.category || "Curtain",
            productId: String(row.productId || row.product_id || ""),
            productName: row.displayName,
            price: row.numericPrice || 0,
            isAvailable: newIsAvailable,
            status: newStatus,
            approvedForEmail: newIsAvailable ? "" : row.approvedForEmail || "",
            address: row.address || "",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        setAvailabilityRows((prev) =>
          prev.map((item) =>
            item.firestoreId === row.firestoreId
              ? {
                  ...item,
                  isAvailable: newIsAvailable,
                  status: newStatus,
                  approvedForEmail: newIsAvailable ? "" : item.approvedForEmail,
                }
              : item
          )
        );

        await fetchOrders();
        return;
      }

      const currentStatus = row.status || "Available";
      const newStatus =
        currentStatus === "Available" ? "Not Available" : "Available";

      await updateDoc(doc(db, row.source, row.firestoreId), {
        status: newStatus,
      });

      const mainCollection = SOURCE_TO_MAIN_COLLECTION[row.source];

      if (mainCollection && (row.product_id || row.productId)) {
        const pid = String(row.product_id || row.productId);

        await setDoc(
          doc(db, mainCollection, row.firestoreId),
          {
            product_id: pid,
            productId: pid,
            name: row.displayName,
            productName: row.displayName,
            price: row.numericPrice || 0,
            address: row.address || "",
            query: row.query || "",
            buyerEmail: row.buyerEmail || row.approvedForEmail || "",
            status: newStatus,
            category: row.category || "",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      if (
        (row.category === "Curtain" || row.source === "allCurtainOrders") &&
        (row.product_id || row.productId)
      ) {
        const pid = String(row.product_id || row.productId);

        await setDoc(
          doc(db, "productAvailability", `Curtain_${pid}`),
          {
            category: "Curtain",
            productId: pid,
            productName: row.displayName,
            price: row.numericPrice || 0,
            address: row.address || "",
            isAvailable: newStatus === "Available",
            status: newStatus,
            approvedForEmail:
              newStatus === "Available"
                ? ""
                : row.buyerEmail || row.approvedForEmail || "",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      setOrders((prev) =>
        prev.map((item) =>
          item.firestoreId === row.firestoreId
            ? { ...item, status: newStatus }
            : item
        )
      );

      await fetchOrders();
    } catch (err) {
      console.error("Toggle error:", err);
      setError(err.message || "Failed to update status");
    } finally {
      setTogglingId("");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h1 style={styles.heading}>JP Furnishing Admin Dashboard</h1>

        <div style={styles.topButtons}>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/admin/curtain-approval")}
          >
            Curtain
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/admin/bedsheet-approval")}
          >
            Bedsheet
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/admin/sofa-approval")}
          >
            Sofa
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/admin/doormat-approval")}
          >
            Doormat
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/admin/pillow-approval")}
          >
            Pillow
          </button>

          <button
            style={styles.refreshBtn}
            onClick={fetchOrders}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error ? <div style={styles.errorBox}>{error}</div> : null}

      <div style={styles.statsGrid}>
        <StatCard title="Orders" value={stats.totalOrders} />
        <StatCard title="Revenue" value={`₹${stats.totalRevenue}`} />
        <StatCard title="Products" value={stats.totalProducts} />
        <StatCard title="Customers" value={stats.totalCustomers} />
      </div>

      <div style={styles.chartGrid}>
        <div style={styles.chartCard}>
          <h2 style={styles.cardTitle}>Sales Overview</h2>
          <div style={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h2 style={styles.cardTitle}>Category Distribution</h2>
          <div style={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={styles.fullCard}>
        <h2 style={styles.cardTitle}>Revenue Trend</h2>
        <div style={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.tableCard}>
        <h2 style={styles.cardTitle}>Recent Orders</h2>

        {loading ? (
          <p style={styles.mutedText}>Loading orders...</p>
        ) : mergedRows.length === 0 ? (
          <p style={styles.mutedText}>No orders found.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Product ID</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Address / Approved For</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {mergedRows.map((row) => {
                  const currentStatus =
                    row.rowType === "availability"
                      ? row.isAvailable
                        ? "Available"
                        : "Not Available"
                      : row.status || "Available";

                  return (
                    <tr key={row.rowKey} style={styles.tr}>
                      <td style={styles.td}>{row.displayName}</td>
                      <td style={styles.td}>
                        {row.product_id || row.productId || "-"}
                      </td>
                      <td style={styles.td}>{row.category || "-"}</td>
                      <td style={styles.td}>₹{row.numericPrice || 0}</td>
                      <td style={styles.td}>
                        {row.rowType === "availability"
                          ? row.address !== "-"
                            ? row.address
                            : row.approvedForEmail || "-"
                          : row.address ||
                            row.approvedForEmail ||
                            row.buyerEmail ||
                            "-"}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background:
                              currentStatus === "Available"
                                ? "#dcfce7"
                                : "#fee2e2",
                            color:
                              currentStatus === "Available"
                                ? "#166534"
                                : "#991b1b",
                          }}
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.toggleBtn}
                          onClick={() => toggleStatus(row)}
                          disabled={togglingId === row.rowKey}
                        >
                          {togglingId === row.rowKey
                            ? "Updating..."
                            : currentStatus === "Available"
                            ? "Make Unavailable"
                            : "Make Available"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={styles.statCard}>
      <h3 style={styles.statTitle}>{title}</h3>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f2ec",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "16px",
    flexWrap: "wrap",
  },
  heading: {
    margin: 0,
    fontSize: "52px",
    fontWeight: "800",
    color: "#1f2937",
  },
  topButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  refreshBtn: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },
  secondaryBtn: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },
  logoutBtn: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },
  errorBox: {
    marginBottom: "18px",
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "12px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
    gap: "24px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#e5e7eb",
    borderRadius: "18px",
    padding: "28px 20px",
    textAlign: "center",
  },
  statTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#1f2937",
  },
  statValue: {
    margin: "12px 0 0",
    fontSize: "22px",
    color: "#1f2937",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "28px",
    marginBottom: "28px",
  },
  chartCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  fullCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "28px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    margin: "0 0 18px",
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
  },
  chartWrap: {
    width: "100%",
    height: "280px",
  },
  tableCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "2px solid #e5e7eb",
    fontSize: "16px",
    color: "#1f2937",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "14px 12px",
    color: "#374151",
    verticalAlign: "middle",
  },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    display: "inline-block",
  },
  toggleBtn: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  mutedText: {
    color: "#6b7280",
    margin: 0,
  },
};