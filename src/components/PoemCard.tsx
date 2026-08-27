import { Link } from 'react-router-dom'

import type { Poem } from '../types/poem'


interface PoemCardProps {
  poem: Poem
}


function PoemCard({ poem }: PoemCardProps) {

  return (

    <article className="poem-card">

      {/* Categoria */}

      <span className="poem-card-category">
        {poem.category}
      </span>


      {/* Título */}

      <h2 className="poem-card-title">
        {poem.title}
      </h2>


      {/* Excerto */}

      {poem.excerpt && (

        <p className="poem-card-excerpt">
          {poem.excerpt}
        </p>

      )}


      {/* Separador */}

      <div className="poem-card-divider">

        <span />

        <span>
          ✦
        </span>

        <span />

      </div>


      {/* Data */}

      <p className="poem-card-date">

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


      {/* Botão */}

      <Link
        to={`/poemas/${poem.id}`}
        className="poem-card-button"
      >

        Ler poema

        <span>
          →
        </span>

      </Link>

    </article>

  )
}


export default PoemCard