import React from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';

const Home = () => {

  const {firstName} = useGlobalAppContext();
  return (
    <div>Home {firstName}</div>
  )
}

export default Home