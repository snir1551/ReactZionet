import { Counter } from '../components/Counter';
import './CounterPage.css';

export const CounterPage = () => {
  return (
    <div className="counter-page-container">
      <div className="counter-page-header">
        <h1>Advanced Counter Demo</h1>
        <p>
          Explore React hooks: useState, useEffect, useCallback, and useMemo
        </p>
      </div>

      <Counter initialValue={0} />
      
      <div className="counter-page-info">
        <h3>Features Demonstrated:</h3>
        <ul>
          <li><strong>useState:</strong> Managing count value and step size</li>
          <li><strong>useEffect:</strong> Syncing document title with counter value</li>
          <li><strong>useCallback:</strong> Memoizing increment/decrement functions to prevent unnecessary re-renders</li>
          <li><strong>useMemo:</strong> Computing derived state (isEven) efficiently</li>
          <li><strong>Performance optimization:</strong> Preventing unnecessary recalculations</li>
        </ul>
      </div>
    </div>
  );
};
