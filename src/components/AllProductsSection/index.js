import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const status = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'IN_PROGRESS',
  failure: 'FAILED',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    responseStatus: status.initial,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      responseStatus: status.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, titleSearch, category, rating} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${titleSearch}&category=${category}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        responseStatus: status.success,
      })
    } else {
      this.setState({responseStatus: status.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  updateCategory = categoryId => {
    console.log(categoryId)
    this.setState({category: categoryId}, this.getProducts)
  }

  updateRating = ratingId => this.setState({rating: ratingId}, this.getProducts)

  updateTitleSearch = value => this.setState({titleSearch: value})

  getSearchResult = () => this.getProducts()

  clearFilter = () =>
    this.setState({titleSearch: '', category: '', rating: ''}, this.getProducts)

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    if (productsList.length === 0) {
      return (
        <div className="no-products-container">
          <img
            className="no-products-img"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
          />
          <h1 className="no-products-heading">No Products Found</h1>
          <p className="no-products-para">
            We could not find any products. Try other filters.
          </p>
        </div>
      )
    }

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  failureView = () => (
    <div className="failure-view-container">
      <img
        className="broken-wire-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We are having some trouble processing your request. Please try agian.
      </p>
    </div>
  )

  renderViews = () => {
    const {responseStatus} = this.state

    switch (responseStatus) {
      case status.success:
        return this.renderProductsList()
      case status.failure:
        return this.failureView()
      default:
        return this.renderLoader()
    }
  }

  render() {
    const {titleSearch, category, rating} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          searchVal={titleSearch}
          updateTitleSearch={this.updateTitleSearch}
          getSearchResult={this.getSearchResult}
          updateCategory={this.updateCategory}
          updateRating={this.updateRating}
          clearFilter={this.clearFilter}
          activeCategory={category}
          activeRating={rating}
        />

        {this.renderViews()}
      </div>
    )
  }
}

export default AllProductsSection
