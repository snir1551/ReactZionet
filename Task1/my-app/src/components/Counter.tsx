import { useState, useEffect, useCallback, useMemo } from 'react';
import './Counter.css';

interface CounterProps {
  initialValue?: number;
}

function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);
  const [history, setHistory] = useState<number[]>([initialValue]);

  // useEffect to update document title when count changes
  useEffect(() => {
    document.title = `Counter: ${count}`;
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Vite + React';
    };
  }, [count]);

  // useEffect to add count to history
  useEffect(() => {
    setHistory(prev => [...prev, count]);
  }, [count]);

  // useCallback to memoize increment function
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // useCallback to memoize decrement function
  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  // useCallback to reset counter
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  // useMemo to calculate expensive operation (sum of history)
  const historySum = useMemo(() => {
    console.log('Calculating history sum...');
    return history.reduce((sum, value) => sum + value, 0);
  }, [history]);

  // useMemo to determine if count is even or odd
  const countType = useMemo(() => {
    return count % 2 === 0 ? 'even' : 'odd';
  }, [count]);

  return (
    <div className="counter-container">
      <h2>Advanced Counter Component</h2>
      
      <div className="counter-display">
        Count: <span className="counter-value">{count}</span>
      </div>
      
      <div className="counter-type">
        <span>Type: </span>
        <span className={`counter-type-${countType}`}>
          {countType}
        </span>
      </div>

      <div className="counter-buttons">
        <button 
          onClick={increment}
          className="counter-btn counter-btn-increment"
        >
          +1
        </button>
        <button 
          onClick={decrement}
          className="counter-btn counter-btn-decrement"
        >
          -1
        </button>
        <button 
          onClick={reset}
          className="counter-btn counter-btn-reset"
        >
          Reset
        </button>
      </div>

      <div className="counter-stats">
        <h4>Statistics:</h4>
        <p>History Sum: {historySum}</p>
        <p>History Length: {history.length}</p>
        <p>History: [{history.slice(-5).join(', ')}{history.length > 5 ? ', ...' : ''}]</p>
      </div>
    </div>
  );
}

export default Counter;