// useEffect: persistent state
// 💯 custom hook
// http://localhost:3000/isolated/final/02.extra-3.js

import * as React from 'react'

function useLocalStorageState(key, defaultValue = '') {
  const getFromLocal = () => {
    const rawItem = window.localStorage.getItem(key)
    return JSON.parse(rawItem)
  }

  const [state, setState] = React.useState(
    getFromLocal() ?? defaultValue,
  )

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
