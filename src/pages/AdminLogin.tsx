import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '../lib/supabase'


function AdminLogin() {

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault()

    setLoading(true)
    setError('')


    // Apenas o utilizador Leonor pode tentar entrar
    if (username.trim().toLowerCase() !== 'leonor') {

      setError('Utilizador ou palavra-passe incorretos.')

      setLoading(false)

      return
    }


    /*
      O Supabase utiliza o email da conta
      que criámos anteriormente.

      SUBSTITUI o email abaixo pelo email
      que usaste ao criar a conta no Supabase.
    */

    const email = 'costagomeswattpad@gmail.com'


    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })


    if (error) {

      console.error(
        'Erro de autenticação:',
        error
      )

      setError(
        'Utilizador ou palavra-passe incorretos.'
      )

      setLoading(false)

      return
    }


    // Login realizado
    navigate('/admin')

  }


  return (

    <main className="admin-login">

      <div className="admin-login-box">

        <span className="admin-login-symbol">
          ✦
        </span>


        <p className="section-label">
          administração
        </p>


        <h1>
          Versífera
        </h1>


        <p className="admin-login-description">
          Entra para gerir os teus poemas.
        </p>


        {error && (

          <div className="admin-message error">
            {error}
          </div>

        )}


        <form
          className="admin-form"
          onSubmit={handleLogin}
        >

          {/* UTILIZADOR */}

          <div className="form-group">

            <label htmlFor="username">
              Utilizador
            </label>

            <input
              id="username"
              type="text"
              placeholder="Utilizador"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              autoComplete="username"
              required
            />

          </div>


          {/* PALAVRA-PASSE */}

          <div className="form-group">

            <label htmlFor="password">
              Palavra-passe
            </label>

            <input
              id="password"
              type="password"
              placeholder="Palavra-passe"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />

          </div>


          {/* BOTÃO */}

          <button
            type="submit"
            className="admin-submit"
            disabled={loading}
          >

            {loading
              ? 'A verificar...'
              : 'Entrar'
            }

            {!loading && (
              <span>
                →
              </span>
            )}

          </button>

        </form>

      </div>

    </main>

  )
}


export default AdminLogin