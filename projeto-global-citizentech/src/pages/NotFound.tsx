import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 text-center">
      <h1 className="mb-4 text-3xl font-bold">Página não encontrada</h1>
      <p>O endereço que você acessou não existe neste site.</p>
      <p className="mt-4">
        <Link to="/" className="underline">Voltar para o início</Link>
      </p>
    </section>
  )
}