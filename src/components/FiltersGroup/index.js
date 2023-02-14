import React from 'react'
import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    updateCategory,
    updateRating,
    searchVal,
    updateTitleSearch,
    getSearchResult,
    clearFilter,
    activeCategory,
    activeRating,
  } = props

  const onSearchInput = e => updateTitleSearch(e.target.value)

  const onEnterPressed = e => {
    if (e.key === 'Enter') {
      getSearchResult()
    }
  }

  const onClearFilters = () => clearFilter()

  const renderCategoryItems = eachCategory => {
    const onCategoryChange = () => updateCategory(eachCategory.categoryId)
    const activeClass =
      activeCategory === eachCategory.categoryId ? 'blue-text' : ''

    return (
      <li className="category-item" onClick={onCategoryChange}>
        <p className={`category-item-text ${activeClass}`}>
          {eachCategory.name}
        </p>
      </li>
    )
  }

  const renderRatingItems = eachRating => {
    const onRatingChange = () => updateRating(eachRating.ratingId)
    const activeClass = activeRating === eachRating.ratingId ? 'blue-text' : ''

    return (
      <li className="rating-item" onClick={onRatingChange}>
        <img
          className="rating-img"
          src={eachRating.imageUrl}
          alt={`rating ${eachRating.ratingId}`}
        />
        <span className={`rating-up-text ${activeClass}`}>&up</span>
      </li>
    )
  }

  return (
    <div className="filters-group-container">
      <div className="search-input-container">
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          value={searchVal}
          onChange={onSearchInput}
          onKeyDown={onEnterPressed}
        />
        <BsSearch className="search-icon" onClick={getSearchResult} />
      </div>
      <h1 className="category-heading">Category</h1>
      <ul className="categories-list">
        {categoryOptions.map(eachCategory => (
          <React.Fragment key={eachCategory.categoryId}>
            {renderCategoryItems(eachCategory)}
          </React.Fragment>
        ))}
      </ul>

      <p className="rating-heading">Rating</p>
      <ul className="ratings-list">
        {ratingsList.map(eachRating => (
          <React.Fragment key={eachRating.ratingId}>
            {renderRatingItems(eachRating)}
          </React.Fragment>
        ))}
      </ul>
      <button
        type="button"
        className="clear-filter-btn"
        onClick={onClearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
