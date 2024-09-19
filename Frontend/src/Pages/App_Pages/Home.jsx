import React from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';
import { Link } from 'react-router-dom';

const Home = () => {

  const {firstName} = useGlobalAppContext();
  return (
    <div className='border-2 border-yellow-500'>
    <div>Home {firstName}</div>
    <Link to='/home/profile'>Go to Profile</Link>
    </div>
  )
}

export default Home