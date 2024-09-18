import React from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';
import { Link } from 'react-router-dom';

const Home = () => {

  const {firstName} = useGlobalAppContext();
  return (
    <>
    <div>Home {firstName}</div>
    <Link to='/home/profile'>Go to Profile</Link>
    </>
  )
}

export default Home