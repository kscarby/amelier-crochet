import React from 'react'
import Carousel from '../components/Carousel'
import ProductsPage from '../pages/ProductsPage'

const Home = ({ addToCart }) => {
  return (
    <div>
        <Carousel />
        <ProductsPage addToCart={addToCart} />
    </div>
  )
}

export default Home