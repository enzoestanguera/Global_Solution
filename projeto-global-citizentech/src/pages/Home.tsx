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
          Você já planejou um compromisso contando com a previsão do tempo e acabou sendo surpreendido por uma chuva inesperada? 
          Mudanças nas condições climáticas podem afetar nossos deslocamentos, compromissos e atividades do dia a dia. 
          Ter acesso a informações meteorológicas de maneira rápida e organizada pode fazer a diferença na hora de planejar a rotina.
        </p>
        <p>
          Pensando nisso, desenvolvemos o ClimaCidadão, uma plataforma que facilita o acesso às informações sobre o clima. 
          Nosso sistema permite pesquisar por cidade ou CEP, consultar temperatura, sensação térmica, umidade, velocidade do vento 
          e acompanhar a previsão dos próximos dias. Além disso, oferece orientações úteis de acordo com as condições meteorológicas 
          apresentadas.

          Para tornar a experiência ainda mais prática, o usuário pode cadastrar suas cidades favoritas, visualizar os locais salvos 
          e consultar o clima de qualquer um deles com apenas um clique.
        </p>
        <p>
          O projeto integra um frontend desenvolvido em React com uma API REST em Java e Spring Boot, utilizando dados meteorológicos 
          do OpenWeatherMap e o banco de dados Oracle para armazenar informações. Com isso, buscamos oferecer uma solução acessível, 
          intuitiva e funcional, que ajude os cidadãos a se informarem e planejarem melhor suas atividades diárias.
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