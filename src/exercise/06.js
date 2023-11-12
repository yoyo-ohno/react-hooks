// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {ErrorBoundary, useErrorHandler} from "react-error-boundary";

const Status = {
  Idle: "idle",
  Pending: "pending",
  Resolved: "resolved",
  Rejected: "rejected",
}

function PokemonInfo({pokemonName}) {
  const [state, setPokemonInfoState] = React.useState({status: Status.Idle})
  const {status, error, pokemon} = state
  const handleError = useErrorHandler()

  React.useEffect(() => {
    if (!pokemonName) return
    setPokemonInfoState({status: Status.Pending, pokemon})

    fetchPokemon(pokemonName).then(
      pokemon => {
        setPokemonInfoState({pokemon, status: Status.Resolved})
      },
      handleError
    )
  }, [pokemonName])

  switch (status) {
    case Status.Pending:
      return <PokemonInfoFallback name={pokemonName}/>
    case Status.Rejected:
      throw error
    case Status.Resolved:
      return <PokemonDataView pokemon={pokemon}/>
    case Status.Idle:
    default:
      return 'Submit a pokemon'
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <ErrorBoundary fallback={<p>Something went wrong</p>} key={pokemonName}>
        <div className="pokemon-info">
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default App
