import { useEffect, useState } from 'react';
import './App.css';
import { Random } from 'random-js';
import { RouletteNumbersSorted } from './constants/RouletteNumbers';

function App() {
  // store randomly generated unique numbers
  const [numbers, setNumbers] = useState([]);

  // store sorted version of numbers
  const [sortedNumbers, setSortedNumbers] = useState([]);

  // counters for UI buttons (can be used for tracking stats)
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);

  // winning number entered by user
  const [winningNumber, setWinningNumber] = useState(null);

  // generate a random number between 0–36
  const generateRandomNumber = () => {
    const random = new Random();
    return random.integer(0, 36);
  };

  // generate 19 UNIQUE numbers using Set (duplicates auto removed)
  const generate19UniqueNumbers = () => {
    const uniqueNumbers = new Set();

    while (uniqueNumbers.size < 19) {
      uniqueNumbers.add(generateRandomNumber());
    }

    return Array.from(uniqueNumbers);
  };

  // generate numbers + sorted numbers
  const handleGenerate = () => {
    const result = generate19UniqueNumbers();
    setNumbers(result);

    // create sorted copy (ascending)
    const sorted = [...result].sort((a, b) => a - b);
    setSortedNumbers(sorted);
  };

  // run once on component mount
  useEffect(() => {
    handleGenerate();
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

  return (
    <div className="container-fluid bg-light text-dark min-vh-100 p-3">
      {/* Counter buttons */}
      <div className="d-flex justify-content-center gap-1">
        <button className={`btn btn-sm d-flex btn-success mb-3 ${count1 > 0 ? 'px-2  ' : ''}`} onClick={() => setCount1(count1 + 1)}>
          <i class="bi bi-arrow-up"></i> {count1 || 'count1'}
        </button>
        <button className={`btn btn-sm d-flex btn-success mb-3 ${count2 > 0 ? 'px-2  ' : ''}`} onClick={() => setCount2(count2 + 1)}>
          <i class="bi bi-arrow-down"></i> {count2 || 'count2'}
        </button>
        <button className={`btn btn-sm d-flex btn-danger mb-3 ${count3 > 0 ? 'px-2 ' : ''}`} onClick={() => setCount3(count3 + 1)}>
          <i class="bi bi-arrow-up"></i> {count3 || 'count3'}
        </button>
        <button className={`btn btn-sm d-flex btn-danger mb-3 ${count4 > 0 ? 'px-2 ' : ''}`} onClick={() => setCount4(count4 + 1)}>
          <i class="bi bi-arrow-down"></i> {count4 || 'count4'}
        </button>
      </div>

      {/* Generate + Input */}
      <div className="d-flex gap-2 justify-content-center">
        <button className="btn btn-sm btn-primary mb-3" onClick={handleGenerate}>
          Generate
        </button>

        {/* Bind input to winningNumber */}
        <div class="input-group input-group-sm mb-3">
          <input type="number" class="form-control" placeholder="Enter Winning Number" value={winningNumber ?? ''} onChange={e => setWinningNumber(Number(e.target.value))} />
        </div>
      </div>

      <div className="d-flex mt-3 flex-sm-column flex-row gap-1 justify-content-center">
        {/* Sorted Numbers */}
        <div className="border">
          <h4 className="text-center fs-6 fs-sm-4 ">Sorted Numbers</h4>
          <div className="row justify-content-center">
            {sortedNumbers.map((num, index) => {
              const color = getColor(num);

              const isWinning = Number(winningNumber) === num;

              return (
                <div
                  key={index}
                  className={`col-3 col-sm-2 col-md-1 text-light m-1 text-center fw-bold rounded ${isWinning ? 'border border-3 border-warning' : ''}`}
                  style={{
                    backgroundColor: isWinning ? '#ffc107' : getBgColor(color),
                    padding: '10px',
                    fontSize: '18px',
                    color: isWinning ? '#000' : '#fff'
                  }}>
                  {num}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border">
          {/* Unique Numbers */}
          <h4 className="text-center fs-6 fs-sm-4">Unique Numbers</h4>
          <div className="row justify-content-center text-light">
            {numbers.map((num, index) => {
              const color = getColor(num);

              // check if this is the winning number
              const isWinning = Number(winningNumber) === num;

              return (
                <div
                  key={index}
                  className={`col-3 col-sm-2 col-md-1 m-1 text-center fw-bold rounded ${isWinning ? 'border border-3 border-warning' : ''}`}
                  style={{
                    // if winning → yellow, else normal roulette color
                    backgroundColor: isWinning ? '#ffc107' : getBgColor(color),
                    padding: '10px',
                    fontSize: '18px',
                    color: isWinning ? '#000' : '#fff'
                  }}>
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
