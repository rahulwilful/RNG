import { useEffect, useState } from 'react';
import './App.css';
import { Random } from 'random-js';
import { RouletteNumbersSorted } from './constants/RouletteNumbers';

function App() {
  const [numbers, setNumbers] = useState([]);
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);

  const generateRandomNumber = () => {
    const random = new Random();
    return random.integer(0, 36);
  };

  const generate19UniqueNumbers = () => {
    const uniqueNumbers = new Set();

    while (uniqueNumbers.size < 19) {
      uniqueNumbers.add(generateRandomNumber());
    }

    return Array.from(uniqueNumbers);
  };

  const handleGenerate = () => {
    const result = generate19UniqueNumbers();
    setNumbers(result);

    const sorted = [...result].sort((a, b) => a - b);
    setSortedNumbers(sorted);
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  // helper to get color
  const getColor = num => {
    return RouletteNumbersSorted.find(n => n.number === num)?.color;
  };

  const getBgColor = color => {
    if (color === 'red') return '#dc3545';
    if (color === 'black') return '#212529';
    return 'green';
  };

  return (
    <div className="container-fluid bg-light text-dark min-vh-100 p-3">
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
      <div className="d-flex gap-2 justify-content-center">
        <button className="btn btn-sm btn-primary mb-3" onClick={handleGenerate}>
          Generate
        </button>

        <div class="input-group input-group-sm mb-3  ">
          <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
        </div>
      </div>

      {/* Unique Numbers */}
      <h4 className="text-center">Unique Numbers</h4>
      <div className="row justify-content-center text-light">
        {numbers.map((num, index) => {
          const color = getColor(num);
          return (
            <div
              key={index}
              className="col-3 col-sm-2 col-md-1 m-1 text-center fw-bold rounded"
              style={{
                backgroundColor: getBgColor(color),
                padding: '10px',
                fontSize: '18px'
              }}>
              {num}
            </div>
          );
        })}
      </div>

      {/* Sorted Numbers */}
      <h4 className="text-center mt-4">Sorted Numbers</h4>
      <div className="row justify-content-center">
        {sortedNumbers.map((num, index) => {
          const color = getColor(num);
          return (
            <div
              key={index}
              className="col-3 col-sm-2 col-md-1 text-light m-1 text-center fw-bold rounded"
              style={{
                backgroundColor: getBgColor(color),
                padding: '10px',
                fontSize: '18px'
              }}>
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
