import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, loading = false, filters = {}, setFilters = () => {} }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), filters);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      year: '',
      genre: '',
      rating: ''
    });
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Buscar filmes..."
            className="search-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="search-button"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              '🔍'
            )}
          </button>
          <button
            type="button"
            className="filters-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            🔧 Filtros
          </button>
        </div>
      </form>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-content">
            <h3>Filtros de Busca</h3>
            
            <div className="filter-group">
              <label htmlFor="year-filter">Ano:</label>
              <input
                id="year-filter"
                type="number"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                placeholder="Ex: 2023"
                min="1900"
                max="2030"
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="rating-filter">Rating mínimo:</label>
              <select
                id="rating-filter"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="filter-select"
              >
                <option value="">Qualquer rating</option>
                <option value="8">8+ Estrelas</option>
                <option value="7">7+ Estrelas</option>
                <option value="6">6+ Estrelas</option>
                <option value="5">5+ Estrelas</option>
                <option value="4">4+ Estrelas</option>
              </select>
            </div>

            <div className="filter-actions">
              <button
                type="button"
                onClick={clearFilters}
                className="clear-filters-btn"
              >
                🗑️ Limpar Filtros
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="close-filters-btn"
              >
                ✅ Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
