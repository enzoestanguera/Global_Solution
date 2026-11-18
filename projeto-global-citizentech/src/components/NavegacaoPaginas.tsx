import { NavLink } from 'react-router-dom'

const paginas = [
  { to: '/', numero: 1, titulo: 'Contextualização do projeto' },
  { to: '/solucao/beneficiados', numero: 2, titulo: 'Quem ajudaríamos' },
  { to: '/solucao/exemplos', numero: 3, titulo: 'Exemplos de outros sistemas' },
]

export default function NavegacaoPaginas() {
  return (
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
  )
}