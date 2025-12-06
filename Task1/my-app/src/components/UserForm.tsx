import { useState, useEffect, useReducer, useMemo } from 'react';

// Define types for the form state
interface FormState {
  name: string;
  email: string;
  age: string;
  errors: {
    name?: string;
    email?: string;
    age?: string;
  };
  isSubmitting: boolean;
}

// Define action types for useReducer
type FormAction = 
  | { type: 'SET_FIELD'; field: keyof FormState; value: string }
  | { type: 'SET_ERROR'; field: keyof FormState['errors']; error?: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM' };

// Initial state for the form
const initialFormState: FormState = {
  name: '',
  email: '',
  age: '',
  errors: {},
  isSubmitting: false
};

// Reducer function for form state management
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: undefined // Clear error when user types
        }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error
        }
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
}

function UserForm() {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [submissionHistory, setSubmissionHistory] = useState<FormState[]>([]);

  // Effect to validate form when fields change
  useEffect(() => {
    // Name validation
    if (formState.name.length > 0 && formState.name.length < 2) {
      dispatch({ type: 'SET_ERROR', field: 'name', error: 'Name must be at least 2 characters' });
    }

    // Email validation
    if (formState.email.length > 0 && !formState.email.includes('@')) {
      dispatch({ type: 'SET_ERROR', field: 'email', error: 'Please enter a valid email' });
    }

    // Age validation
    if (formState.age.length > 0) {
      const ageNumber = parseInt(formState.age);
      if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
        dispatch({ type: 'SET_ERROR', field: 'age', error: 'Age must be between 1 and 120' });
      }
    }
  }, [formState.name, formState.email, formState.age]);

  // useMemo to check if form is valid
  const isFormValid = useMemo(() => {
    const hasNoErrors = Object.keys(formState.errors).every(
      key => !formState.errors[key as keyof typeof formState.errors]
    );
    const hasAllFields = formState.name && formState.email && formState.age;
    return hasNoErrors && hasAllFields;
  }, [formState.errors, formState.name, formState.email, formState.age]);

  // useMemo to calculate form completion percentage
  const completionPercentage = useMemo(() => {
    const fields = [formState.name, formState.email, formState.age];
    const filledFields = fields.filter(field => field.length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [formState.name, formState.email, formState.age]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to submission history
      setSubmissionHistory(prev => [
        ...prev, 
        { ...formState, isSubmitting: false }
      ]);
      
      alert('Form submitted successfully!');
      dispatch({ type: 'RESET_FORM' });
      
    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #646cff', 
      borderRadius: '8px', 
      maxWidth: '500px',
      margin: '20px auto'
    }}>
      <h2>User Registration Form</h2>
      
      {/* Progress bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', marginBottom: '5px' }}>
          Completion: {completionPercentage}%
        </div>
        <div style={{ 
          width: '100%', 
          height: '10px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              width: `${completionPercentage}%`, 
              height: '100%', 
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Name:
          </label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) => dispatch({ 
              type: 'SET_FIELD', 
              field: 'name', 
              value: e.target.value 
            })}
            style={{
              width: '100%',
              padding: '8px',
              border: formState.errors.name ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Enter your name"
          />
          {formState.errors.name && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {formState.errors.name}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            value={formState.email}
            onChange={(e) => dispatch({ 
              type: 'SET_FIELD', 
              field: 'email', 
              value: e.target.value 
            })}
            style={{
              width: '100%',
              padding: '8px',
              border: formState.errors.email ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Enter your email"
          />
          {formState.errors.email && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {formState.errors.email}
            </div>
          )}
        </div>

        {/* Age Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Age:
          </label>
          <input
            type="number"
            value={formState.age}
            onChange={(e) => dispatch({ 
              type: 'SET_FIELD', 
              field: 'age', 
              value: e.target.value 
            })}
            style={{
              width: '100%',
              padding: '8px',
              border: formState.errors.age ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Enter your age"
            min="1"
            max="120"
          />
          {formState.errors.age && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {formState.errors.age}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || formState.isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isFormValid && !formState.isSubmitting ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isFormValid && !formState.isSubmitting ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s ease'
          }}
        >
          {formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {/* Submission History */}
      {submissionHistory.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px' 
        }}>
          <h4>Previous Submissions ({submissionHistory.length}):</h4>
          {submissionHistory.slice(-3).map((submission, index) => (
            <div key={index} style={{ marginBottom: '5px', fontSize: '14px' }}>
              {submission.name} - {submission.email} - Age: {submission.age}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserForm;