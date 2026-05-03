import { useEffect, useState, useRef } from 'react';

import { Random } from 'random-js';
import { RouletteNumbersSorted } from '../constants/RouletteNumbers';
import { clearCounts, clearHistory, getAmounts, getCounts, getCurrentNumbers, getHistory, saveCounts, saveCurrentNumbers, saveHistory, updateAmounts } from '../IndexDB/IndexDB';
import ManualModal from '../components/ManualModal';
import { Link } from 'react-router-dom';

const Home = () => {
  const [numbers, setNumbers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [showMissingNumbers, setShowMissingNumbers] = useState(false);

  const [missingNumbers, setMissingNumbers] = useState([]);

  const isFirstLoad = useRef(true);

  const [sumAmount, setSumAmount] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [winAmount, setWinAmount] = useState(0);

  const [history, setHistory] = useState([]);

  // store sorted version of numbers
  const [sortedNumbers, setSortedNumbers] = useState([]);

  // counters for UI buttons (can be used for tracking stats)
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);

  const [totalGenerated, setTotalGenerated] = useState(0);

  // winning number entered by user
  const [winningNumber, setWinningNumber] = useState(null);

  useEffect(() => {
    const loadCounts = async () => {
      const data = await getCounts();
      console.log(data);

      if (data) {
        setCount1(data.count1 || 0);
        setCount2(data.count2 || 0);
        setCount3(data.count3 || 0);
        setCount4(data.count4 || 0);
      }
    };

    loadCounts();
    getAllAmounts();
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    console.log('history', data);
    setHistory(data || []);
  };

  const getAllAmounts = async () => {
    console.log('getAmounts called');
    const data = await getAmounts();
    console.log('getAmounts -> data', data);
    if (data) {
      setSumAmount(data.sumAmount || 0);
      setBetAmount(data.betAmount || 0);
      setWinAmount(data.winAmount || 0);
    }
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return; // 🚫 skip first run
    }

    saveCounts({
      count1,
      count2,
      count3,
      count4
    });
  }, [count1, count2, count3, count4]);

  const reduceCountsBy1AndSave = () => {
    const counts = { count1: count1 - 1, count2: count2 - 1, count3: count3 - 1, count4: count4 - 1 };
    saveCounts(counts);
    setCount1(prev => Math.max(prev - 1, 0));
    setCount2(prev => Math.max(prev - 1, 0));
    setCount3(prev => Math.max(prev - 1, 0));
    setCount4(prev => Math.max(prev - 1, 0));

    setShowModal(false);
  };

  const handleClearCounts = async () => {
    console.log('handleClearCounts called');
    await clearCounts();

    setCount1(0);
    setCount2(0);
    setCount3(0);
    setCount4(0);
    setShowModal(false);
  };

  // generate a random number between 0–36
  const generateRandomNumber = i => {
    const random = new Random();
    const number = random.integer(0, 36);
    // console.log('generateRandomNumber -> number ' + i + ' -> ', number);
    return number;
  };

  // generate 19 UNIQUE numbers using Set (duplicates auto removed)
  const generate19UniqueNumbers = () => {
    const uniqueNumbers = new Set();
    let i = 0;

    while (uniqueNumbers.size < 19) {
      uniqueNumbers.add(generateRandomNumber(i));
      i++;
    }

    setTotalGenerated(i);

    return Array.from(uniqueNumbers);
  };

  // generate numbers + sorted numbers
  const handleGenerate = async () => {
    setWinningNumber(null);

    const result = generate19UniqueNumbers();
    setNumbers(result);
    await saveCurrentNumbers(result);

    // sorted numbers
    const sorted = [...result].sort((a, b) => a - b);
    setSortedNumbers(sorted);

    // 👉 find missing numbers (0–36)
    const allNumbers = Array.from({ length: 37 }, (_, i) => i);

    const missing = allNumbers.filter(num => !result.includes(num));

    setMissingNumbers(missing);
  };

  const getCurrentGeneratedNumbers = async () => {
    const result = await getCurrentNumbers();
    if (result.length > 0) {
      console.log('saved Result: ', result);
      setNumbers(result);
      const sorted = [...result].sort((a, b) => a - b);
      setSortedNumbers(sorted);

      // 👉 find missing numbers (0–36)
      const allNumbers = Array.from({ length: 37 }, (_, i) => i);

      const missing = allNumbers.filter(num => !result.includes(num));

      setMissingNumbers(missing);

      return;
    }
    handleGenerate();
  };

  // run once on component mount
  useEffect(() => {
    // handleGenerate();
    getCurrentGeneratedNumbers();
  }, []);

  // helper: get color (red/black/green) for a number
  const getColor = num => {
    return RouletteNumbersSorted.find(n => n.number === num)?.color;
  };

  // helper: map color to actual background color
  const getBgColor = color => {
    if (color === 'red') return '#dc3545';
    if (color === 'black') return '#212529';
    return 'green';
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const saveHistoryEntry = async tempSumAmount => {
    await saveHistory({
      numbers,
      winningNumber,
      count1,
      count2,
      count3,
      count4,
      sumAmount: tempSumAmount || sumAmount,
      betAmount,
      winAmount
    });
  };

  const increaseProfit = async () => {
    setCount1(count1 + 1);
    const tempSumAmount = sumAmount + winAmount;

    const payload = {
      sumAmount: tempSumAmount,
      betAmount: betAmount,
      winAmount: winAmount
    };

    await updateAmounts(payload);

    await getAllAmounts();
    await saveHistoryEntry(tempSumAmount);
    loadHistory();
  };

  const decreaseProfit = async () => {
    setCount2(count2 + 1);
    const tempSumAmount = sumAmount - betAmount;

    const payload = {
      sumAmount: tempSumAmount,
      betAmount: betAmount,
      winAmount: winAmount
    };

    await updateAmounts(payload);

    await getAllAmounts();
    await saveHistoryEntry(tempSumAmount);
    loadHistory();
  };

  return (
    <>
      <ManualModal show={showModal} message={'Clear Data'} handleClearCounts={handleClearCounts} reduceCountsBy1AndSave={reduceCountsBy1AndSave} onHide={() => setShowModal(false)} closeModal={closeModal} />
      <div className="container-fluid bg-light text-dark min-vh-100 p-3">
        {/* Counter buttons */}
        <div className="d-flex justify-content-center gap-1">
          <button className={`btn btn-sm d-flex btn-success mb-3 ${count1 > 0 ? 'px-4  ' : ''}`} onClick={() => increaseProfit()}>
            <i className="bi bi-arrow-up"></i> {count1 || 'count1'}
          </button>
          <button className={`btn btn-sm d-flex btn-success mb-3 ${count2 > 0 ? 'px-4  ' : ''}`} onClick={() => decreaseProfit()}>
            <i className="bi bi-arrow-down"></i> {count2 || 'count2'}
          </button>
          <Link to="/sum-and-bets">
            <button className={`btn btn-sm d-flex btn-success mb-3 ${count2 > 0 ? 'px-4  ' : ''}`}>{sumAmount || 'sum'}</button>
          </Link>
          {/*    <button className={`btn btn-sm d-flex btn-danger mb-3 ${count3 > 0 ? 'px-4 ' : ''}`} onClick={() => setCount3(count3 + 1)}>
            <i className="bi bi-arrow-up"></i> {count3 || 'count3'}
          </button>
          <button className={`btn btn-sm d-flex btn-danger mb-3 ${count4 > 0 ? 'px-4 ' : ''}`} onClick={() => setCount4(count4 + 1)}>
            <i className="bi bi-arrow-down"></i> {count4 || 'count4'}
          </button> */}

          <button className={`btn btn-sm d-flex btn-danger mb-3 ${count4 > 0 ? 'px-1 ' : ''}`} onClick={() => setShowModal(true)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Generate + Input */}
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-sm btn-primary fs-7 text-nowrap mb-3" onClick={handleGenerate}>
            Generate ({totalGenerated})
          </button>

          <button className="btn btn-sm btn-primary fs-7 text-nowrap mb-3" onClick={saveHistoryEntry}>
            <i className="bi bi-floppy2"></i>
          </button>
          <Link to="/history">
            <button className="btn btn-sm btn-primary fs-7 text-nowrap mb-3">History</button>
          </Link>
        </div>

        <div className="">
          {history.length > 0 && (
            <div className="card p-3 mb-3 shadow-sm rounded-4">
              <div className="d-flex overflow-auto" style={{ whiteSpace: 'nowrap' }}>
                {history.map((num, index) => {
                  const isWinning = num === history[history.length - 1].winningNumber;

                  return (
                    <div
                      key={index}
                      className="text-center fw-bold me-2 rounded"
                      style={{
                        minWidth: '20px',
                        height: '20px',
                        lineHeight: '20px',
                        backgroundColor: num.winningNumber ? '#ffc107' : '#6c757d',
                        color: isWinning ? '#000' : '#fff',
                        fontSize: '16px',
                        flexShrink: 0
                      }}></div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="d-flex mt-3 flex-sm-column flex-row gap-1 justify-content-center">
          {/* Sorted Numbers */}
          <div className="border p-2 rounded shadow mt-0 mt-sm-3">
            <h4 className="text-center fs-6 fs-sm-4 ">Sorted Numbers</h4>
            <div className="row justify-content-center">
              {sortedNumbers?.map((num, index) => {
                const color = getColor(num);

                const isWinning = winningNumber !== null && winningNumber !== '' && Number(winningNumber) === num;

                return (
                  <button
                    key={index}
                    onClick={() => setWinningNumber(num)}
                    className={`rounded shadow-xs btn-sm  col-3 col-sm-2 col-md-1 text-light m-1 text-center fw-bold border-0 ${isWinning ? '' : ''}`}
                    style={{
                      backgroundColor: isWinning ? '#ffc107' : getBgColor(color),
                      padding: '10px',
                      fontSize: '18px',
                      color: isWinning ? '#000' : '#fff'
                    }}>
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border p-2 rounded shadow mt-0 mt-sm-3">
            {/* Unique Numbers */}
            <h4 className="text-center fs-6 fs-sm-4">Unique Numbers</h4>
            <div className="row justify-content-center text-light">
              {numbers?.map((num, index) => {
                const color = getColor(num);

                // check if this is the winning number
                const isWinning = winningNumber !== null && winningNumber !== '' && Number(winningNumber) === num;

                return (
                  <button
                    key={index}
                    onClick={() => setWinningNumber(num)}
                    className={`rounded shadow-xs btn-sm  col-3 col-sm-2 col-md-1 text-light m-1 text-center fw-bold border-0 ${isWinning ? '' : ''}`}
                    style={{
                      backgroundColor: isWinning ? '#ffc107' : getBgColor(color),
                      padding: '10px',
                      fontSize: '18px',
                      color: isWinning ? '#000' : '#fff'
                    }}>
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <div className="border p-2 rounded shadow mt-3">
            <div className="w-100  d-flex px-4">
              <i className={`bi ${showMissingNumbers ? 'bi-eye-slash-fill' : 'bi-eye-fill'} `} style={{ cursor: 'pointer' }} onClick={() => setShowMissingNumbers(!showMissingNumbers)}></i>
            </div>
            <div className={`${showMissingNumbers ? 'd-block' : 'd-none'}  `}>
              <h4 className="text-center fs-6 fs-sm-4">Missing Numbers</h4>
              <div className="row justify-content-center">
                {missingNumbers?.map((num, index) => {
                  const color = getColor(num);

                  return (
                    <button
                      key={index}
                      className="rounded shadow-xs btn-sm col-3 col-sm-2 col-md-1 m-1 text-center fw-bold border-0"
                      style={{
                        backgroundColor: getBgColor(color),
                        padding: '10px',
                        fontSize: '18px',
                        color: '#fff'
                      }}>
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
