import { NavLink } from 'react-router-dom'
import satelite from '../assets/img/satelite_meteorologico.jpg'

const paginas = [
  { to: '/', numero: 1, titulo: 'Contextualização do projeto' },
  { to: '/solucao/beneficiados', numero: 2, titulo: 'Quem ajudaríamos' },
  { to: '/solucao/exemplos', numero: 3, titulo: 'Exemplos de outros sistemas' },
]

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Contextualização do Projeto</h1>

      <div className="space-y-4 text-justify leading-relaxed">
        <p>
          Nosso projeto é sobre algo que já existe no mundo, porém nossa ideia é melhorá-lo para que
          não haja nenhuma margem de erro.
        </p>
        <p>
          Queremos melhorar a previsão do tempo. Você já deve ter visto nos jornais aquela pessoa que
          aparece falando sobre o clima de determinada região, dizendo para evitar certas áreas em
          certo horário, ou mesmo ter visto pelos aplicativos de hoje em dia. Porém, você segue as
          orientações e, no fim, eles erram feio, e isso faz você pegar a maior chuva que já viu, o
          que acaba te fazendo atrasar para uma reunião importante no trabalho. Acontece com todo
          mundo.
        </p>
        <p>
          Com o nosso projeto, queremos evitar essas situações: usaremos dados espaciais, capturados
          por satélites, para aprimorar a precisão das previsões do clima.
        </p>
      </div>

      <img
        src={satelite}
        alt="Satélite meteorológico em órbita da Terra"
        className="mx-auto my-6 h-auto w-full max-w-lg rounded-lg shadow-md"
      />

      <nav aria-label="Páginas complementares" className="mt-10 text-center">
        <h2 className="mb-3 text-xl font-bold">Páginas complementares</h2>
        <ul className="m-0 flex list-none justify-center gap-3 p-0">
          {paginas.map((pagina) => (
            <li key={pagina.to}>
              <NavLink
                to={pagina.to}
                end
                title={pagina.titulo}
                aria-label={`Página ${pagina.numero}: ${pagina.titulo}`}
                className={({ isActive }) =>
                  `flex size-10 items-center justify-center rounded-full font-sans font-bold ${
                    isActive
                      ? 'bg-[#2a1b14] text-[#fff0e8]'
                      : 'bg-[#e67451] text-[#2a1b14] hover:bg-[#2a1b14] hover:text-[#fff0e8]'
                  }`
                }
              >
                {pagina.numero}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}