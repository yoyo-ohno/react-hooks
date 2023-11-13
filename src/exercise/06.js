// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {ErrorBoundary} from "react-error-boundary";

const Status = {
  Idle: "idle",
  Pending: "pending",
  Resolved: "resolved",
  Rejected: "rejected",
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({status: Status.Idle, pokemon: null, error: null})
  const {status, error, pokemon} = state

  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: Status.Pending})

    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: Status.Resolved, pokemon})
      },
      error => {
        setState({status: Status.Rejected, error})
      }
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

const ErrorFallback = ({error, resetErrorBoundary}) => {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  const handleReset = () => setPokemonName('');
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
        <div className="pokemon-info">
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default App
