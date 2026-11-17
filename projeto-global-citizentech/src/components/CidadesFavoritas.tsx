
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

const API_URL =
    import.meta.env.VITE_API_URL ??
    'https://climacidadao-java.onrender.com'

// Usuário fictício criado exclusivamente para a demonstração da FIAP.
const USUARIO_DEMO_ID = 21

type Favorito = {
    id: number
    cidade: string
    usuarioId?: number
}

type Props = {
  onConsultar: (cidade: string) => void
}

const URL_FAVORITOS =
    `${API_URL}/usuarios/${USUARIO_DEMO_ID}/favoritos`

export default function CidadesFavoritas({ onConsultar }: Props) {
    const [cidade, setCidade] = useState('')
    const [favoritos, setFavoritos] = useState<Favorito[]>([])
    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)
    const [excluindoId, setExcluindoId] = useState<number | null>(null)
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    useEffect(() => {
        if (!sucesso) return

        const temporizador = window.setTimeout(() => {
            setSucesso('')
        }, 5000)

        return () => window.clearTimeout(temporizador)
    }, [sucesso])

    useEffect(() => {
        let ativo = true

        async function carregar() {
            try {
                const resposta = await fetch(URL_FAVORITOS)

                if (!resposta.ok) {
                    throw new Error('Falha ao consultar favoritos.')
                }

                const dados = (await resposta.json()) as Favorito[]

                if (ativo) setFavoritos(dados)
            } catch {
                if (ativo) {
                    setErro('Não foi possível carregar as cidades favoritas.')
                }
            } finally {
                if (ativo) setCarregando(false)
            }
        }

        void carregar()

        return () => {
            ativo = false
        }
    }, [])

    async function adicionarFavorito(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()

        const cidadeInformada = cidade.trim()
        if (!cidadeInformada) return

        setSalvando(true)
        setErro('')
        setSucesso('')

        try {
            const resposta = await fetch(URL_FAVORITOS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cidade: cidadeInformada }),
            })

            if (resposta.status === 409) {
                setErro('Essa cidade já está cadastrada nos favoritos.')
                return
            }

            if (!resposta.ok) {
                throw new Error('Não foi possível cadastrar a cidade.')
            }

            // Consulta novamente o Oracle após o cadastro.
            const consulta = await fetch(URL_FAVORITOS)

            if (!consulta.ok) {
                throw new Error('Cidade salva, mas a lista não foi atualizada.')
            }

            const listaAtualizada = (await consulta.json()) as Favorito[]

            setFavoritos(listaAtualizada)
            setCidade('')
            setSucesso('Cidade favorita cadastrada com sucesso!')
        } catch (falha) {
            setErro(
                falha instanceof Error
                    ? falha.message
                    : 'Erro ao cadastrar a cidade favorita.',
            )
        } finally {
            setSalvando(false)
        }
    }


    async function removerFavorito(favorito: Favorito) {
        const confirmou = window.confirm(
            `Deseja remover ${favorito.cidade} das cidades favoritas?`
        )

        if (!confirmou) return

        setExcluindoId(favorito.id)
        setErro('')
        setSucesso('')

        try {
            const resposta = await fetch(
                `${API_URL}/favoritos/${favorito.id}`,
                { method: 'DELETE' }
            )

            if (!resposta.ok) {
                throw new Error('Não foi possível remover a cidade.')
            }

            setFavoritos((listaAtual) =>
                listaAtual.filter((item) => item.id !== favorito.id)
            )

            setSucesso(`${favorito.cidade} foi removida dos favoritos.`)
        } catch (falha) {
            setErro(
                falha instanceof Error
                    ? falha.message
                    : 'Erro ao remover cidade.'
            )
        } finally {
            setExcluindoId(null)
        }
    }


    return (
        <section className="mt-8 rounded-2xl border-t-4 border-t-[#6950c8] bg-white p-6 shadow-md sm:p-8">
            <h2 className="mb-3 text-xl font-bold text-[#241d5c]">
                Cidades favoritas
            </h2>

            <p className="mb-5 text-sm text-[#59627e]">
                Salve cidades de interesse e consulte a lista armazenada
                no banco Oracle pela API Java.
            </p>

            <p className="mb-5 text-xs text-[#59627e]">
                Demonstração FIAP: lista compartilhada do usuário de teste.
            </p>

            <form onSubmit={adicionarFavorito}>
                <label
                    htmlFor="cidade-favorita"
                    className="mb-2 block font-medium text-[#241d5c]"
                >
                    Nome da cidade
                </label>

                <input
                    id="cidade-favorita"
                    type="text"
                    maxLength={100}
                    placeholder="Ex.: São Paulo"
                    value={cidade}
                    onChange={(evento) => setCidade(evento.target.value)}
                    className="w-full rounded-lg border border-[#cbd5f3] bg-[#f2f5ff] p-3 focus:outline-none focus:ring-2 focus:ring-[#a5b4fc]"
                    required
                />

                <button
                    type="submit"
                    disabled={salvando}
                    className="mt-3 w-full cursor-pointer rounded-lg bg-[#3b2f86] p-3 font-bold text-white hover:bg-[#2563eb] disabled:opacity-60"
                >
                    {salvando ? 'Salvando...' : 'Adicionar aos favoritos'}
                </button>
            </form>

            {erro && (
                <p role="alert" className="mt-4 text-sm text-red-700">
                    {erro}
                </p>
            )}

            {sucesso && (
                <p role="status" className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-medium text-blue-800">
                    {sucesso}
                </p>
            )}

            <h3 className="mb-3 mt-6 font-bold text-[#241d5c]">
                Cidades cadastradas
            </h3>

            {carregando ? (
                <p className="text-sm text-[#59627e]">Carregando favoritos...</p>
            ) : favoritos.length === 0 ? (
                <p className="text-sm text-[#59627e]">
                    Nenhuma cidade favorita cadastrada.
                </p>
            ) : (
                <ul className="space-y-2">
                    {favoritos.map((favorito) => (
                        <li
                            key={favorito.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#edf2ff] p-3"
                        >
                            <span className="font-medium text-[#241d5c]">
                                📍 {favorito.cidade}
                            </span>

                            <button
                                type="button"
                                onClick={() => onConsultar(favorito.cidade)}
                                className="cursor-pointer rounded-lg bg-[#3b2f86] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563eb]"
                                >
                                Ver clima
                            </button>

                            <button
                                type="button"
                                onClick={() => void removerFavorito(favorito)}
                                disabled={excluindoId !== null}
                                className="cursor-pointer rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                                aria-label={`Remover ${favorito.cidade} dos favoritos`}
                            >
                                {excluindoId === favorito.id ? 'Removendo...' : 'Remover'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
