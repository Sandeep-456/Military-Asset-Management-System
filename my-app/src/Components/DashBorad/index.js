import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    base: '',
    equipmentType: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState({ purchases: [], transfersIn: [], transfersOut: [] });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        });
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      }
    };

    fetchDashboardData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleNetMovementClick = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/dashboard/details', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setDetails(res.data);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch Net Movement details:', err);
    }
  };

  if (!stats) return <p>Loading dashboard...</p>;

  const barData = {
    labels: stats.purchaseSummary?.map(item => item.assetType) || [],
    datasets: [
      {
        label: 'Purchased Qty',
        data: stats.purchaseSummary?.map(item => item.quantity) || [],
        backgroundColor: '#4e73df',
      },
    ],
  };

  const pieData = {
    labels: stats.baseSummary?.map(item => item.base) || [],
    datasets: [
      {
        label: 'Assets by Base',
        data: stats.baseSummary?.map(item => item.count) || [],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Military Asset Dashboard</h2>

      {/* Filters */}
      <div className="dashboard-filters">
        <div className="form-group">
          <label>From Date</label>
          <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
        </div>
        <div className="form-group">
          <label>To Date</label>
          <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
        </div>
        <div className="form-group">
          <label>Base</label>
          <input name="base" placeholder="e.g. Base Alpha" value={filters.base} onChange={handleFilterChange} />
        </div>
        <div className="form-group">
          <label>Equipment Type</label>
          <input name="equipmentType" placeholder="e.g. Rifle" value={filters.equipmentType} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-cards">
        <div className="card"><h4>Opening Balance</h4><p>{stats.openingBalance}</p></div>
        <div className="card" onClick={handleNetMovementClick} style={{ cursor: 'pointer', backgroundColor: '#f7f9ff' }}>
          <h4>Net Movement</h4><p>{stats.netMovement}</p>
        </div>
        <div className="card"><h4>Closing Balance</h4><p>{stats.closingBalance}</p></div>
        <div className="card"><h4>Total Purchased</h4><p>{stats.totalPurchased}</p></div>
        <div className="card"><h4>Total Assigned</h4><p>{stats.totalAssigned}</p></div>
        <div className="card"><h4>Total Expended</h4><p>{stats.totalExpended}</p></div>
        <div className="card"><h4>Total Transfers</h4><p>{stats.totalTransfers}</p></div>
      </div>

      {/* Charts */}
      <div className="chart-wrapper">
        <div className="chart-container">
          <h4>Purchases by Equipment Type</h4>
          <Bar data={barData} />
        </div>
        <div className="chart-container">
          <h4>Assets Distribution by Base</h4>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Net Movement Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-large">
            <h3>Net Movement Details</h3>

            <h4>Purchases</h4>
            <table>
              <thead>
                <tr><th>ID</th><th>Asset</th><th>Qty</th><th>Date</th><th>Base</th></tr>
              </thead>
              <tbody>
                {details.purchases.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.assetType}</td>
                    <td>{p.quantity}</td>
                    <td>{p.purchaseDate}</td>
                    <td>{p.receivingBase}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Transfers In</h4>
            <table>
              <thead>
                <tr><th>ID</th><th>Asset</th><th>Qty</th><th>Date</th><th>From</th><th>To</th></tr>
              </thead>
              <tbody>
                {details.transfersIn.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.assetType}</td>
                    <td>{t.quantity}</td>
                    <td>{t.transferDate}</td>
                    <td>{t.sourceBase}</td>
                    <td>{t.destinationBase}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Transfers Out</h4>
            <table>
              <thead>
                <tr><th>ID</th><th>Asset</th><th>Qty</th><th>Date</th><th>From</th><th>To</th></tr>
              </thead>
              <tbody>
                {details.transfersOut.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.assetType}</td>
                    <td>{t.quantity}</td>
                    <td>{t.transferDate}</td>
                    <td>{t.sourceBase}</td>
                    <td>{t.destinationBase}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="close-button" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
