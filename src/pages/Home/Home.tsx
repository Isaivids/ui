import React from 'react'
import './Home.scss'
import SideBar from '../../components/sidebar/SideBar'
import List from '../list/List'
import Cart from '../../components/cart/Cart'
const Home = () => {
  return (
    <div className='flex'>
        <div className="left-sidebar"><SideBar /></div>
        <div className="main-content"><List /></div>
        <div className="cart"><Cart /></div>
    </div>
  )
}

export default Home