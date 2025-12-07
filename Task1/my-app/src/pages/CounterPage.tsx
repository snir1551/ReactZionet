import Counter from '../components/Counter';

function CounterPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#646cff' }}>Advanced Counter Demo</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Explore React hooks: useState, useEffect, useCallback, and useMemo
        </p>
      </div>

      <Counter initialValue={0} />
      
      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0 }}>Features Demonstrated:</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>useState:</strong> Managing count value and step size</li>
          <li><strong>useEffect:</strong> Syncing document title with counter value</li>
          <li><strong>useCallback:</strong> Memoizing increment/decrement functions to prevent unnecessary re-renders</li>
          <li><strong>useMemo:</strong> Computing derived state (isEven) efficiently</li>
          <li><strong>Performance optimization:</strong> Preventing unnecessary recalculations</li>
        </ul>
      </div>
    </div>
  );
}

export default CounterPage;
