import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useRefresh } from '../../RefreshContext';
import './index.css'; // ✅ Import the stylesheet

function Expenditures() {
  const [formData, setFormData] = useState({
    assetType: '', quantityExpended: '', expenditureDate: '',
    base: '', reason: '', reportedBy: ''
  });
  const [expenditures, setExpenditures] = useState([]);
  const { triggerRefresh } = useRefresh();

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/api/expenditures', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setExpenditures(res.data))
    .catch(err => {
      console.error('Fetch error:', err);
      alert('Access denied.');
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await api.post('/api/expenditures', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenditures(prev => [...prev, { ...formData, id: res.data.id || prev.length + 1 }]);

      setFormData({
        assetType: '', quantityExpended: '', expenditureDate: '',
        base: '', reason: '', reportedBy: ''
      });
      triggerRefresh();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Expenditure submission failed.');
    }
  };

  return (
    <div className="expenditures-container">
      <h2 className="page-title">Expenditures</h2>

      <form onSubmit={handleSubmit} className="expenditure-form">
        {['assetType', 'quantityExpended', 'base', 'reason', 'reportedBy'].map(field => (
          <div className="form-group" key={field}>
            <label>{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="form-group">
          <label>Expenditure Date</label>
          <input
            type="date"
            name="expenditureDate"
            value={formData.expenditureDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Submit Expenditure</button>
      </form>

      <h3 className="section-title">Historical Expenditures</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asset Type</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Base</th>
              <th>Reason</th>
              <th>Reported By</th>
            </tr>
          </thead>
          <tbody>
            {expenditures.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.assetType}</td>
                <td>{item.quantityExpended}</td>
                <td>{item.expenditureDate}</td>
                <td>{item.base}</td>
                <td>{item.reason}</td>
                <td>{item.reportedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expenditures;
