import { useIsFetching } from '@tanstack/react-query';
import './GlobalFetchingIndicator.css';

function GlobalFetchingIndicator() {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return (
    <div className="global-fetching-indicator">
      <div className="fetching-spinner"></div>
      <span>Loading...</span>
    </div>
  );
}

export default GlobalFetchingIndicator;