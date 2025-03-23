import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatRoom from './components/chatRoom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChatRoom/>
    </>
  )
}

export default App
