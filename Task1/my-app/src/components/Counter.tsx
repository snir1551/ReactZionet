import { useState, useEffect, useCallback, useMemo } from 'react';

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
    <div style={{ 
      padding: '20px', 
      border: '2px solid #646cff', 
      borderRadius: '8px', 
      maxWidth: '400px',
      margin: '20px auto'
    }}>
      <h2>Advanced Counter Component</h2>
      
      <div style={{ fontSize: '2rem', margin: '20px 0' }}>
        Count: <span style={{ color: '#646cff' }}>{count}</span>
      </div>
      
      <div style={{ margin: '10px 0' }}>
        <span>Type: </span>
        <span style={{ 
          color: countType === 'even' ? 'green' : 'orange',
          fontWeight: 'bold' 
        }}>
          {countType}
        </span>
      </div>

      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={increment}
          style={{ 
            margin: '5px', 
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +1
        </button>
        <button 
          onClick={decrement}
          style={{ 
            margin: '5px', 
            padding: '10px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          -1
        </button>
        <button 
          onClick={reset}
          style={{ 
            margin: '5px', 
            padding: '10px 15px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px' 
      }}>
        <h4>Statistics:</h4>
        <p>History Sum: {historySum}</p>
        <p>History Length: {history.length}</p>
        <p>History: [{history.slice(-5).join(', ')}{history.length > 5 ? ', ...' : ''}]</p>
      </div>
    </div>
  );
}

export default Counter;