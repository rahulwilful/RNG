import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DetailedWinHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const group = location.state?.group || [];

  const [data, setData] = useState(group);

  const [s2, setS2] = useState(0);
  const [s3, setS3] = useState(0);
  const [s4, setS4] = useState(0);
  const [s5, setS5] = useState(0);
  const [s6, setS6] = useState(0);
  const [s7, setS7] = useState(0);
  const [s8, setS8] = useState(0);
  const [s9, setS9] = useState(0);
  const [s10, setS10] = useState(0);

  const [totalItemsOf2s, setTotalItemsOf2s] = useState(0);
  const [totalWin, setTotalWin] = useState(0);

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
    let tempTotalWin = 0;

    for (let i = 0; i < group.length; i++) {
      if (group[i]?.winningNumber != '') {
        tempTotalWin++;
      }

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
    setTotalWin(tempTotalWin);
  };

  useEffect(() => {
    calculate2s();
    claculateItemsOf2s();
    highlightAlternate();
  }, [group]);

  const highlightAlternate = () => {
    const updatedGroup = [...group];

    // Helper function to check if an item is a win
    const isWin = item => {
      return item.winningNumber !== null && item.winningNumber !== undefined && item.winningNumber !== '';
    };

    // Check for alternating pattern (Win, Loss, Win, Loss, ...)
    for (let i = 0; i < updatedGroup.length - 3; i++) {
      const win1 = isWin(updatedGroup[i]);
      const win2 = isWin(updatedGroup[i + 1]);
      const win3 = isWin(updatedGroup[i + 2]);
      const win4 = isWin(updatedGroup[i + 3]);

      // Check if the pattern is alternating (Win, Loss, Win, Loss or Loss, Win, Loss, Win)
      const isAlternating = win1 !== win2 && win2 !== win3 && win3 !== win4;

      if (isAlternating) {
        // Highlight the 4 items in the alternating pattern
        for (let j = i; j < i + 4 && j < updatedGroup.length; j++) {
          updatedGroup[j] = {
            ...updatedGroup[j],
            background: '#ffcccc' // Light red
          };
        }
      }
    }
    setData(updatedGroup);
    highlightSeries(updatedGroup);
  };

  const highlightSeries = groupToHighlight => {
    const updatedGroup = [...groupToHighlight];

    // Check for 3+ consecutive wins or losses
    for (let i = 0; i < updatedGroup.length - 2; i++) {
      const isWin1 = !!updatedGroup[i].winningNumber;
      const isWin2 = !!updatedGroup[i + 1].winningNumber;
      const isWin3 = !!updatedGroup[i + 2].winningNumber;

      // Check if all 3 are wins or all 3 are losses
      if ((isWin1 && isWin2 && isWin3) || (!isWin1 && !isWin2 && !isWin3)) {
        // Highlight the 3+ items in the series
        for (let j = i; j < updatedGroup.length; j++) {
          const isWinJ = !!updatedGroup[j].winningNumber;
          if ((isWinJ && isWin1) || (!isWinJ && !isWin1)) {
            updatedGroup[j] = {
              ...updatedGroup[j],
              background: '#ccccff' // Light blue
            };
          } else {
            break; // Stop if the series breaks
          }
        }
      }
    }
  };

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
          <div className="fw-bold mb-2">Series</div>

          <div className="d-flex flex-wrap justify-content-center gap-2">
            <span className="badge bg-dark">
              2S: {s2}/{totalItemsOf2s} ({(((totalItemsOf2s - s2) / s2) * 100).toFixed(2)} ) ({((totalItemsOf2s / group.length) * 100).toFixed(2)} )
            </span>
            <span className="badge bg-dark">3S: {s3}</span>
            <span className="badge bg-dark">4S: {s4}</span>
            <span className="badge bg-dark">
              Win/Loose: {totalWin} / {group.length - totalWin}
            </span>

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
        <div className="d-flex  flex-wrap  justify-content-center">
          {data.map(item => {
            const latestWinning = group[0]?.winningNumber;
            const isWinning = item.winningNumber === latestWinning;

            return (
              <div
                key={item.id}
                data-id={item.id} // Add this for DOM selection
                style={{
                  minWidth: '70px',
                  backgroundColor: item.background || '#f8f9fa' // Use the background from state or default
                }}
                className={` px-1 py-1 border`}>
                <div
                  className="result-box  fw-bold text-center  rounded px-1 py-1"
                  style={{
                    // 👈 minimum size
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailedWinHistory;
