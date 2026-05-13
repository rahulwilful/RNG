import React, { useEffect, useState } from 'react';
import { clearHistory, getHistory, deleteHistoryItem, saveHistoryItem } from '../IndexDB/IndexDB';
import { RouletteNumbersSorted } from '../constants/RouletteNumbers';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../components/DeleteModal';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ITEMS_PER_PAGE = 5;

const History = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [s2, setS2] = React.useState(0);
  const [s3, setS3] = React.useState(0);
  const [s4, setS4] = React.useState(0);
  const [s5, setS5] = React.useState(0);
  const [s6, setS6] = React.useState(0);
  const [s7, setS7] = React.useState(0);
  const [s8, setS8] = React.useState(0);
  const [s9, setS9] = React.useState(0);
  const [s10, setS10] = React.useState(0);

  const [totalItemsOf2s, setTotalItemsOf2s] = React.useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();

    // ✅ latest first
    const sorted = data.sort((a, b) => b.createdAt - a.createdAt);

    setHistory(sorted);
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

  const handleDownloadXl = () => {
    if (!history.length) {
      alert('No data to export');
      return;
    }

    // Prepare data
    const formattedData = history.map(item => ({
      Date: new Date(item.createdAt).toLocaleString(),
      WinningNumber: item.winningNumber,
      Numbers: item.numbers.join(', '),

      Sum: item.sumAmount ?? 0,
      Bet: item.betAmount ?? 0,
      Win: item.winAmount ?? '',

      SideBet: item.sideBetAmount ?? 0,
      SideWin: item.sideWinAmount ?? 0,
      count1: item.count1 ?? 0,
      count2: item.count2 ?? 0,
      count3: item.count3 ?? 0,
      count4: item.count4 ?? 0
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'History');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(file, `Roulette_History_${Date.now()}.xlsx`);
  };

  const uploadXl = e => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async evt => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData.length) {
          alert('Excel is empty');
          return;
        }

        // Convert Excel → DB format
        const formatted = jsonData.map((row, index) => ({
          id: Date.now() + index, // unique id

          createdAt: row.Date ? new Date(row.Date).getTime() : Date.now(),

          winningNumber: Number(row.WinningNumber) || '',

          numbers: row.Numbers ? row.Numbers.split(',').map(n => Number(n.trim())) : [],

          sumAmount: Number(row.Sum) || 0,
          betAmount: Number(row.Bet) || 0,
          winAmount: Number(row.Win) || 0,

          sideBetAmount: Number(row.SideBet) || 0,
          sideWinAmount: Number(row.SideWin) || 0,

          count1: Number(row.count1) || 0,
          count2: Number(row.count2) || 0,
          count3: Number(row.count3) || 0,
          count4: Number(row.count4) || 0
        }));

        // Save all records
        for (const item of formatted) {
          await saveHistoryItem(item);
        }

        alert('Upload successful ✅');
        loadHistory();
      } catch (err) {
        console.error(err);
        alert('Error reading Excel file');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const calculate2s = () => {
    let count = 0;

    for (let i = 0; i < history.length; i++) {
      if (history[i]?.winningNumber && history[i + 1]?.winningNumber) {
        count++;
      }

      if (!history[i]?.winningNumber && !history[i + 1]?.winningNumber) {
        count++;
      }
    }

    setS2(count);
    calculate3s();
  };

  const calculate3s = () => {
    let count = 0;

    for (let i = 0; i < history.length; i++) {
      if (history[i]?.winningNumber && history[i + 1]?.winningNumber && history[i + 2]?.winningNumber) {
        count++;
      }

      if (!history[i]?.winningNumber && !history[i + 1]?.winningNumber && !history[i + 2]?.winningNumber) {
        count++;
      }
    }

    setS3(count);
    calculate4s();
  };

  const calculate4s = () => {
    let count = 0;

    for (let i = 0; i < history.length; i++) {
      if (history[i]?.winningNumber && history[i + 1]?.winningNumber && history[i + 2]?.winningNumber && history[i + 3]?.winningNumber) {
        count++;
      }

      if (!history[i]?.winningNumber && !history[i + 1]?.winningNumber && !history[i + 2]?.winningNumber && !history[i + 3]?.winningNumber) {
        count++;
      }
    }

    setS4(count);
  };

  const claculateItemsOf2s = () => {
    let totalItems = 0;
    let count = 0;
    let count2 = 0;

    for (let i = 0; i < history.length; i++) {
      if (history[i]?.winningNumber && history[i + 1]?.winningNumber) {
        if (count == 0) {
          count = 2;

          continue;
        } else {
          count2++;

          continue;
        }
      }

      if (!history[i]?.winningNumber && !history[i + 1]?.winningNumber) {
        if (count == 0) {
          count = 2;

          continue;
        } else {
          count2++;

          continue;
        }
      }

      totalItems = totalItems + count + count2;

      count = 0;
      count2 = 0;
    }
    setTotalItemsOf2s(totalItems);
  };

  useEffect(() => {
    calculate2s();
    claculateItemsOf2s();
  }, [history]);

  return (
    <>
      <DeleteModal show={showModal} closeModal={() => setShowModal(false)} handleClearHistory={handleClearHistory} message={'Confirm Delete History'} />

      <div className="container-fluid bg-light min-vh-100 p-3">
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-arrow-left fw-bold fs-4" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}></i>

          <h3 className="text-center flex-grow-1 mb-0">History</h3>
          <div className="d-flex gap-3 align-items-center">
            <i className="bi bi-cloud-upload fs-3" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('uploadExcel').click()} />
            <input type="file" accept=".xlsx, .xls" id="uploadExcel" style={{ display: 'none' }} onChange={uploadXl} />
            <i className="bi bi-cloud-download  fs-3 " onClick={handleDownloadXl} style={{ cursor: 'pointer' }}></i>
            <i className="bi bi-trash fs-3" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}></i>
          </div>
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
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <span className="badge bg-dark">
                2S: {s2} / {totalItemsOf2s}
              </span>
              <span className="badge bg-dark">3S: {s3}</span>
              <span className="badge bg-dark">4S: {s4}</span>
              <span className="badge bg-dark">Total: {history.length}</span>
              {/* <span className="badge bg-dark">5S: {s5}</span>
            <span className="badge bg-dark">6S: {s6}</span>
            <span className="badge bg-dark">7S: {s7}</span>
            <span className="badge bg-dark">8S: {s8}</span>
            <span className="badge bg-dark">9S: {s9}</span>
            <span className="badge bg-dark">10S: {s10}</span> */}
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
                  <div className="d-flex mt-3 flex-sm-column flex-row gap-4 justify-content-center">
                    {/* SORTED */}
                    <div>
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
                    </div>

                    {/* ORIGINAL */}
                    <div>
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
                    </div>
                  </div>

                  {/* AMOUNTS */}

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
