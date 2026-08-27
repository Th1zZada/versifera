import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import type { Poem as PoemType } from '../types/poem'
import { supabase } from '../lib/supabase'


function Poem() {

  const { id } = useParams()

  const [poem, setPoem] = useState<PoemType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {

    async function loadPoem() {

      if (!id) {

        setError('Poema não encontrado.')
        setLoading(false)

        return
      }


      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single()


      if (error) {

        console.error(
          'Erro ao carregar poema:',
          error
        )

        setError('Não foi possível encontrar o poema.')
        setLoading(false)

        return
      }


      setPoem(data)
      setLoading(false)

    }


    loadPoem()

  }, [id])


  // ==========================================
  // A CARREGAR
  // ==========================================

  if (loading) {

    return (

      <main className="poem-page">

        <div className="no-poems">

          <span>
            ✦
          </span>

          <h2>
            A abrir o poema...
          </h2>

          <p>
            Um momento.
          </p>

        </div>

      </main>

    )

  }


  // ==========================================
  // ERRO
  // ==========================================

  if (error || !poem) {

    return (

      <main className="poem-page">

        <nav className="navbar">

          <Link
            to="/"
            className="logo"
          >
            Versífera
          </Link>


          <div className="nav-links">

            <Link to="/">
              Início
            </Link>

            <Link to="/poemas">
              Poemas
            </Link>

          </div>

        </nav>


        <section className="no-poems">

          <span>
            ✦
          </span>

          <h2>
            Poema não encontrado
          </h2>

          <p>
            {error || 'Este poema não existe.'}
          </p>


          <Link
            to="/poemas"
            className="poem-card-button"
          >
            Voltar aos poemas
            <span>
              →
            </span>
          </Link>

        </section>

      </main>

    )

  }


  // ==========================================
  // POEMA
  // ==========================================

  return (

    <main className="poem-page">


      {/* ======================================
          NAVBAR
          ====================================== */}

      <nav className="navbar">

        <Link
          to="/"
          className="logo"
        >
          Versífera
        </Link>


        <div className="nav-links">

          <Link to="/">
            Início
          </Link>

          <Link to="/poemas">
            Poemas
          </Link>

          <a href="/#sobre">
            Sobre
          </a>

        </div>

      </nav>


      {/* ======================================
          CONTEÚDO
          ====================================== */}

      <article className="poem-detail">


        {/* VOLTAR */}

        <Link
          to="/poemas"
          className="back-link"
        >
          ← Voltar aos poemas
        </Link>


        {/* CABEÇALHO */}

        <header className="poem-detail-header">

          <span className="poem-detail-symbol">
            ✦
          </span>


          <p className="section-label">
            {poem.category}
          </p>


          <h1>
            {poem.title}
          </h1>


          <p className="poem-detail-date">

            {new Date(
              poem.created_at
            ).toLocaleDateString(
              'pt-PT',
              {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }
            )}

          </p>

        </header>


        {/* SEPARADOR */}

        <div className="divider">

          <span />

          <span>
            ✦
          </span>

          <span />

        </div>


        {/* CONTEÚDO DO POEMA */}

        <div className="poem-content">

          {poem.content
            .split('\n')
            .map((line, index) => (

              <p key={index}>

                {line || '\u00A0'}

              </p>

            ))}

        </div>


        {/* VOLTAR */}

        <div className="poem-detail-footer">

          <Link
            to="/poemas"
            className="read-button"
          >
            ← Todos os poemas
          </Link>

        </div>

      </article>


      {/* ======================================
          RODAPÉ
          ====================================== */}

      <footer className="poems-footer">

        <span>
          ✦
        </span>

        <p>
          Versífera
        </p>

        <small>
          palavras que encontram um lugar
        </small>

      </footer>

    </main>

  )

}


export default Poem