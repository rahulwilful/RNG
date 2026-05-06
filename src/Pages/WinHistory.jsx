import React, { useEffect, useState } from 'react';
import { getHistory } from '../IndexDB/IndexDB';
import { Link, useNavigate } from 'react-router-dom';

const WinHistory = () => {
  const [groupedHistory, setGroupedHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();

    const groups = groupByTimeGap(data || []);
    setGroupedHistory(groups);
  };

  const groupByTimeGap = (data, gapInMs = 2 * 60 * 1000) => {
    if (!data.length) return [];

    const groups = [];
    let currentGroup = [data[0]];

    for (let i = 1; i < data.length; i++) {
      const prevTime = new Date(data[i - 1].createdAt).getTime();
      const currTime = new Date(data[i].createdAt).getTime();

      if (prevTime - currTime > gapInMs) {
        groups.push(currentGroup);
        currentGroup = [data[i]];
      } else {
        currentGroup.push(data[i]);
      }
    }

    groups.push(currentGroup);
    return groups;
  };

  return (
    <div>
      <div className="d-flex px-3">
        <i className="bi bi-arrow-left fw-bold fs-4" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}></i>
      </div>
      {groupedHistory.map((group, gIndex) => {
        const startTime = new Date(group[group.length - 1].createdAt);
        const endTime = new Date(group[0].createdAt);
        const totalResults = group.length;

        return (
          <div key={gIndex} className="card p-2 mb-2 shadow-sm  rounded-4">
            {/* GROUP INFO */}
            <div className="d-flex justify-content-between small text-muted mb-1 px-1">
              <div>
                <strong>Start:</strong> {startTime.toLocaleString()}
              </div>
              <div>
                <strong>End:</strong> {endTime.toLocaleString()}
              </div>
            </div>

            <div className="text-center small mb-1">
              <strong>Total:</strong> {totalResults}
            </div>

            {/* WINNING NUMBERS */}
            <div className="d-flex gap-2">
              <div className="d-flex  overflow-auto w-100" style={{ whiteSpace: 'nowrap' }}>
                {group.map(item => {
                  const latestWinning = group[0]?.winningNumber;
                  const isWinning = item.winningNumber === latestWinning;

                  return (
                    <div
                      key={item.id}
                      className="text-center fw-bold me-2 rounded"
                      style={{
                        minWidth: '20px',
                        height: '20px',
                        lineHeight: '20px',
                        backgroundColor: item.winningNumber === 0 ? '#ffc107' : item.winningNumber ? '#ffc107' : '#6c757d',
                        color: isWinning ? '#000' : '#fff',
                        fontSize: '16px',
                        flexShrink: 0
                      }}>
                      {item.winningNumber}
                    </div>
                  );
                })}
              </div>
              <div>
                <Link to="/detailed-win-history" state={{ group }} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <i className="bi bi-arrows-angle-expand"></i>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WinHistory;
