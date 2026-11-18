import { Link } from 'react-router-dom'

export default function Rodape() {
    return (
        <footer className="w-full bg-[#231b54] text-white">
            <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
                <div>
                    <h2 className="mb-3 text-xl font-bold text-white">
                        ClimateSafe
                    </h2>
                    <p className="text-sm leading-relaxed text-white/80">
                        Informações meteorológicas, previsão do tempo e
                        cidades favoritas para facilitar o planejamento
                        das atividades do dia a dia.
                    </p>
                    <p className="mt-3 text-sm text-white/70">
                        Projeto acadêmico CitizenTech — FIAP.
                    </p>
                </div>

                <nav aria-label="Links do rodapé">
                    <h2 className="mb-3 text-lg font-bold text-white">
                        Links rápidos
                    </h2>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="text-white/80 hover:text-white">Início</Link></li>
                        <li><Link to="/painel-climatico" className="text-white/80 hover:text-white">Painel Climático</Link></li>
                        <li><Link to="/sobre" className="text-white/80 hover:text-white">Sobre</Link></li>
                        <li><Link to="/integrantes" className="text-white/80 hover:text-white">Nossa equipe</Link></li>
                        <li><Link to="/faq" className="text-white/80 hover:text-white">Perguntas frequentes</Link></li>
                    </ul>
                </nav>

                <div>
                    <h2 className="mb-3 text-lg font-bold text-white">
                        Contato e informações
                    </h2>
                    <p className="mb-3 text-sm leading-relaxed text-white/80">
                        Tem dúvidas ou sugestões? Entre em contato
                        com a equipe pelo formulário do site.
                    </p>
                    <Link
                        to="/contato"
                        className="inline-block rounded-lg bg-[#6950c8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5140aa]"
                    >
                        Fale conosco
                    </Link>
                    <p className="mt-4 text-sm text-white/70">
                        Localização: Brasil — projeto acadêmico da FIAP.
                    </p>
                    <a
                        href="https://github.com/arthurarrudaa/climacidadao-java"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-white/80 underline hover:text-white"
                    >
                        API Java no GitHub
                    </a>
                </div>
            </div>

            <div className="border-t border-white/20 px-4 py-5 text-center text-xs text-white/70">
                © 2026 ClimaCidadão — CitizenTech.
                Projeto acadêmico desenvolvido para a FIAP.
            </div>
        </footer>
    )
}
