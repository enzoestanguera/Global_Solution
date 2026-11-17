import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://climacidadao-java.onrender.com'
const URL_FAVORITOS = `${API_URL}/usuarios/21/favoritos` // Conta de demonstração FIAP

type Favorito = { id: number; cidade: string }
type Props = { onConsultar: (cidade: string) => void }

// Consulta as cidades cadastradas no Oracle pela API Java.
async function listarFavoritos(): Promise<Favorito[]> {
  const resposta = await fetch(URL_FAVORITOS)
  if (!resposta.ok) throw new Error('Não foi possível carregar os favoritos.')
  return (await resposta.json()) as Favorito[]
}

// Se a entrada for um CEP, encontra o nome da cidade no ViaCEP.
async function obterCidade(texto: string): Promise<string> {
  if (!/^[\d.\s-]+$/.test(texto)) return texto

  const cep = texto.replace(/\D/g, '')
  if (cep.length !== 8) throw new Error('Digite um CEP com 8 números.')

  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
  if (!resposta.ok) throw new Error('Não foi possível consultar o CEP.')

  const endereco = (await resposta.json()) as { localidade?: string; erro?: boolean }
  if (endereco.erro || !endereco.localidade) throw new Error('CEP não encontrado.')
  return endereco.localidade
}

export default function CidadesFavoritas({ onConsultar }: Props) {
  const [cidade, setCidade] = useState('')
  const [favoritos, setFavoritos] = useState<Favorito[]>([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [excluindoId, setExcluindoId] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  // Carrega a lista ao abrir a página.
  useEffect(() => {
    let ativo = true
    listarFavoritos()
      .then((lista) => { if (ativo) setFavoritos(lista) })
      .catch(() => { if (ativo) setErro('Não foi possível carregar os favoritos.') })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [])

  // Confirmações azuis desaparecem depois de cinco segundos.
  useEffect(() => {
    if (!sucesso) return
    const tempo = window.setTimeout(() => setSucesso(''), 5000)
    return () => window.clearTimeout(tempo)
  }, [sucesso])

  async function adicionar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!cidade.trim()) return

    setSalvando(true)
    setErro('')
    setSucesso('')

    try {
      const nome = await obterCidade(cidade.trim())
      const resposta = await fetch(URL_FAVORITOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cidade: nome }),
      })

      if (resposta.status === 409) throw new Error('Essa cidade já está nos favoritos.')
      if (!resposta.ok) throw new Error('Não foi possível cadastrar a cidade.')

      setFavoritos(await listarFavoritos())
      setCidade('')
      setSucesso('Cidade adicionada aos favoritos!')
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Erro ao cadastrar cidade.')
    } finally {
      setSalvando(false)
    }
  }

  async function remover(favorito: Favorito) {
    if (!window.confirm(`Remover ${favorito.cidade} dos favoritos?`)) return

    setExcluindoId(favorito.id)
    setErro('')
    setSucesso('')

    try {
      const resposta = await fetch(`${API_URL}/favoritos/${favorito.id}`, { method: 'DELETE' })
      if (!resposta.ok) throw new Error('Não foi possível remover a cidade.')

      setFavoritos((lista) => lista.filter((item) => item.id !== favorito.id))
      setSucesso(`${favorito.cidade} foi removida dos favoritos.`)
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Erro ao remover cidade.')
    } finally {
      setExcluindoId(null)
    }
  }

  return (
    <section className="mt-8 rounded-2xl border-t-4 border-t-[#6950c8] bg-white p-6 shadow-md sm:p-8">
      <h2 className="mb-3 text-xl font-bold text-[#241d5c]">Cidades favoritas</h2>
      <p className="mb-5 text-sm text-[#59627e]">
        Salve cidades e consulte o clima com um clique. Os dados ficam no Oracle pela API Java.
      </p>
      <p className="mb-5 text-xs text-[#59627e]">
        Demonstração FIAP: lista compartilhada do usuário de teste.
      </p>

      <form onSubmit={adicionar}>
        <label htmlFor="cidade-favorita" className="mb-2 block font-medium text-[#241d5c]">
          Nome da cidade ou CEP
        </label>
        <input
          id="cidade-favorita"
          type="text"
          maxLength={100}
          placeholder="Ex.: São Paulo ou 01310-100"
          value={cidade}
          onChange={(evento) => setCidade(evento.target.value)}
          className="w-full rounded-lg border border-[#cbd5f3] bg-[#f2f5ff] p-3 focus:outline-none focus:ring-2 focus:ring-[#a5b4fc]"
          required
        />
        <button
          type="submit"
          disabled={salvando || excluindoId !== null}
          className="mt-3 w-full cursor-pointer rounded-lg bg-[#3b2f86] p-3 font-bold text-white hover:bg-[#2563eb] disabled:opacity-60"
        >
          {salvando ? 'Salvando...' : 'Adicionar aos favoritos'}
        </button>
      </form>

      {erro && <p role="alert" className="mt-4 text-sm text-red-700">{erro}</p>}
      {sucesso && (
        <p role="status" className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-medium text-blue-800">
          {sucesso}
        </p>
      )}

      <h3 className="mb-3 mt-6 font-bold text-[#241d5c]">Cidades cadastradas</h3>
      {carregando ? (
        <p className="text-sm text-[#59627e]">Carregando favoritos...</p>
      ) : favoritos.length === 0 ? (
        <p className="text-sm text-[#59627e]">Nenhuma cidade favorita cadastrada.</p>
      ) : (
        <ul className="space-y-2">
          {favoritos.map((favorito) => (
            <li key={favorito.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#edf2ff] p-3">
              <span className="font-medium text-[#241d5c]">📍 {favorito.cidade}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onConsultar(favorito.cidade)}
                  className="cursor-pointer rounded-lg bg-[#3b2f86] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563eb]"
                >
                  Ver clima
                </button>
                <button
                  type="button"
                  onClick={() => void remover(favorito)}
                  disabled={excluindoId !== null || salvando}
                  className="cursor-pointer rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                  aria-label={`Remover ${favorito.cidade} dos favoritos`}
                >
                  {excluindoId === favorito.id ? 'Removendo...' : 'Remover'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
