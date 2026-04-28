import React, { useEffect, useState } from 'react';
import { clearHistory, getHistory } from '../IndexDB/IndexDB';

import { RouletteNumbersSorted } from '../constants/RouletteNumbers';
import { useNavigate } from 'react-router-dom';
import ManualModal from '../components/ManualModal';
import DeleteModal from '../components/DeleteModal';

const ITEMS_PER_PAGE = 5;

const History = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // fetch history
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    console.log('data: ', data);
    setHistory(data || []);
  };

  useEffect(() => {
    console.log('showModal:', showModal);
  }, [showModal]);

  const handleClearHistory = async () => {
    await clearHistory();
    loadHistory();
    setShowModal(false);
  };

  // pagination logic
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentData = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // color helpers
  const getColor = num => {
    return RouletteNumbersSorted.find(n => n.number === num)?.color;
  };

  const getBgColor = color => {
    if (color === 'red') return '#dc3545';
    if (color === 'black') return '#212529';
    return 'green';
  };

  return (
    <>
      <DeleteModal show={showModal} closeModal={() => setShowModal(false)} handleClearHistory={handleClearHistory} message={'Confirm Delete History'} />
      <div className="container-fluid bg-light min-vh-100 p-3">
        <div className="d-flex">
          <div>
            <i class="bi bi-arrow-left fw-bold fs-4" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}></i>
          </div>
          <div className="w-100">
            <h3 className="text-center mb-3">History</h3>
          </div>

          <div>
            <i class="bi bi-trash fs-3 " onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}></i>
          </div>
        </div>
        <div className={`${history.length > 0 ? '' : 'd-none'} d-flex justify-content-center gap-2 mb-3`}>
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

        {/* HISTORY LIST */}
        <div className={`${history.length > 0 ? '' : 'd-none'}`}>
          {currentData.map((item, idx) => (
            <div key={item.id} className="border rounded p-2 mb-3 shadow-sm">
              {/* COUNTS */}
              <div className="d-flex justify-content-center  border-bottom pb-1 border-primary rounded border-3 gap-1 mb-2">
                <button className="btn btn-sm btn-success">↑ {item.count1}</button>
                <button className="btn btn-sm btn-success">↓ {item.count2}</button>
                <button className="btn btn-sm btn-danger">↑ {item.count3}</button>
                <button className="btn btn-sm btn-danger">↓ {item.count4}</button>
              </div>

              {/* SORTED NUMBERS */}
              <div className="mb-2">
                <h6 className="text-center">Sorted</h6>
                <div className="row justify-content-center">
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
              </div>

              {/* ORIGINAL NUMBERS */}
              <div>
                <h6 className="text-center">Original</h6>
                <div className="row justify-content-center">
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
              </div>

              {/* TIMESTAMP */}
              <div className="text-center mt-2 small text-muted">{new Date(item.createdAt).toLocaleString()}</div>
            </div>
          ))}
          {/* PAGINATION */}
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
        </div>

        <div className={`${history.length > 0 ? 'd-none' : ''}`}>
          <h5 className="text-center mt-5">No history found</h5>
        </div>
      </div>
    </>
  );
};

export default History;
