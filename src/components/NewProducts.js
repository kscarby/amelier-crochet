import React, { useState, useEffect } from 'react'


import '../styles/ProductCard.css';

const NewProducts = ({addToCart}) => {

  const [products, setProducts] = useState([]);
  useEffect (() => {

    fetch('https://fakestoreapi.com/products?limit=6')
            .then(res=>res.json())
            .then(products=>setProducts(products));
  }, [])


  return (
    <div className='app'>
      <h1 className='new-title'>Lançamentos</h1>
      {products.map(item => (

      <div key = {item.id} className='card-newproduct'>
        <p className='new-p'>Lançamento</p>
          <img className='img-newproduct' src={item.image} alt={item.description}></img>
          
          <div className='card-price'>
            <h1>{item.title}</h1>
            <h2>R$ {item.price}</h2>
            <p>R$ {item.price} à vista com desconto ou 3x {((item.price)/3).toFixed(2)} Sem juros</p>
            <div className='card-buy'>
              <button className='button-buy' onClick = {() => addToCart(item)}>Comprar</button>
            </div>
          </div>
      </div>
      ))}
    </div>
  )
}

export default NewProducts