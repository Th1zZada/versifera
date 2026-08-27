import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import type { Poem } from '../types/poem'
import { supabase } from '../lib/supabase'


function Admin() {

  const navigate = useNavigate()


  // ==========================================
  // AUTENTICAÇÃO
  // ==========================================

  const [checkingAuth, setCheckingAuth] = useState(true)


  useEffect(() => {

    async function checkAuth() {

      const {
        data: { session }
      } = await supabase.auth.getSession()


      if (!session) {

        navigate('/admin/login', {
          replace: true
        })

        return
      }


      setCheckingAuth(false)

    }


    checkAuth()

  }, [navigate])


  // ==========================================
  // POEMAS
  // ==========================================

  const [poems, setPoems] = useState<Poem[]>([])
  const [loadingPoems, setLoadingPoems] = useState(true)


  // ==========================================
  // FORMULÁRIO
  // ==========================================

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  const [published, setPublished] = useState(true)
  const [featured, setFeatured] = useState(false)


  // ==========================================
  // EDIÇÃO
  // ==========================================

  const [editingId, setEditingId] = useState<string | null>(null)


  // ==========================================
  // ESTADO
  // ==========================================

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')


  // ==========================================
  // CARREGAR POEMAS
  // ==========================================

  async function loadPoems() {

    setLoadingPoems(true)


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

      setLoadingPoems(false)

      return
    }


    setPoems(data ?? [])
    setLoadingPoems(false)

  }


  // ==========================================
  // INICIAR
  // ==========================================

  useEffect(() => {

    async function start() {

      const {
        data: { session }
      } = await supabase.auth.getSession()


      if (!session) {
        return
      }


      loadPoems()

    }


    start()

  }, [])


  // ==========================================
  // LIMPAR FORMULÁRIO
  // ==========================================

  function clearForm() {

    setTitle('')
    setCategory('')
    setExcerpt('')
    setContent('')

    setPublished(true)
    setFeatured(false)

    setEditingId(null)

    setMessage('')
    setError('')

  }


  // ==========================================
  // EDITAR POEMA
  // ==========================================

  function startEditing(poem: Poem) {

    setEditingId(poem.id)

    setTitle(poem.title)
    setCategory(poem.category)
    setExcerpt(poem.excerpt ?? '')
    setContent(poem.content)

    setPublished(poem.published)
    setFeatured(poem.featured)

    setMessage('')
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }


  // ==========================================
  // GUARDAR
  // ==========================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault()

    setMessage('')
    setError('')


    // ------------------------------------------
    // VALIDAÇÕES
    // ------------------------------------------

    if (!title.trim()) {

      setError(
        'Escreve um título para o poema.'
      )

      return
    }


    if (!category.trim()) {

      setError(
        'Indica uma categoria.'
      )

      return
    }


    if (!content.trim()) {

      setError(
        'Escreve o conteúdo do poema.'
      )

      return
    }


    setSaving(true)


    // ==========================================
    // EDITAR
    // ==========================================

    if (editingId) {

      const { error } = await supabase
        .from('poems')
        .update({
          title: title.trim(),
          category: category.trim(),
          excerpt: excerpt.trim() || null,
          content: content.trim(),
          published,
          featured
        })
        .eq('id', editingId)


      if (error) {

        console.error(
          'Erro ao editar poema:',
          error
        )

        setError(
          'Não foi possível atualizar o poema.'
        )

        setSaving(false)

        return
      }


      setMessage(
        'O poema foi atualizado com sucesso.'
      )

    }

    // ==========================================
    // CRIAR
    // ==========================================

    else {

      const { error } = await supabase
        .from('poems')
        .insert([
          {
            title: title.trim(),
            category: category.trim(),
            excerpt: excerpt.trim() || null,
            content: content.trim(),
            published,
            featured
          }
        ])


      if (error) {

        console.error(
          'Erro ao guardar poema:',
          error
        )

        setError(
          'Não foi possível guardar o poema.'
        )

        setSaving(false)

        return
      }


      setMessage(
        'O poema foi guardado com sucesso.'
      )

    }


    // ==========================================
    // LIMPAR
    // ==========================================

    setTitle('')
    setCategory('')
    setExcerpt('')
    setContent('')

    setPublished(true)
    setFeatured(false)

    setEditingId(null)


    // ==========================================
    // ATUALIZAR LISTA
    // ==========================================

    await loadPoems()


    setSaving(false)

  }


  // ==========================================
  // APAGAR
  // ==========================================

  async function deletePoem(poem: Poem) {

    const confirmed = window.confirm(
      `Tens a certeza que queres apagar "${poem.title}"?`
    )


    if (!confirmed) {
      return
    }


    setMessage('')
    setError('')


    const { error } = await supabase
      .from('poems')
      .delete()
      .eq('id', poem.id)


    if (error) {

      console.error(
        'Erro ao apagar poema:',
        error
      )

      setError(
        'Não foi possível apagar o poema.'
      )

      return
    }


    if (editingId === poem.id) {
      clearForm()
    }


    setMessage(
      'O poema foi apagado com sucesso.'
    )


    await loadPoems()

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  async function handleLogout() {

    await supabase.auth.signOut()

    navigate('/admin/login', {
      replace: true
    })

  }


  // ==========================================
  // AUTENTICAÇÃO
  // ==========================================

  if (checkingAuth) {

    return (

      <main className="admin-page">

        <div className="no-poems">

          <span>
            ✦
          </span>

          <h2>
            A abrir o atelier...
          </h2>

          <p>
            A verificar o acesso.
          </p>

        </div>

      </main>

    )

  }


  // ==========================================
  // PÁGINA
  // ==========================================

  return (

    <main className="admin-page">


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


          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Sair
          </button>

        </div>

      </nav>


      {/* ======================================
          FORMULÁRIO
          ====================================== */}

      <section className="admin-container">


        <div className="admin-header">

          <span>
            ✦
          </span>


          <p className="section-label">
            administração
          </p>


          <h1>
            {editingId
              ? 'Editar poema'
              : 'Novo poema'
            }
          </h1>


          <p>
            {editingId
              ? 'Altera o poema selecionado.'
              : 'Escreve e publica um novo poema no Versífera.'
            }
          </p>

        </div>


        {/* ======================================
            MENSAGENS
            ====================================== */}

        {message && (

          <div className="admin-message success">
            {message}
          </div>

        )}


        {error && (

          <div className="admin-message error">
            {error}
          </div>

        )}


        {/* ======================================
            FORMULÁRIO
            ====================================== */}

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >


          {/* TÍTULO */}

          <div className="form-group">

            <label htmlFor="title">
              Título
            </label>


            <input
              id="title"
              type="text"
              placeholder="Título do poema..."
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />

          </div>


          {/* CATEGORIA */}

          <div className="form-group">

            <label htmlFor="category">
              Categoria
            </label>


            <input
              id="category"
              type="text"
              placeholder="Ex.: Amor, Saudade, Reflexão..."
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              required
            />

          </div>


          {/* EXCERTO */}

          <div className="form-group">

            <label htmlFor="excerpt">
              Excerto
            </label>


            <textarea
              id="excerpt"
              placeholder="Uma pequena frase ou introdução..."
              value={excerpt}
              onChange={(event) =>
                setExcerpt(event.target.value)
              }
              rows={3}
            />

          </div>


          {/* POEMA */}

          <div className="form-group">

            <label htmlFor="content">
              Poema
            </label>


            <textarea
              id="content"
              className="poem-textarea"
              placeholder="Escreve aqui o teu poema..."
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              rows={15}
              required
            />

          </div>


          {/* OPÇÕES */}

          <div className="admin-options">


            <label className="checkbox-option">

              <input
                type="checkbox"
                checked={published}
                onChange={(event) =>
                  setPublished(
                    event.target.checked
                  )
                }
              />


              <span>
                Publicar imediatamente
              </span>

            </label>


            <label className="checkbox-option">

              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(
                    event.target.checked
                  )
                }
              />


              <span>
                Colocar em destaque
              </span>

            </label>

          </div>


          {/* BOTÕES */}

          <div className="admin-form-buttons">

            <button
              type="submit"
              className="admin-submit"
              disabled={saving}
            >

              {saving
                ? 'A guardar...'
                : editingId
                  ? 'Guardar alterações'
                  : 'Guardar poema'
              }


              {!saving && (

                <span>
                  →
                </span>

              )}

            </button>


            {editingId && (

              <button
                type="button"
                className="admin-cancel-button"
                onClick={clearForm}
              >
                Cancelar edição
              </button>

            )}

          </div>

        </form>


        {/* ======================================
            LISTA DE POEMAS
            ====================================== */}

        <section className="admin-poems">


          <div className="admin-poems-header">

            <p className="section-label">
              biblioteca
            </p>


            <h2>
              Os teus poemas
            </h2>


            <p>

              {poems.length === 1
                ? '1 poema criado'
                : `${poems.length} poemas criados`
              }

            </p>

          </div>


          {/* CARREGAR */}

          {loadingPoems && (

            <div className="no-poems">

              <span>
                ✦
              </span>

              <p>
                A carregar poemas...
              </p>

            </div>

          )}


          {/* VAZIO */}

          {!loadingPoems &&
            poems.length === 0 && (

              <div className="no-poems">

                <span>
                  ✦
                </span>

                <h2>
                  Ainda não existem poemas
                </h2>

                <p>
                  Cria o primeiro poema acima.
                </p>

              </div>

            )}


          {/* POEMAS */}

          {!loadingPoems &&
            poems.length > 0 && (

              <div className="admin-poems-list">

                {poems.map((poem) => (

                  <article
                    key={poem.id}
                    className="admin-poem-item"
                  >


                    <div className="admin-poem-info">

                      <span className="poem-card-category">
                        {poem.category}
                      </span>


                      <h3>
                        {poem.title}
                      </h3>


                      <p>

                        {poem.published
                          ? 'Publicado'
                          : 'Rascunho'
                        }

                      </p>

                    </div>


                    <div className="admin-poem-actions">

                      {/* VER */}

                      <Link
                        to={`/poemas/${poem.id}`}
                        className="poem-card-button"
                      >

                        Ver poema

                        <span>
                          →
                        </span>

                      </Link>


                      {/* EDITAR */}

                      <button
                        type="button"
                        className="admin-edit-button"
                        onClick={() =>
                          startEditing(poem)
                        }
                      >
                        Editar
                      </button>


                      {/* APAGAR */}

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() =>
                          deletePoem(poem)
                        }
                      >
                        Apagar
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            )}

        </section>

      </section>


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


export default Admin