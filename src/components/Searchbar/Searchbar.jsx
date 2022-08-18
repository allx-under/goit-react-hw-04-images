import React, { memo } from 'react';
import styles from './searchbar.module.css';
import PropTypes from 'prop-types';

const SearchBar = ({ onSubmit }) => {
  return (
    <header className={styles.searchbar}>
      {console.log('searchbar')}
      <form className={styles.searchForm} onSubmit={onSubmit}>
        <button type="submit" className={styles.searchFormBtn}>
          <span className={styles.searchFormBtnLabel}>Search</span>
        </button>

        <input
          className={styles.searchFormInput}
          name="input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

export default memo(SearchBar);
SearchBar.propTypes = {
  onSubmit: PropTypes.func,
};
