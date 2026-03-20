import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './Search.css';

const Search = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');

    const filters = ['All', 'Movies', 'TV', 'Popular', 'Rating', 'Newest', 'Year'];

    if (!isOpen) return null;

    return (
        <div className="search-overlay">
            <div className="search-container">
                <div className="search-top">
                    <div className="search-input-wrapper">
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search movies or TV shows"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button className="search-close-btn" onClick={onClose}>
                        <span>Close</span>
                        <FaTimes className="close-icon-sm" />
                    </button>
                </div>

                <div className="search-filters">
                    {filters.map((filter) => (
                        <button 
                            key={filter} 
                            className={`filter-chip ${selectedFilter === filter ? 'active' : ''}`}
                            onClick={() => setSelectedFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;
