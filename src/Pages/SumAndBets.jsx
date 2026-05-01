import React, { useEffect, useState } from 'react';
import { getAmounts, saveAmounts, updateAmounts } from '../IndexDB/IndexDB';
import { useNavigate } from 'react-router-dom';

const SumAndBets = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sumAmount: '',
    betAmount: '',
    winAmount: ''
  });

  const [isUpdate, setIsUpdate] = useState(false);

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      const data = await getAmounts();

      if (data) {
        setForm({
          sumAmount: data.sumAmount || '',
          betAmount: data.betAmount || '',
          winAmount: data.winAmount || ''
        });
        setIsUpdate(true);
      }
    };

    loadData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      sumAmount: Number(form.sumAmount) || 0,
      betAmount: Number(form.betAmount) || 0,
      winAmount: Number(form.winAmount) || 0
    };

    console.log(payload);

    try {
      if (isUpdate) {
        await updateAmounts(payload);
        navigate(-1);
      } else {
        await saveAmounts(payload);
        setIsUpdate(true);
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    }
  };

  const profit = (Number(form.winAmount) || 0) - (Number(form.betAmount) || 0);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-arrow-left fs-4 me-3" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}></i>
        <h4 className="mb-0 fw-bold">{isUpdate ? 'Update Amounts' : 'Add Amounts'}</h4>
      </div>

      {/* Card */}
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Sum */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                <i className="bi bi-cash-stack me-2"></i>Sum
              </label>
              <input type="number" name="sumAmount" value={form.sumAmount} onChange={handleChange} className="form-control form-control-lg rounded-3" placeholder="Enter total" min="0" />
            </div>

            {/* Bet */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                <i className="bi bi-arrow-down-circle me-2 text-danger"></i>Bet
              </label>
              <input type="number" name="betAmount" value={form.betAmount} onChange={handleChange} className="form-control form-control-lg rounded-3" placeholder="Enter bet" min="0" />
            </div>

            {/* Win */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                <i className="bi bi-arrow-up-circle me-2 text-success"></i>Win
              </label>
              <input type="number" name="winAmount" value={form.winAmount} onChange={handleChange} className="form-control form-control-lg rounded-3" placeholder="Enter win" min="0" />
            </div>
          </div>

          {/* Profit Display */}
          <div className="mt-4 p-3 rounded-3 text-center bg-light">
            <h6 className="mb-1 text-muted">Profit / Loss</h6>
            <h4 className={`fw-bold ${profit >= 0 ? 'text-success' : 'text-danger'}`}>₹ {profit}</h4>
          </div>

          {/* Button */}
          <div className="mt-4 d-grid">
            <button type="submit" className={`btn btn-lg rounded-3 fw-semibold ${isUpdate ? 'btn-warning' : 'btn-primary'}`}>
              {isUpdate ? 'Update Data' : 'Save Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SumAndBets;
