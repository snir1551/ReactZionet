import './GlobalFetchingIndicator.css';

interface GlobalFetchingIndicatorProps {
  isFetching: boolean;
}

export const GlobalFetchingIndicator = ({ isFetching }: GlobalFetchingIndicatorProps) => {
  if (!isFetching) return null;

  return (
    <div className="global-fetching-indicator">
      <div className="fetching-spinner"></div>
      <span>Loading...</span>
    </div>
  );
};
