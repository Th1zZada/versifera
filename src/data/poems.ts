export interface Poem {
  id: number
  title: string
  category: string
  date: string
  excerpt: string
  content: string
}

export const poems: Poem[] = [
  {
    id: 1,
    title: 'Primeiro poema',
    category: 'Reflexão',
    date: '26 de agosto de 2026',
    excerpt:
      'Um pequeno fragmento que desperta curiosidade sobre aquilo que está por vir.',
    content: `Aqui ficará o teu poema.

Podes escrever várias estrofes
e manter as quebras de linha.

Cada poema terá a sua própria página.`
  },

  {
    id: 2,
    title: 'Entre silêncios',
    category: 'Melancolia',
    date: '26 de agosto de 2026',
    excerpt:
      'Há palavras que só aparecem quando tudo à nossa volta fica em silêncio.',
    content: `Aqui ficará outro poema.

Este é apenas um exemplo
para começarmos a construir
a biblioteca do Versífera.`
  }
]