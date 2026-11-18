import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoFtImg from '../assets/img/logo_ft.jpg' 

export function Cabecalho() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <header className="flex w-full flex-wrap items-center justify-between bg-[#231b54] px-6 py-4 md:px-8">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center no-underline shrink-0"
      >
        <img
          src={logoFtImg}
          alt="Logo"
          className="h-12 md:h-16 w-auto object-contain"
        />
      </Link>

      {/* Botão do Menu Hambúrguer*/}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex flex-col justify-center items-center w-10 h-10 rounded-lg text-white md:hidden hover:bg-white/10 focus:outline-none"
        aria-label="Abrir menu"
      >
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white my-1.5 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Menu de navegação */}
      <nav
        className={`w-full md:w-auto md:flex items-center transition-all duration-300 ease-in-out ${
          menuOpen ? 'block pt-4 pb-2' : 'hidden'
        }`}
        aria-label="Navegação principal"
      >
        <ul className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-4 md:gap-6 p-0 m-0 list-none">

          <li className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="hidden md:inline text-[10px] text-white/60">•</span>
            <Link
              to="/"
              onClick={handleLinkClick}
              className="font-['Inter',sans-serif] text-sm font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80 w-full"
            >
              Início
            </Link>
          </li>

          <li className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="hidden md:inline text-[10px] text-white/60">•</span>
            <Link
              to="/painel-climatico"
              onClick={handleLinkClick}
              className="font-['Inter',sans-serif] text-sm font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80 w-full"
            >
              Painel Climático
            </Link>
          </li>

          <li className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="hidden md:inline text-[10px] text-white/60">•</span>
            <Link
              to="/sobre"
              onClick={handleLinkClick}
              className="font-['Inter',sans-serif] text-sm font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80 w-full"
            >
              Sobre
            </Link>
          </li>

          <li className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="hidden md:inline text-[10px] text-white/60">•</span>
            <Link
              to="/integrantes"
              onClick={handleLinkClick}
              className="font-['Inter',sans-serif] text-sm font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80 w-full"
            >
              Integrantes
            </Link>
          </li>

          <li className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="hidden md:inline text-[10px] text-white/60">•</span>
            <Link
              to="/faq"
              onClick={handleLinkClick}
              className="font-['Inter',sans-serif] text-sm font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80 w-full"
            >
              FAQ
            </Link>
          </li>

          <li className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="hidden md:inline text-[10px] text-white/60">•</span>
            <Link
              to="/contato"
              onClick={handleLinkClick}
              className="font-['Inter',sans-serif] text-sm font-medium text-white no-underline transition-opacity duration-200 hover:opacity-80 w-full"
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