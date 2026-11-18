import { Link } from 'react-router-dom'
import logoFtImg from '../assets/img/logo_ft.jpg' 

export function Cabecalho() {
  return (
    <header className="flex w-full items-center justify-between bg-[#231b54] px-8 py-4 max-[600px]:px-5">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center no-underline"
      >
        <img
          src={logoFtImg}
          alt="Logo"
          className="h-16 w-auto shrink-0 object-contain"
        />
      </Link>

      {/* Menu de navegação */}
      <nav
        className="flex items-center"
        aria-label="Navegação principal"
      >
        <ul className="flex flex-wrap items-center justify-end gap-6 p-0 m-0 list-none max-[600px]:gap-3">

          <li className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/60">•</span>
            <Link
              to="/"
              className="font-['Inter',sans-serif] text-xs font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80"
            >
              Início
            </Link>
          </li>

          <li className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/60">•</span>
            <Link
              to="/painel-climatico"
              className="font-['Inter',sans-serif] text-xs font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80"
            >
              Painel Climático
            </Link>
          </li>

          <li className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/60">•</span>
            <Link
              to="/sobre"
              className="font-['Inter',sans-serif] text-xs font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80"
            >
              Sobre
            </Link>
          </li>

          <li className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/60">•</span>
            <Link
              to="/integrantes"
              className="font-['Inter',sans-serif] text-xs font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80"
            >
              Integrantes
            </Link>
          </li>

          <li className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/60">•</span>
            <Link
              to="/faq"
              className="font-['Inter',sans-serif] text-xs font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80"
            >
              FAQ
            </Link>
          </li>

          <li className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/60">•</span>
            <Link
              to="/contato"
              className="font-['Inter',sans-serif] text-xs font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80"
            >
              Contato
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Cabecalho