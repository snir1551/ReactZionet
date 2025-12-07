import UserForm from '../components/UserForm';

function RegisterPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#646cff' }}>User Registration</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Advanced form handling with useReducer and validation
        </p>
      </div>

      <UserForm />
      
      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0 }}>Features Demonstrated:</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>useReducer:</strong> Managing complex form state with actions</li>
          <li><strong>Real-time validation:</strong> Instant feedback on user input</li>
          <li><strong>Form completion tracking:</strong> Visual progress indicator</li>
          <li><strong>Structured state management:</strong> Clean separation of state logic</li>
          <li><strong>Type safety:</strong> TypeScript interfaces for actions and state</li>
        </ul>
      </div>
    </div>
  );
}

export default RegisterPage;
