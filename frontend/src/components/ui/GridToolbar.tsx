import React from 'react';
import { UI_TEXT } from '../../constants/strings';

interface GridToolbarProps {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  totalCount: number;
}

export const GridToolbar: React.FC<GridToolbarProps> = ({
  onSearch,
  isLoading,
  totalCount,
}) => {
  return (
    <div className="grid-toolbar">
      <input
        type="text"
        placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
        onChange={onSearch}
        className="search-input"
      />
      {isLoading && <span className="loading-text">{UI_TEXT.LOADING}</span>}
      <div className="total-count">
        {UI_TEXT.TOTAL_PREFIX}
        {totalCount.toLocaleString()}
      </div>
    </div>
  );
};
