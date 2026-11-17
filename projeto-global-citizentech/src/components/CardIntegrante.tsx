type CardIntegranteProps = {
  nome: string
  rm: string
  foto: string
  github: string
  linkedin: string
}

const botao = 'rounded-md bg-[#e67451] px-3 py-1.5 text-[#2a1b14] hover:bg-[#2a1b14] hover:text-[#fff0e8]'

export default function CardIntegrante({
  nome,
  rm,
  foto,
  github,
  linkedin,
}: CardIntegranteProps) {
  return (
    <article className="flex flex-col items-center rounded-xl bg-white p-5 text-center shadow-md">
      <img
        src={foto}
        alt={`Foto de ${nome}`}
        className="size-24 rounded-full object-cover object-top"
      />
      <h2 className="mt-3 mb-1 text-lg leading-snug font-bold">{nome}</h2>
      <p className="m-0 text-sm text-neutral-600">RM: {rm}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-2 font-sans text-sm font-bold">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className={botao}
        >
          GitHub
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={botao}
        >
          LinkedIn
        </a>
      </div>
    </article>
  )
}