import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '../lib/supabase'
import PoemCard from '../components/PoemCard'

import type { Poem } from '../types/poem'



function Poems() {

  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')


  // ==========================================
  // BUSCAR POEMAS DO SUPABASE
  // ==========================================

  useEffect(() => {

    async function loadPoems() {

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
  .from('poems')
  .select('*')
  .order('created_at', {
    ascending: false
  })




      if (error) {

        console.error(
          'Erro ao carregar poemas:',
          error
        )

        setError(
          'Não foi possível carregar os poemas.'
        )

        setLoading(false)

        return
      }


      setPoems(data ?? [])

      setLoading(false)

    }


    loadPoems()

  }, [])


  // ==========================================
  // CATEGORIAS
  // ==========================================

  const categories = useMemo(() => {

    return [
      'Todos',
      ...Array.from(
        new Set(
          poems.map(
            (poem) => poem.category
          )
        )
      )
    ]

  }, [poems])


  // ==========================================
  // PESQUISA E FILTRO
  // ==========================================

  const filteredPoems = useMemo(() => {

    return poems.filter((poem) => {

      const title =
        poem.title.toLowerCase()

      const excerpt =
        poem.excerpt?.toLowerCase() ?? ''

      const searchValue =
        search.toLowerCase()


      const matchesSearch =
        title.includes(searchValue) ||
        excerpt.includes(searchValue)


      const matchesCategory =
        category === 'Todos' ||
        poem.category === category


      return (
        matchesSearch &&
        matchesCategory
      )

    })

  }, [
    poems,
    search,
    category
  ])


  // ==========================================
  // PÁGINA
  // ==========================================

  return (

    <main className="poems-library">


      {/* NAVBAR */}

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


      {/* CABEÇALHO */}

      <header className="poems-header">

        <span className="library-symbol">
          ✦
        </span>


        <p className="section-label">
          biblioteca
        </p>


        <h1>
          Os meus poemas
        </h1>


        <p className="poems-description">
          Palavras escritas em diferentes momentos,
          sentimentos transformados em versos
          e pensamentos que encontraram um lugar
          para permanecer.
        </p>

      </header>


      {/* PESQUISA */}

      <section className="poems-controls">

        <div className="search-box">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Procurar um poema..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <div className="category-filter">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

      </section>


      {/* RESULTADOS */}

      <section className="poems-results">


        {/* A CARREGAR */}

        {loading && (

          <div className="no-poems">

            <span>
              ✦
            </span>

            <h2>
              A abrir o livro...
            </h2>

            <p>
              Estamos a procurar os teus poemas.
            </p>

          </div>

        )}


        {/* ERRO */}

        {!loading && error && (

          <div className="no-poems">

            <span>
              ✦
            </span>

            <h2>
              Algo correu mal
            </h2>

            <p>
              {error}
            </p>

          </div>

        )}


        {/* SEM POEMAS */}

        {!loading &&
          !error &&
          filteredPoems.length === 0 && (

            <div className="no-poems">

              <span>
                ✦
              </span>

              <h2>
                Ainda não existem poemas
              </h2>

              <p>
                Os primeiros versos do Versífera
                ainda estão por chegar.
              </p>

            </div>

          )}


        {/* POEMAS */}

        {!loading &&
          !error &&
          filteredPoems.length > 0 && (

            <div className="poems-grid">

              {filteredPoems.map(
                (poem, index) => (

                  <div
                    key={poem.id}
                    className="poem-card-wrapper"
                    style={{
                      animationDelay:
                        `${index * 100}ms`
                    }}
                  >

                    <PoemCard
                      poem={poem}
                    />

                  </div>

                )
              )}

            </div>

          )}

      </section>


      {/* RODAPÉ */}

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


export default Poems