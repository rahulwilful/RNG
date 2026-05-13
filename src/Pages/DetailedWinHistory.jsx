import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DetailedWinHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const group = location.state?.group || [];

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

  if (!group.length) {
    return <div className="text-center mt-5">No Data Found</div>;
  }

  const startTime = new Date(group[group.length - 1].createdAt);
  const endTime = new Date(group[0].createdAt);

  const calculate2s = () => {
    let count = 0;

    for (let i = 0; i < group.length; i++) {
      if (group[i]?.winningNumber && group[i + 1]?.winningNumber) {
        count++;
      }

      if (!group[i]?.winningNumber && !group[i + 1]?.winningNumber) {
        count++;
      }
    }

    setS2(count);
    calculate3s();
  };

  const calculate3s = () => {
    let count = 0;

    for (let i = 0; i < group.length; i++) {
      if (group[i]?.winningNumber && group[i + 1]?.winningNumber && group[i + 2]?.winningNumber) {
        count++;
      }

      if (!group[i]?.winningNumber && !group[i + 1]?.winningNumber && !group[i + 2]?.winningNumber) {
        count++;
      }
    }

    setS3(count);
    calculate4s();
  };

  const calculate4s = () => {
    let count = 0;

    for (let i = 0; i < group.length; i++) {
      if (group[i]?.winningNumber && group[i + 1]?.winningNumber && group[i + 2]?.winningNumber && group[i + 3]?.winningNumber) {
        count++;
      }

      if (!group[i]?.winningNumber && !group[i + 1]?.winningNumber && !group[i + 2]?.winningNumber && !group[i + 3]?.winningNumber) {
        count++;
      }
    }

    setS4(count);
  };

  const claculateItemsOf2s = () => {
    let totalItems = 0;
    let count = 0;
    let count2 = 0;

    for (let i = 0; i < group.length; i++) {
      if (group[i]?.winningNumber && group[i + 1]?.winningNumber) {
        if (count == 0) {
          count = 2;

          continue;
        } else {
          count2++;

          continue;
        }
      }

      if (!group[i]?.winningNumber && !group[i + 1]?.winningNumber) {
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
  }, [group]);

  return (
    <div className="container mt-2">
      {/* BACK */}
      <div className="d-flex mb-2">
        <i className="bi bi-arrow-left fs-4" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}></i>
      </div>

      {/* HEADER INFO */}
      <div className="card p-3 mb-3 shadow-sm rounded-4">
        <div className="d-flex justify-content-between small text-muted">
          <div>
            <strong>Start:</strong> {startTime.toLocaleString()}
          </div>
          <div>
            <strong>End:</strong> {endTime.toLocaleString()}
          </div>
        </div>

        <div className="text-center mt-2">
          <strong>Total Results:</strong> {group.length}
        </div>
        <div className="card p-3 mb-3 shadow-sm rounded-4 text-center">
          <div className="fw-bold mb-2">Series (Overlapping)</div>

          <div className="d-flex flex-wrap justify-content-center gap-2">
            <span className="badge bg-dark">
              2S: {s2} / {totalItemsOf2s}
            </span>
            <span className="badge bg-dark">3S: {s3}</span>
            <span className="badge bg-dark">4S: {s4}</span>
            {/* <span className="badge bg-dark">5S: {s5}</span>
            <span className="badge bg-dark">6S: {s6}</span>
            <span className="badge bg-dark">7S: {s7}</span>
            <span className="badge bg-dark">8S: {s8}</span>
            <span className="badge bg-dark">9S: {s9}</span>
            <span className="badge bg-dark">10S: {s10}</span> */}
          </div>
        </div>
      </div>

      {/* DETAILED LIST */}
      <div className="card p-3 shadow-sm rounded-4">
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {group.map(item => {
            const latestWinning = group[0]?.winningNumber;
            const isWinning = item.winningNumber === latestWinning;

            return (
              <div
                key={item.id}
                className="fw-bold text-center rounded px-3 py-2"
                style={{
                  minWidth: '60px', // 👈 minimum size
                  backgroundColor: item.winningNumber === 0 ? '#ffc107' : item.winningNumber ? '#ffc107' : '#6c757d',
                  color: isWinning ? '#fff' : '#fff',
                  fontSize: '14px'
                }}>
                {/* NUMBER */}
                <div style={{ fontSize: '18px' }}>{item.winningNumber}</div>

                {/* COUNTS */}
                <div className="small">C1: {item.count1 ?? 0}</div>
                <div className="small">C2: {item.count2 ?? 0}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailedWinHistory;
