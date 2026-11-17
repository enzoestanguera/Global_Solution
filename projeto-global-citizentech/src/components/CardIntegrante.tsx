type CardIntegranteProps = {
  nome: string
  rm: string
  foto: string
  github: string
  linkedin: string
}

export default function CardIntegrante({
  nome,
  rm,
  foto,
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
    </article>
  )
}