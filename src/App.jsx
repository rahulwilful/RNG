import { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import { Random } from 'random-js';
import { RouletteNumbersSorted } from './constants/RouletteNumbers';
import { clearCounts, clearHistory, getCounts, getHistory, saveCounts, saveHistory } from './IndexDB/IndexDB';
import ManualModal from './components/ManualModal';
import Home from './Pages/Home';
import History from './Pages/History';
import SumAndBets from './Pages/SumAndBets';
import WinHistory from './Pages/WinHistory';
import DetailedWinHistory from './Pages/DetailedWinHistory';

function App() {
  // store randomly generated unique numbers

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/sum-and-bets" element={<SumAndBets />} />
        <Route path="/win-history" element={<WinHistory />} />
        <Route path="/detailed-win-history" element={<DetailedWinHistory />} />
      </Routes>
    </>
  );
}

export default App;
