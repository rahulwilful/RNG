import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DetailedWinHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const group = location.state?.group || [];

  if (!group.length) {
    return <div className="text-center mt-5">No Data Found</div>;
  }

  const startTime = new Date(group[group.length - 1].createdAt);
  const endTime = new Date(group[0].createdAt);

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
                  backgroundColor: item.winningNumber == 0 ? '#ffc107' : item.winningNumber ? '#ffc107' : '#6c757d',
                  color: isWinning ? '#000' : '#fff',
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
