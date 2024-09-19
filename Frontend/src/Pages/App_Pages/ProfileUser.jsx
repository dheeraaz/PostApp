import React from 'react'
import { useParams } from 'react-router-dom'

const ProfileUser = () => {
  const {userId} = useParams();  

  return (
    <div>ProfileUser {userId}</div>
  )
}

export default ProfileUser