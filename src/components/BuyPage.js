import Toolbar  from '../components/Toolbar'
import React, { useState } from 'react'

const BuyPage = () => {
    
  return (

    <div className='app'>
        <form>
        <h1 className='new-title'>Comprar</h1>
            <h1>Cadastro</h1>
            <label>Email: </label>
            <input type='email'></input>
            <label>Senha</label>
            <input type='password'></input>
            <input type='submit'></input>

        </form>
    </div>
  )
}

export default BuyPage