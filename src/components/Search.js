import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        className='toolbar-filter'
        type="text"
        placeholder="Buscar produto..."
        value={search}
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
