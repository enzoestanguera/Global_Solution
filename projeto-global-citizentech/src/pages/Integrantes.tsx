import CardIntegrante from '../components/CardIntegrante'
import alvaroImg from '../assets/img/alvaro.jpg'
import arthurImg from '../assets/img/arthur.jpg'
import dhiegoImg from '../assets/img/dhiego.jpg'
import giovaneImg from '../assets/img/giovane.jpg'
import enzoImg from '../assets/img/enzo.jpg'

type Integrante = {
  nome: string
  rm: string
  turma: string
  foto: string
  github: string
  linkedin: string
}

const integrantes: Integrante[] = [
  {
    nome: 'Álvaro Morais Holanda',
    rm: '568607',
    turma: '1TDSPF',
    foto: alvaroImg,
    github: 'https://github.com/AlvaroHolanda',
    linkedin: 'https://www.linkedin.com/in/álvaro-holanda-b9bb03322/',
  },
  {
    nome: 'Arthur Arruda da Silva',
    rm: '569593',
    turma: '1TDSPF',
    foto: arthurImg,
    github: 'https://github.com/arthurarrudaa',
    linkedin: 'https://www.linkedin.com/in/arthur-arruda-61aa453b0/',
  },
  {
    nome: 'Dhiego Gozzo Belmonte',
    rm: '571505',
    turma: '1TDSPF',
    foto: dhiegoImg,
    github: 'https://github.com/dhiegobelmonte',
    linkedin: 'https://www.linkedin.com/in/dhiego-belmonte-676440283/',
  },
  {
    nome: 'Giovane Dias Chicoli',
    rm: '569750',
    turma: '1TDSPF',
    foto: giovaneImg,
    github: 'https://github.com/Giovvane',
    linkedin: 'https://www.linkedin.com/in/giovane-dias-chicoli-b06b05384/',
  },
  {
    nome: 'Enzo Torres Estanguera',
    rm: '568937',
    turma: '1TDSPF',
    foto: enzoImg,
    github: 'https://github.com/enzoestanguera',
    linkedin: 'https://www.linkedin.com/in/enzo-estanguera/',
  },
]


function Integrantes() {
  return (
    <>
      <main className="mx-auto w-full max-w-[1000px] px-4 py-12">
        {/* .integrantes-hero */}
        <section className="mb-8 max-w-[720px] text-left">
          <span className="mb-2 block text-[0.84rem] font-semibold text-[var(--color-leaf)]">
            Equipe CitizenTech
          </span>
          <h1 className="mt-0 mb-3">Integrantes do grupo</h1>
          <p className="mb-4">Turma: 1TDSPF</p>
          <p className="m-0 leading-relaxed text-[var(--color-muted)]">
            Os cinco estudantes responsáveis por planejar, projetar e desenvolver o CitizenTech.
          </p>
        </section>

        {/* .integrantes_container */}
       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {integrantes.map((pessoa) => (
            <CardIntegrante key={pessoa.rm} {...pessoa} />
          ))}
        </div>

        {/* .integrantes-sobre */}
        <section className="mx-auto mt-8 w-full max-w-[720px] rounded-2xl border-t-4 border-t-[var(--color-leaf)] bg-[var(--color-surface)] p-6 shadow-md sm:p-8">
          <h2 className="mt-0 mb-2">Sobre nós</h2>
          <p className="m-0 text-[0.9rem] leading-relaxed text-[var(--color-muted)]">
            Somos os integrantes da equipe CitizenTech e trabalhamos juntos no desenvolvimento
            de uma proposta voltada à informação e orientação climática, unindo programação,
            organização e criatividade para ajudar os cidadãos a compreender melhor os riscos
            relacionados às condições meteorológicas.
          </p>
        </section>
      </main>

      <footer className="w-full bg-[#231b54] px-10 py-6 text-white [@media(max-width:640px)]:px-4 [@media(max-width:640px)]:py-5 text-center text-[0.84rem]">
        <p className="m-0">&copy; Todos os direitos reservados — CitizenTech — 2026</p>
      </footer>
    </>
  )
}

export default Integrantes
