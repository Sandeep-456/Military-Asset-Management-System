import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function Transfers() {
  const [formData, setFormData] = useState({
    assetType: '', assetId: '', quantity: '', sourceBase: '', destinationBase: '',
    transferDate: '', reason: '', approvingAuthority: '', remarks: ''
  });
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/transfers', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setTransfers(res.data))
    .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.post('/api/transfers', formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setTransfers([...transfers, { ...formData, id: res.data.id, status: 'Pending' }]);
      setFormData({
        assetType: '', assetId: '', quantity: '', sourceBase: '', destinationBase: '',
        transferDate: '', reason: '', approvingAuthority: '', remarks: ''
      });
    })
    .catch(err => console.error('Submit error:', err));
  };

  return (
    <div className="transfers-container">
      <h2 className="page-title">Asset Transfers</h2>

      <form className="transfer-form" onSubmit={handleSubmit}>
        {['assetType', 'assetId', 'quantity', 'sourceBase', 'destinationBase', 'reason', 'approvingAuthority', 'remarks'].map(field => (
          <div className="form-group" key={field}>
            <label>{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={field !== 'approvingAuthority' && field !== 'remarks'}
            />
          </div>
        ))}
        <div className="form-group">
          <label>Transfer Date</label>
          <input
            type="date"
            name="transferDate"
            value={formData.transferDate}
            onChange={handleChange}
            required
          />
        </div>
        <button className="submit-btn" type="submit">Submit Transfer</button>
      </form>

      <h3 className="sub-title">Transfer History</h3>
      <div className="table-container">
        <table className="transfer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asset Type</th>
              <th>Asset ID</th>
              <th>Quantity</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Approver</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.assetType}</td>
                <td>{t.assetId}</td>
                <td>{t.quantity}</td>
                <td>{t.sourceBase}</td>
                <td>{t.destinationBase}</td>
                <td>{t.transferDate}</td>
                <td>{t.reason}</td>
                <td>{t.status}</td>
                <td>{t.approvingAuthority}</td>
                <td>{t.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transfers;
