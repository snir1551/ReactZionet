import Counter from '../components/Counter';
import UserForm from '../components/UserForm';

function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#646cff' }}>React Hooks Demo</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Welcome to our interactive React hooks demonstration!
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        alignItems: 'center'
      }}>
        <Counter initialValue={0} />
        <UserForm />
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}>
        <h3>🎯 What you're seeing:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li><strong>Counter Component:</strong> Uses useState, useEffect, useCallback, and useMemo</li>
          <li><strong>User Form:</strong> Demonstrates useReducer for complex state management</li>
          <li><strong>Real-time validation</strong> and form completion tracking</li>
          <li><strong>Performance optimizations</strong> with memoization</li>
          <li><strong>Side effects</strong> like document title updates and local storage</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;