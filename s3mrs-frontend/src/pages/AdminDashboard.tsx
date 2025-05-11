import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import if needed elsewhere, not used here now
import api from "../api";
import { User, AdminStats } from "../types";
import { useAuth } from "../contexts/AuthContext";

// Import Chart.js components and CSS module
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import styles from './AdminDashboard.module.css'; // Import the CSS module

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch stats + users
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<AdminStats>("/admin/stats"),
      api.get<User[]>("/admin/users")
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data);
      setUsers(usersRes.data);
    }).catch(err => {
      console.error("Failed to load dashboard data:", err);
      // Handle error state if necessary
    }).finally(() => {
      setLoading(false); // Set loading to false once all data is fetched or failed
    });
  }, []); // Runs once on mount

  // Toggle ban status function
  const toggleBan = async (u: User) => {
    const action = u.banned ? "unban" : "ban";
    try {
      await api.patch(`/admin/users/${u.id}/${action}`);
      // Update state locally for immediate feedback
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, banned: !u.banned } : x))
      );
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      // Optionally revert state or show error message
    }
  };

  // --- Prepare Chart Data ---
  const bookingChartData = {
    labels: ['Pending', 'Approved', 'Declined'],
    datasets: [
      {
        label: ' Booking Statuses', // Note the space for better tooltip
        data: [
          stats?.bookings.pending ?? 0,
          stats?.bookings.approved ?? 0,
          stats?.bookings.declined ?? 0,
        ],
        backgroundColor: [
          'rgba(255, 193, 7, 0.7)',  // Pending - Yellow
          'rgba(40, 167, 69, 0.7)', // Approved - Green
          'rgba(220, 53, 69, 0.7)', // Declined - Red
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 4, // Pop out effect on hover
      },
    ],
  };

  const chartOptions = {
    responsive: true, // Make chart responsive
    maintainAspectRatio: false, // Allow custom aspect ratio / fit container
    plugins: {
      legend: {
        position: 'top' as const, // Position legend at the top
      },
      title: {
        display: true,
        text: 'Booking Status Distribution', // Chart title
        font: {
            size: 16
        }
      },
      tooltip: {
          callbacks: {
              label: function(context: any) {
                  let label = context.dataset.label || '';
                  if (label) {
                      label += ': ';
                  }
                  if (context.parsed !== null) {
                      // Calculate percentage
                      const total = context.dataset.data.reduce((acc: number, value: number) => acc + value, 0);
                      const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) + '%' : '0%';
                      label += `${context.parsed} (${percentage})`;
                  }
                  return label;
              }
          }
      }
    },
  };

  // --- Render Component ---
  if (loading) {
    return <div className={styles.loading}>Loading Dashboard Data...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <button onClick={logout} className={styles.logoutButton}>Logout</button>
      </header>

      <div className={styles.mainContent}>

        {/* --- Stats & Charts Column --- */}
        <div className={styles.statsAndCharts}>
          {/* Basic Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
              <span className={styles.statsValue}>{stats?.user_count ?? 'N/A'}</span>
              <span className={styles.statsLabel}>Total Users</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.statsValue}>{stats?.room_count ?? 'N/A'}</span>
              <span className={styles.statsLabel}>Total Rooms</span>
            </div>
          </div>

          {/* Booking Stats Card (Text) */}
          {stats && (
            <div className={styles.bookingStatsCard}>
               <h3>Booking Overview</h3>
               <div className={styles.bookingCounts}>
                    <span><strong className={styles.pending}>{stats.bookings.pending}</strong> Pending</span>
                    <span><strong className={styles.approved}>{stats.bookings.approved}</strong> Approved</span>
                    <span><strong className={styles.declined}>{stats.bookings.declined}</strong> Declined</span>
               </div>
            </div>
           )}

          {/* Booking Chart */}
          {stats && (
            <div className={styles.chartContainer}>
                {/* Ensure chart renders only when data is meaningful */}
                {(stats.bookings.pending + stats.bookings.approved + stats.bookings.declined) > 0 ? (
                     <Doughnut data={bookingChartData} options={chartOptions} />
                ) : (
                    <p>No booking data available for chart.</p>
                )}

            </div>
          )}
        </div>

        {/* --- User List Column --- */}
        <div className={styles.usersSection}>
          <h2 className={styles.usersTitle}>User Management</h2>
          {users.length > 0 ? (
            <ul className={styles.userList}>
              {users.map((u) => (
                <li key={u.id} className={styles.userItem}>
                  <div className={styles.userInfo}>
                    <span className={styles.userEmail} title={u.email}>{u.email}</span>
                    <span className={styles.userRole}>{u.role}</span>
                  </div>
                  <div className={styles.userStatus}>
                    {u.banned && <em className={styles.userBannedStatus}>(Banned)</em>}
                    <button
                      onClick={() => toggleBan(u)}
                      className={`${styles.toggleBanButton} ${
                        u.banned ? styles.unbanButton : styles.banButton
                      }`}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </div>

      </div>
    </div>
  );
}