import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import CidadesFavoritas from '../components/CidadesFavoritas'

const API_URL =
  import.meta.env.VITE_API_URL ??
  'https://climacidadao-java.onrender.com'

type Clima = {
  cidade: string
  temperatura: number
  sensacaoTermica: number
  umidade: number
  vento: number
  descricao: string
}

type Previsao = {
  horarioUtc: number
  temperatura: number
  descricao: string
  probabilidadeChuva: number
  vento: number
}

type DadosPrevisao = {
  cidade: string
  fusoHorarioSegundos: number
  previsoes: Previsao[]
}

type PrevisaoDiaria = {
  data: string
  minima: number
  maxima: number
  descricao: string
}

function formatar(valor: number, casas = 1) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })
}

function nomeDoDia(data: string, fusoHorarioSegundos: number) {
  const hoje = new Date(Date.now() + fusoHorarioSegundos * 1000)
    .toISOString()
    .slice(0, 10)

  const amanha = new Date(Date.now() + fusoHorarioSegundos * 1000 + 86400000)
    .toISOString()
    .slice(0, 10)

  if (data === hoje) return 'Hoje'
  if (data === amanha) return 'Amanhã'

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${data}T12:00:00Z`))
}

// Agrupa a previsão de 3 em 3 horas em até cinco dias.
// Para cada dia, calcula mínima/máxima e escolhe a descrição
// do horário mais próximo do meio-dia local.
function resumirPrevisao(dados: DadosPrevisao): PrevisaoDiaria[] {
  const grupos = new Map<string, Previsao[]>()

  for (const item of dados.previsoes) {
    const data = new Date(
      (item.horarioUtc + dados.fusoHorarioSegundos) * 1000,
    ).toISOString().slice(0, 10)
    const itens = grupos.get(data) ?? []
    itens.push(item)
    grupos.set(data, itens)
  }

  function horaLocal(item: Previsao) {
    return new Date(
      (item.horarioUtc + dados.fusoHorarioSegundos) * 1000,
    ).getUTCHours()
  }

  return Array.from(grupos.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 5)
    .map(([data, itens]) => {
      const referencia = itens.reduce((melhor, item) =>
        Math.abs(horaLocal(item) - 12) < Math.abs(horaLocal(melhor) - 12)
          ? item
          : melhor,
      )

      return {
        data,
        minima: Math.min(...itens.map((item) => item.temperatura)),
        maxima: Math.max(...itens.map((item) => item.temperatura)),
        descricao: referencia.descricao,
      }
    })
}

function mencionaChuva(descricao: string) {
  return /chuva|garoa|chuvisco|tempestade|trovoada|pancadas/i.test(descricao)
}

type Orientacao = {
  titulo: string
  mensagem: string
  simbolo: string
}

// Conselhos informativos com base no clima atual e nas próximas 12 horas.
function criarOrientacao(clima: Clima, previsao: DadosPrevisao | null): Orientacao {
  const agora = Date.now() / 1000
  const proximasHoras = (previsao?.previsoes ?? []).filter(
    (item) => item.horarioUtc >= agora && item.horarioUtc <= agora + 12 * 3600,
  )

  const tempestade = /chuva forte|tempestade|trovoada/i
  const temTempestade = tempestade.test(clima.descricao) ||
    proximasHoras.some((item) => tempestade.test(item.descricao))
  const chuvaAgora = mencionaChuva(clima.descricao)
  const chuvaPrevista = proximasHoras.some((item) => mencionaChuva(item.descricao))
  const chuvaProvavel = proximasHoras.some(
    (item) => Number.isFinite(item.probabilidadeChuva) &&
      item.probabilidadeChuva >= 70 && item.probabilidadeChuva <= 100,
  )
  const ventoForte = clima.vento >= 10 || proximasHoras.some((item) => item.vento >= 10)
  const calorForte = Math.max(clima.temperatura, clima.sensacaoTermica) >= 35 ||
    proximasHoras.some((item) => item.temperatura >= 35)

  if (temTempestade) {
    return {
      simbolo: '⛈️',
      titulo: 'Atenção à possibilidade de tempestade',
      mensagem: 'Há indicação de condições intensas agora ou nas próximas 12 horas. Evite áreas alagadas e acompanhe os avisos oficiais.',
    }
  }
  if (chuvaAgora || chuvaPrevista || chuvaProvavel) {
    return {
      simbolo: '☔',
      titulo: 'Prepare-se para a possibilidade de chuva',
      mensagem: 'Os dados atuais ou das próximas 12 horas indicam chuva ou chance elevada de precipitação em algum horário. Considere levar um guarda-chuva.',
    }
  }
  if (ventoForte) {
    return {
      simbolo: '💨',
      titulo: 'Atenção ao vento',
      mensagem: 'Há indicação de vento de pelo menos 36 km/h agora ou nas próximas 12 horas. Tenha cuidado com objetos soltos.',
    }
  }
  if (calorForte) {
    return {
      simbolo: '☀️',
      titulo: 'Cuide-se durante o calor',
      mensagem: 'Temperatura ou sensação térmica de pelo menos 35 °C nos dados consultados. Beba água e evite esforço intenso sob sol forte.',
    }
  }
  return {
    simbolo: '🌤️',
    titulo: 'Confira o tempo antes de sair',
    mensagem: `Condição atual em ${clima.cidade}: ${clima.descricao}, ${formatar(clima.temperatura)} °C. O tempo pode mudar; acompanhe as atualizações.`,
  }
}

export default function PainelClimatico() {
  const [cidade, setCidade] = useState('')
  const [clima, setClima] = useState<Clima | null>(null)
  const [previsao, setPrevisao] = useState<DadosPrevisao | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [carregandoPrevisao, setCarregandoPrevisao] = useState(false)
  const [erro, setErro] = useState('')
  const numeroPesquisa = useRef(0)

  // Mesma estrutura de cartões, tamanhos e fontes: apenas azul e roxo.
  const cartao =
    'rounded-2xl border-t-4 border-t-[#6950c8] bg-white p-6 shadow-md sm:p-8'

  const campo =
    'w-full p-3 bg-[#f2f5ff] border border-[#cbd5f3] rounded-lg font-[family-name:var(--font-body)] text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#a5b4fc]'

  const botao =
    'mt-3 w-full cursor-pointer rounded-lg border-none bg-[#3b2f86] p-3 font-[family-name:var(--font-body)] font-bold text-white hover:bg-[#2563eb] disabled:opacity-60'

  const cartaoInterno = 'rounded-xl bg-[#edf2ff] p-5 text-center'
  const textoPrincipal = 'text-[#241d5c]'
  const textoSecundario = 'text-[#59627e]'

  // Uma única função atende à pesquisa manual e ao botão "Ver clima".
  async function consultarClima(cidadeSelecionada: string) {
    const busca = cidadeSelecionada.trim()
    if (!busca) {
      setErro('Informe uma cidade ou CEP.')
      return
    }

    // Evita que uma pesquisa antiga substitua o resultado da mais recente.
    const pesquisaAtual = ++numeroPesquisa.current
    setCarregando(true)
    setCarregandoPrevisao(false)
    setErro('')
    setClima(null)
    setPrevisao(null)

    try {
      let cidadeParaConsultar = busca

      // Converte CEP em nome de cidade antes de consultar o Java.
      if (/^[\d-]+$/.test(busca)) {
        const cep = busca.replace(/\D/g, '')
        if (cep.length !== 8) throw new Error('O CEP deve conter 8 números.')

        const respostaCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        if (!respostaCep.ok) throw new Error('Não foi possível consultar o CEP.')

        const endereco = (await respostaCep.json()) as {
          localidade?: string
          erro?: boolean
        }
        if (endereco.erro || !endereco.localidade) {
          throw new Error('CEP não encontrado.')
        }
        cidadeParaConsultar = `${endereco.localidade},BR`
      }

      if (pesquisaAtual !== numeroPesquisa.current) return
      const parametro = encodeURIComponent(cidadeParaConsultar)

      // Etapa 1: consulta o clima atual.
      const respostaClima = await fetch(`${API_URL}/clima?cidade=${parametro}`)
      if (!respostaClima.ok) throw new Error('Não foi possível consultar o clima atual.')

      const dadosClima = (await respostaClima.json()) as Clima
      if (pesquisaAtual !== numeroPesquisa.current) return
      setClima(dadosClima)
      setCarregando(false)
      setCarregandoPrevisao(true)

      // Etapa 2: consulta a previsão. O clima atual já pode ser mostrado.
      const respostaPrevisao = await fetch(`${API_URL}/clima/previsao?cidade=${parametro}`)
      if (!respostaPrevisao.ok) {
        throw new Error('O clima atual carregou, mas a previsão está indisponível.')
      }

      const dadosPrevisao = (await respostaPrevisao.json()) as DadosPrevisao
      if (pesquisaAtual !== numeroPesquisa.current) return
      setPrevisao(dadosPrevisao)
    } catch (falha) {
      if (pesquisaAtual !== numeroPesquisa.current) return
      setErro(falha instanceof Error ? falha.message : 'Não foi possível realizar a pesquisa.')
    } finally {
      if (pesquisaAtual === numeroPesquisa.current) {
        setCarregando(false)
        setCarregandoPrevisao(false)
      }
    }
  }

  function pesquisarCidade(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    void consultarClima(cidade)
  }

  const dias = previsao ? resumirPrevisao(previsao) : []
  const orientacao = clima && !carregandoPrevisao
    ? criarOrientacao(clima, previsao)
    : null

  return (
    <>
      <main className="min-h-[calc(100vh-140px)] bg-[#f5f4ff] px-5 py-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10 text-center">
            <h1 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-[#241d5c] sm:text-4xl">
              Painel Climático
            </h1>
            <p className="mx-auto max-w-2xl font-[family-name:var(--font-body)] text-[#59627e]">
              Pesquise uma cidade ou CEP para consultar o clima atual e a previsão
              meteorológica dos próximos dias.
            </p>
          </header>

          <section className={cartao}>
            <h2 className={`mb-4 text-xl font-bold ${textoPrincipal}`}>
              Pesquisar cidade
            </h2>
            <form onSubmit={pesquisarCidade}>
              <label
                htmlFor="cidade"
                className={`mb-2 block font-medium ${textoPrincipal}`}
              >
                Nome da cidade ou CEP
              </label>
              <input
                id="cidade"
                type="text"
                className={campo}
                placeholder="Ex.: Campinas,BR ou 13010-111"
                value={cidade}
                onChange={(evento: ChangeEvent<HTMLInputElement>) => setCidade(evento.target.value)}
                required
              />
              <button
                type="submit"
                className={botao}
                disabled={carregando || carregandoPrevisao}
              >
                {carregando || carregandoPrevisao
                  ? 'Consultando clima...'
                  : 'Pesquisar clima'}
              </button>
            </form>
            {erro && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {erro}
              </p>
            )}
            {carregando && (
              <p role="status" className={`mt-4 text-sm ${textoSecundario}`}>
                Buscando as condições atuais...
              </p>
            )}
          </section>

          {clima && (
            <section className={`${cartao} mt-8`}>
              <div className="mb-6">
                <p className={`mb-2 text-sm font-medium ${textoSecundario}`}>
                  Relatório meteorológico atual
                </p>
                <h2 className={`text-2xl font-bold ${textoPrincipal}`}>
                  {clima.cidade}
                </h2>
                <p className={`mt-2 capitalize ${textoSecundario}`}>
                  {clima.descricao}
                </p>
              </div>

              <div className="mb-8 rounded-xl bg-[#edf2ff] p-6 text-center">
                <p className={`mb-2 text-sm ${textoSecundario}`}>
                  Temperatura atual
                </p>
                <p className={`text-5xl font-bold ${textoPrincipal}`}>
                  {formatar(clima.temperatura)} °C
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <article className={cartaoInterno}>
                  <h3 className={`mb-2 text-sm ${textoSecundario}`}>
                    Sensação térmica
                  </h3>
                  <p className={`text-2xl font-bold ${textoPrincipal}`}>
                    {formatar(clima.sensacaoTermica)} °C
                  </p>
                </article>
                <article className={cartaoInterno}>
                  <h3 className={`mb-2 text-sm ${textoSecundario}`}>
                    Umidade do ar
                  </h3>
                  <p className={`text-2xl font-bold ${textoPrincipal}`}>
                    {clima.umidade}%
                  </p>
                </article>
                <article className={cartaoInterno}>
                  <h3 className={`mb-2 text-sm ${textoSecundario}`}>
                    Velocidade do vento
                  </h3>
                  <p className={`text-2xl font-bold ${textoPrincipal}`}>
                    {formatar(clima.vento)} m/s
                  </p>
                </article>
              </div>

              <p className={`mt-6 text-center text-xs ${textoSecundario}`}>
                Fonte: OpenWeatherMap. Dados meteorológicos atuais, sujeitos a
                atualizações.
              </p>
            </section>
          )}

          {carregandoPrevisao && (
            <p role="status" className="mt-6 text-center text-sm text-[#4536a3]">
              Carregando a previsão dos próximos dias...
            </p>
          )}

          {previsao && dias.length > 0 && (
            <section className={`${cartao} mt-8`}>
              <h2 className={`mb-3 text-xl font-bold ${textoPrincipal}`}>
                Previsão para os próximos 5 dias
              </h2>
              <p className={`mb-6 text-sm ${textoSecundario}`}>
                Temperaturas mínima e máxima aproximadas e condições previstas
                para cada dia.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {dias.map((dia) => (
                  <article key={dia.data} className={cartaoInterno}>
                    <h3 className={`mb-1 font-bold capitalize ${textoPrincipal}`}>
                      {nomeDoDia(dia.data, previsao.fusoHorarioSegundos)}
                    </h3>
                    <p className={`mb-4 text-xs ${textoSecundario}`}>
                      {dia.data.slice(8, 10)}/{dia.data.slice(5, 7)}
                    </p>
                    <p className={`mb-2 text-2xl font-bold ${textoPrincipal}`}>
                      {formatar(dia.maxima, 0)} °C
                    </p>
                    <p className={`mb-4 text-sm ${textoSecundario}`}>
                      Mínima: {formatar(dia.minima, 0)} °C
                    </p>
                    <p className={`text-sm capitalize ${textoPrincipal}`}>
                      {dia.descricao}
                    </p>
                  </article>
                ))}
              </div>

              <p className={`mt-6 text-center text-xs ${textoSecundario}`}>
                Fonte: OpenWeatherMap. Mínimas e máximas calculadas a partir
                dos horários disponíveis; a descrição representa a condição
                prevista mais próxima do meio-dia.
              </p>
            </section>
          )}

          {orientacao && (
            <section className={`${cartao} mt-8`} aria-live="polite">
              <h2 className={`mb-4 text-xl font-bold ${textoPrincipal}`}>
                Orientação para o seu dia
              </h2>

              <div className="rounded-xl bg-[#edf2ff] p-5">
                <h3 className={`mb-3 text-lg font-bold ${textoPrincipal}`}>
                  <span aria-hidden="true">{orientacao.simbolo} </span>
                  {orientacao.titulo}
                </h3>
                <p className={`text-sm leading-relaxed ${textoSecundario}`}>
                  {orientacao.mensagem}
                </p>
              </div>

              <p className={`mt-4 text-xs ${textoSecundario}`}>
                Orientação informativa baseada no clima e na previsão das próximas
                12 horas. Não é um alerta oficial e não garante ausência de riscos.
                Para avisos oficiais, consulte{' '}
                <a
                  href="https://avisos.inmet.gov.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#4536a3] underline hover:text-[#2563eb]"
                >
                  o INMET
                </a>.
              </p>
            </section>
          )}
          <CidadesFavoritas
            onConsultar={(cidadeFavorita) => {
              setCidade(cidadeFavorita)
              void consultarClima(cidadeFavorita)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </div>
      </main>

    </>
  )
}
