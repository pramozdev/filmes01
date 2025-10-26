import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ 
  onSearch, 
  onClear,
  searchTerm = '',
  onSearchTermChange,
  loading = false, 
  filters = {}, 
  setFilters = () => {}
}) => {
  const [query, setQuery] = useState(searchTerm);
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchQuery = query.trim();
    if (searchQuery) {
      onSearch(searchQuery, filters);
    } else {
      onClear?.();
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearchTermChange?.(e);
            }}
            placeholder="Buscar filmes..."
            className="search-input"
            disabled={loading}
          />
          {query && (
            <button 
              type="button"
              className="clear-button"
              onClick={() => {
                setQuery('');
                onClear?.();
              }}
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <span>🔍</span>
            )}
          </button>
          <button 
            type="button" 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={toggleFilters}
            aria-label={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          >
            ⚙️
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label htmlFor="year">Ano:</label>
              <select 
                id="year" 
                value={filters.year || ''}
                onChange={(e) => handleFilterChange('year', e.target.value || null)}
                className="filter-select"
              >
                <option value="">Todos os anos</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort">Ordenar por:</label>
              <select 
                id="sort" 
                value={filters.sortBy || 'popularity.desc'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="popularity.desc">Mais populares</option>
                <option value="release_date.desc">Lançamentos recentes</option>
                <option value="vote_average.desc">Melhor avaliados</option>
                <option value="revenue.desc">Maior bilheteria</option>
              </select>
            </div>

            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={filters.includeAdult || false}
                  onChange={(e) => handleFilterChange('includeAdult', e.target.checked)}
                  className="filter-checkbox"
                />
                Incluir filmes para adultos
              </label>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  searchTerm: PropTypes.string,
  onSearchTermChange: PropTypes.func,
  loading: PropTypes.bool,
  filters: PropTypes.shape({
    year: PropTypes.string,
    sortBy: PropTypes.string,
    includeAdult: PropTypes.bool,
  }),
  setFilters: PropTypes.func,
};

export default SearchBar;
