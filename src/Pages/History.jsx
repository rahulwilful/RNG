import React, { useEffect, useState } from 'react';
import { clearHistory, getHistory, deleteHistoryItem } from '../IndexDB/IndexDB';
import { RouletteNumbersSorted } from '../constants/RouletteNumbers';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../components/DeleteModal';

const ITEMS_PER_PAGE = 5;

const History = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data || []);
  };

  const handleClearHistory = async () => {
    await clearHistory();
    loadHistory();
    setShowModal(false);
  };

  // Pagination
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentData = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Totals
  const totals = history.reduce(
    (acc, item) => {
      acc.sum += item.sumAmount || 0;
      acc.bet += item.betAmount || 0;
      acc.win += item.winAmount || 0;
      return acc;
    },
    { sum: 0, bet: 0, win: 0 }
  );

  // Color helpers
  const getColor = num => {
    return RouletteNumbersSorted.find(n => n.number === num)?.color;
  };

  const getBgColor = color => {
    if (color === 'red') return '#dc3545';
    if (color === 'black') return '#212529';
    return 'green';
  };

  const handleDeleteItem = async id => {
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');

    if (!confirmDelete) return;

    await deleteHistoryItem(id);
    loadHistory();
  };

  return (
    <>
      <DeleteModal show={showModal} closeModal={() => setShowModal(false)} handleClearHistory={handleClearHistory} message={'Confirm Delete History'} />

      <div className="container-fluid bg-light min-vh-100 p-3">
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-arrow-left fw-bold fs-4" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}></i>

          <h3 className="text-center flex-grow-1 mb-0">History</h3>

          <i className="bi bi-trash fs-3" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}></i>
        </div>

        {/* TOTAL SUMMARY */}
        {history.length > 0 && (
          <div className="card p-3 mb-3 shadow-sm rounded-4">
            <div className="d-flex justify-content-around text-center">
              <div>
                <small>Total Sum</small>
                <div className="fw-bold">₹ {totals.sum}</div>
              </div>
              <div>
                <small>Total Bet</small>
                <div className="fw-bold text-danger">₹ {totals.bet}</div>
              </div>
              <div>
                <small>Total Win</small>
                <div className="fw-bold text-success">₹ {totals.win}</div>
              </div>
              <div>
                <small>Profit</small>
                <div className={`fw-bold ${totals.win - totals.bet >= 0 ? 'text-success' : 'text-danger'}`}>₹ {totals.win - totals.bet}</div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Top */}
        {history.length > 0 && (
          <div className="d-flex justify-content-center gap-2 mb-3">
            <button className="btn btn-sm btn-secondary" disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>
              Prev
            </button>

            <span className="align-self-center">
              Page {page} / {totalPages || 1}
            </span>

            <button className="btn btn-sm btn-secondary" disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)}>
              Next
            </button>
          </div>
        )}

        {/* HISTORY LIST */}
        {history.length > 0 ? (
          <>
            {currentData.map(item => {
              const profit = (item.winAmount ?? 0) - (item.betAmount ?? 0);

              return (
                <div key={item.id} className="border rounded p-3 mb-3 shadow-sm bg-white">
                  <div className="d-flex justify-content-end"></div>
                  {/* COUNTS */}
                  <div className="d-flex justify-content-center border-bottom pb-2 mb-2 gap-2">
                    <button className="btn btn-sm btn-success">↑ {item.count1}</button>
                    <button className="btn btn-sm btn-success">↓ {item.count2}</button>

                    <i className="bi bi-x-circle text-danger" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => handleDeleteItem(item.id)}></i>
                  </div>

                  {/* SORTED */}
                  <h6 className="text-center">Sorted</h6>
                  <div className="row justify-content-center mb-2">
                    {[...item.numbers]
                      .sort((a, b) => a - b)
                      .map((num, i) => {
                        const color = getColor(num);
                        const isWinning = num === item.winningNumber;

                        return (
                          <div
                            key={i}
                            className="col-3 col-sm-2 col-md-1 m-1 text-center fw-bold rounded"
                            style={{
                              backgroundColor: isWinning ? '#ffc107' : getBgColor(color),
                              padding: '8px',
                              color: isWinning ? '#000' : '#fff'
                            }}>
                            {num}
                          </div>
                        );
                      })}
                  </div>

                  {/* ORIGINAL */}
                  <h6 className="text-center">Original</h6>
                  <div className="row justify-content-center mb-2">
                    {item.numbers.map((num, i) => {
                      const color = getColor(num);
                      const isWinning = num === item.winningNumber;

                      return (
                        <div
                          key={i}
                          className="col-3 col-sm-2 col-md-1 m-1 text-center fw-bold rounded"
                          style={{
                            backgroundColor: isWinning ? '#ffc107' : getBgColor(color),
                            padding: '8px',
                            color: isWinning ? '#000' : '#fff'
                          }}>
                          {num}
                        </div>
                      );
                    })}
                  </div>

                  {/* AMOUNTS */}
                  <div className="row text-center mt-2 g-2">
                    <div className="col-4">
                      <div className="p-2 bg-light rounded shadow-sm">
                        <small className="text-muted d-block">Sum</small>
                        <span className="fw-bold">₹ {item.sumAmount ?? 0}</span>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="p-2 bg-light rounded shadow-sm">
                        <small className="text-muted d-block">Bet</small>
                        <span className="fw-bold text-danger">₹ {item.betAmount ?? 0}</span>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="p-2 bg-light rounded shadow-sm">
                        <small className="text-muted d-block">Win</small>
                        <span className="fw-bold text-success">₹ {item.winAmount ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* PROFIT */}
                  <div className="text-center mt-2">
                    <small className="text-muted">Profit / Loss</small>
                    <div className={`fw-bold ${profit >= 0 ? 'text-success' : 'text-danger'}`}>₹ {profit}</div>
                  </div>

                  {/* TIMESTAMP */}
                  <div className="text-center mt-2 small text-muted">{new Date(item.createdAt).toLocaleString()}</div>
                </div>
              );
            })}

            {/* Pagination Bottom */}
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="btn btn-sm btn-secondary" disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>
                Prev
              </button>

              <span className="align-self-center">
                Page {page} / {totalPages || 1}
              </span>

              <button className="btn btn-sm btn-secondary" disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)}>
                Next
              </button>
            </div>
          </>
        ) : (
          <h5 className="text-center mt-5">No history found</h5>
        )}
      </div>
    </>
  );
};

export default History;
