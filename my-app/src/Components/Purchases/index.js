import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './index.css'

function Purchases() {
  const [formData, setFormData] = useState({
    assetType: '',
    model: '',
    quantity: '',
    unitCost: '',
    purchaseDate: '',
    supplier: '',
    receivingBase: '',
    purchaseOrderNumber: '',
    remarks: ''
  });

  const [filter, setFilter] = useState({
    equipmentType: '',
    receivingBase: '',
    fromDate: '',
    toDate: ''
  });

  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Fetch all purchases
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/api/purchases', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPurchases(res.data);
    setFilteredPurchases(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Form input
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const totalCost = parseFloat(formData.quantity || 0) * parseFloat(formData.unitCost || 0);
    const fullData = { ...formData, totalCost };

    await api.post('/api/purchases', fullData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchData(); // Refresh table
    setFormData({
      assetType: '', model: '', quantity: '', unitCost: '', purchaseDate: '',
      supplier: '', receivingBase: '', purchaseOrderNumber: '', remarks: ''
    });
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...purchases];

    if (filter.equipmentType) {
      filtered = filtered.filter(p => p.assetType.toLowerCase().includes(filter.equipmentType.toLowerCase()));
    }

    if (filter.receivingBase) {
      filtered = filtered.filter(p => p.receivingBase.toLowerCase().includes(filter.receivingBase.toLowerCase()));
    }

    if (filter.fromDate && filter.toDate) {
      filtered = filtered.filter(p => {
        const date = new Date(p.purchaseDate);
        return date >= new Date(filter.fromDate) && date <= new Date(filter.toDate);
      });
    }

    setFilteredPurchases(filtered);
    setShowModal(false);
  };

  const clearFilters = () => {
    setFilter({ equipmentType: '', receivingBase: '', fromDate: '', toDate: '' });
    setFilteredPurchases(purchases);
    setShowModal(false);
  };


  // Sorting logic
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const sorted = [...filteredPurchases].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setFilteredPurchases(sorted);
  };

  // Search logic
  const filteredAndSearched = filteredPurchases.filter(p =>
    Object.values(p).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="page-container">
      <h2 className="section-title">Purchases</h2>

      <form className="form-inline" onSubmit={handleSubmit}>
        {[
          ['assetType', 'Asset Type'],
          ['model', 'Model'],
          ['quantity', 'Qty'],
          ['unitCost', 'Unit Cost'],
          ['supplier', 'Supplier'],
          ['receivingBase', 'Receiving Base'],
          ['purchaseOrderNumber', 'PO No'],
          ['remarks', 'Remarks']
        ].map(([name, label]) => (
          <div key={name} className="form-group">
            <label>{label}</label>
            <input name={name} value={formData[name]} onChange={handleChange} required={label !== 'Remarks' && label !== 'PO No'} />
          </div>
        ))}
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
        </div>
        <button type="submit" className="filter-button" style={{ height: '42px' }}>Submit</button>
        <button type="button" className="filter-button" style={{ height: '42px' }} onClick={() => setShowModal(true)}>Filter</button>
      </form>

      {/* Filter Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Apply Filters</h3>
            <div className="form-group">
              <label>From Date</label>
              <input type="date" value={filter.fromDate} onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input type="date" value={filter.toDate} onChange={(e) => setFilter({ ...filter, toDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Equipment Type</label>
              <input value={filter.equipmentType} onChange={(e) => setFilter({ ...filter, equipmentType: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Receiving Base</label>
              <input value={filter.receivingBase} onChange={(e) => setFilter({ ...filter, receivingBase: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button onClick={applyFilters} className="submit-button" style={{ flex: 1 }}>Apply</button>
              <button onClick={clearFilters} className="filter-button" style={{ flex: 1, backgroundColor: "#e74a3b" }}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Sort */}
      <div className="search-sort-container">
        <input className="search-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {['id','assetType','model','quantity','unitCost','totalCost','supplier','receivingBase','purchaseOrderNumber','purchaseDate','remarks'].map((col) => (
                <th key={col} onClick={() => handleSort(col)}>
                  {col.replace(/([A-Z])/g, ' $1')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSearched.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.assetType}</td>
                <td>{p.model}</td>
                <td>{p.quantity}</td>
                <td>{p.unitCost}</td>
                <td>{p.totalCost}</td>
                <td>{p.supplier}</td>
                <td>{p.receivingBase}</td>
                <td>{p.purchaseOrderNumber}</td>
                <td>{p.purchaseDate}</td>
                <td>{p.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Purchases;
