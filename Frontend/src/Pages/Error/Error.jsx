import React from 'react'
import { Player } from '@lottiefiles/react-lottie-player';

const Error = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className='max-w-[90%] w-[600px]'>
        <Player
          src='https://lottie.host/88dfbc4b-0043-4871-9f0c-d69c10c1cef9/BdZxqGti2Q.json'
          className='w-full h-full'
          loop
          autoplay
        />
      </div>
        <p className=' text-gray-400'>Whoops! It looks like you are lost!</p>
    </div>
  )
}

export default Error