import React from 'react'
import { useState, useEffect } from 'react';

const PromptDelivery = ({addToCart}) => {
    const [products, setProducts] = useState ([]);

  
    useEffect (() => {
  
      fetch('https://fakestoreapi.com/products?sort=desc')
              .then(res=>res.json())
              .then(products=>setProducts(products));
  
    },[])
  
    return (
      <div className='app'>
        <h1 className='new-title'>Pronta Entrega</h1>
        {products.map(item => (
        <div key={item.id} className='card-newproduct'>
            <img className='img-newproduct' alt={item.description} src={item.image}></img>
            
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

export default PromptDelivery