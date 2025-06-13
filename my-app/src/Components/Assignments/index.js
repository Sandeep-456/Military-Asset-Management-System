import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRefresh } from '../../RefreshContext';
import './index.css'; // ✅ Make sure to import your CSS

function Assignments() {
  const [formData, setFormData] = useState({
    assetType: '', assetId: '', personnelId: '',
    assignmentDate: '', base: '', purpose: '', expectedReturnDate: ''
  });
  const [assignments, setAssignments] = useState([]);
  const { triggerRefresh } = useRefresh();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAssignments(res.data))
    .catch(err => {
      console.error('Error fetching assignments:', err);
      alert('Unauthorized access.');
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('/api/assignments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAssignments(prev => [...prev, { ...formData, id: res.data.id || prev.length + 1 }]);

      setFormData({
        assetType: '', assetId: '', personnelId: '',
        assignmentDate: '', base: '', purpose: '', expectedReturnDate: ''
      });
      triggerRefresh();
    } catch (err) {
      console.error('Error submitting assignment:', err);
      alert('Assignment failed.');
    }
  };

  return (
    <div className="assignments-container">
      <h2 className="page-title">Assignments</h2>

      <form onSubmit={handleSubmit} className="assignment-form">
        {['assetType', 'assetId', 'personnelId', 'base', 'purpose'].map(field => (
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
          <label>Assignment Date</label>
          <input
            type="date"
            name="assignmentDate"
            value={formData.assignmentDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Expected Return Date</label>
          <input
            type="date"
            name="expectedReturnDate"
            value={formData.expectedReturnDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn">Assign Asset</button>
      </form>

      <h3 className="section-title">Current Assignments</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asset Type</th>
              <th>Asset ID</th>
              <th>Personnel ID</th>
              <th>Assignment Date</th>
              <th>Base</th>
              <th>Purpose</th>
              <th>Expected Return</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.assetType}</td>
                <td>{a.assetId}</td>
                <td>{a.personnelId}</td>
                <td>{a.assignmentDate}</td>
                <td>{a.base}</td>
                <td>{a.purpose}</td>
                <td>{a.expectedReturnDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assignments;
