import { useEffect, useState } from 'react';
import './App.css';
import { Random } from 'random-js';
import { RouletteNumbersSorted } from './constants/RouletteNumbers';

function App() {
  const [numbers, setNumbers] = useState([]);
  const [sortedNumbers, setSortedNumbers] = useState([]);

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
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary mb-3" onClick={handleGenerate}>
          Generate New Numbers
        </button>
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
