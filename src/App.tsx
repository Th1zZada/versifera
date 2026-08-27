import { useEffect, useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'

import { supabase } from './lib/supabase'

import Poems from './pages/Poems'
import Poem from './pages/Poem'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'

import type { Poem as PoemType } from './types/poem'


// ==========================================
// PÁGINA INICIAL
// ==========================================

function Home() {

  const [featuredPoem, setFeaturedPoem] =
    useState<PoemType | null>(null)

  const [loadingFeatured, setLoadingFeatured] =
    useState(true)


  // ==========================================
  // CARREGAR POEMA EM DESTAQUE
  // ==========================================

  useEffect(() => {

    async function loadFeaturedPoem() {

      setLoadingFeatured(true)


      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('created_at', {
          ascending: false
        })
        .limit(1)
        .maybeSingle()


      if (error) {

        console.error(
          'Erro ao carregar poema em destaque:',
          error
        )

        setFeaturedPoem(null)

        setLoadingFeatured(false)

        return
      }


      setFeaturedPoem(data)

      setLoadingFeatured(false)

    }


    loadFeaturedPoem()

  }, [])


  return (

    <main className="site">


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


          <a href="#sobre">
            Sobre
          </a>

        </div>

      </nav>


      {/* ======================================
          HERO / PÁGINA INICIAL
          ====================================== */}

      <section
        className="home"
        id="inicio"
      >

        {/* Formas decorativas */}

        <div
          className="background-shape shape-one"
        />


        <div
          className="background-shape shape-two"
        />


        {/* Conteúdo central */}

        <div className="hero">

          <div className="ornament">
            ✦
          </div>


          <h1>
            Versífera
          </h1>


          <div className="divider">

            <span />


            <span>
              ✦
            </span>


            <span />

          </div>


          <p className="subtitle">

            onde as palavras encontram
            <br />
            espaço para existir

          </p>


          <Link
            to="/poemas"
            className="poems-button"
          >

            <span>
              Explorar poemas
            </span>


            <span className="arrow">
              →
            </span>

          </Link>

        </div>


        {/* Indicador inferior */}

        <div className="scroll-indicator">

          <span>
            desliza para descobrir
          </span>


          <div className="scroll-line" />

        </div>

      </section>


      {/* ======================================
          POEMA EM DESTAQUE
          ====================================== */}

      <section className="featured-poem">

        <div className="section-ornament">
          ✦
        </div>


        <p className="section-label">
          poema em destaque
        </p>


        {/* A CARREGAR */}

        {loadingFeatured && (

          <div className="poem-preview">

            <p>
              A abrir o poema...
            </p>

          </div>

        )}


        {/* SEM DESTAQUE */}

        {!loadingFeatured &&
          !featuredPoem && (

            <div className="poem-preview">

              <h2>
                Nenhum poema em destaque
              </h2>


              <p>
                Escolhe um poema no painel
                de administração para o
                colocar aqui.
              </p>

            </div>

          )}


        {/* POEMA EM DESTAQUE */}

        {!loadingFeatured &&
          featuredPoem && (

            <>

              <h2>
                {featuredPoem.title}
              </h2>


              <div className="poem-preview">

                <p>

                  {featuredPoem.excerpt ||
                    featuredPoem.content
                      .split('\n')[0]
                  }

                </p>

              </div>


              <Link
                to={`/poemas/${featuredPoem.id}`}
                className="read-button"
              >

                Ler poema


                <span>
                  →
                </span>

              </Link>

            </>

          )}

      </section>


      {/* ======================================
          SOBRE
          ====================================== */}

      <section
        className="about"
        id="sobre"
      >

        <div className="section-ornament">
          ✦
        </div>


        <p className="section-label">
          sobre o versífera
        </p>


        <h2>
          Um espaço para palavras.
        </h2>


        <p>

          O Versífera é um espaço dedicado
          à poesia, às emoções e às histórias
          que encontramos dentro das palavras.

        </p>

      </section>


    </main>

  )

}


// ==========================================
// APP / ROTAS
// ==========================================

function App() {

  return (

    <Routes>


      {/* ======================================
          PÁGINA INICIAL
          ====================================== */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* ======================================
          BIBLIOTECA
          ====================================== */}

      <Route
        path="/poemas"
        element={<Poems />}
      />


      {/* ======================================
          POEMA INDIVIDUAL
          ====================================== */}

      <Route
        path="/poemas/:id"
        element={<Poem />}
      />


      {/* ======================================
          ADMIN
          ====================================== */}

      <Route
        path="/admin"
        element={<Admin />}
      />


      {/* ======================================
          LOGIN ADMIN
          ====================================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


    </Routes>

  )

}


export default App