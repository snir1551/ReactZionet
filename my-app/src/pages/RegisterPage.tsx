import { UserForm } from '../components/UserForm';
import './RegisterPage.css';

export const RegisterPage = () => {
  return (
    <div className="register-page-container">
      <div className="register-page-header">
        <h1>User Registration</h1>
        <p>
          Advanced form handling with useReducer and validation
        </p>
      </div>

      <UserForm />
      
      <div className="register-page-info">
        <h3>Features Demonstrated:</h3>
        <ul>
          <li><strong>useReducer:</strong> Managing complex form state with actions</li>
          <li><strong>Real-time validation:</strong> Instant feedback on user input</li>
          <li><strong>Form completion tracking:</strong> Visual progress indicator</li>
          <li><strong>Structured state management:</strong> Clean separation of state logic</li>
          <li><strong>Type safety:</strong> TypeScript interfaces for actions and state</li>
        </ul>
      </div>
    </div>
  );
};
