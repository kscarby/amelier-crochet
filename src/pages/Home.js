import React from 'react'
import Carousel from '../components/Carousel.js'
import ProductsPage from '../pages/ProductsPage.js'

const Home = ({ addToCart }) => {
  return (
    <div>
        {/*<Carousel />*/}
        <ProductsPage addToCart={addToCart} />
    </div>
  )
}

export default Home