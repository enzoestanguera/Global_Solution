import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

const API_URL =
  import.meta.env.VITE_API_URL ??
  'https://climacidadao-java.onrender.com'

// Evita consultar novamente os mesmos dados a cada pesquisa repetida.
const TEMPO_CACHE = 10 * 60 * 1000 // 10 minutos

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
  maiorProbabilidade: number | null
  horarioMaiorProbabilidade: number | null
  horarioReferencia: number
  indicaChuva: boolean
}

type ResultadoEmCache = {
  salvoEm: number
  clima: Clima
  previsao: DadosPrevisao
}

function formatar(valor: number, casas = 1) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })
}

function horaLocal(horarioUtc: number, fusoHorarioSegundos: number) {
  const data = new Date((horarioUtc + fusoHorarioSegundos) * 1000)
  return `${String(data.getUTCHours()).padStart(2, '0')}h`
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

// A previsao vem a cada 3 horas. O resumo mostra a condicao proxima
// do meio-dia e, SEPARADAMENTE, a maior probabilidade em um intervalo
// disponivel. Nunca apresentamos essa maxima como chance do dia inteiro.
function mencionaChuva(descricao: string) {
  return /chuva|garoa|chuvisco|tempestade|trovoada|pancadas/i.test(descricao)
}

function resumirPrevisao(dados: DadosPrevisao): PrevisaoDiaria[] {
  const grupos = new Map<string, Previsao[]>()

  for (const item of dados.previsoes) {
    const dataLocal = new Date(
      (item.horarioUtc + dados.fusoHorarioSegundos) * 1000,
    )
    const data = dataLocal.toISOString().slice(0, 10)
    const lista = grupos.get(data) ?? []
    lista.push(item)
    grupos.set(data, lista)
  }

  return Array.from(grupos.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 5)
    .map(([data, itens]) => {
      const hora = (item: Previsao) =>
        new Date(
          (item.horarioUtc + dados.fusoHorarioSegundos) * 1000,
        ).getUTCHours()

      const periodosDiurnos = itens.filter(
        (item) => hora(item) >= 9 && hora(item) <= 18,
      )
      const candidatos = periodosDiurnos.length > 0 ? periodosDiurnos : itens

      const referencia = candidatos.reduce((melhor, item) =>
        Math.abs(hora(item) - 12) < Math.abs(hora(melhor) - 12)
          ? item
          : melhor,
      )

      // Não converte valor ausente/inválido em 0% no React.
      const probabilidadesValidas = itens.filter(
        (item) =>
          typeof item.probabilidadeChuva === 'number' &&
          Number.isFinite(item.probabilidadeChuva) &&
          item.probabilidadeChuva >= 0 &&
          item.probabilidadeChuva <= 100,
      )
      const maior = probabilidadesValidas.length > 0
        ? probabilidadesValidas.reduce((a, b) =>
            b.probabilidadeChuva > a.probabilidadeChuva ? b : a,
          )
        : null

      return {
        data,
        minima: Math.min(...itens.map((item) => item.temperatura)),
        maxima: Math.max(...itens.map((item) => item.temperatura)),
        descricao: referencia.descricao,
        horarioReferencia: referencia.horarioUtc,
        maiorProbabilidade: maior?.probabilidadeChuva ?? null,
        horarioMaiorProbabilidade: maior?.horarioUtc ?? null,
        indicaChuva: itens.some((item) => mencionaChuva(item.descricao)),
      }
    })
}

function lerCache(chave: string): ResultadoEmCache | null {
  try {
    const salvo = sessionStorage.getItem(chave)
    if (!salvo) return null

    const resultado = JSON.parse(salvo) as ResultadoEmCache
    if (
      !resultado.clima ||
      !resultado.previsao ||
      !Array.isArray(resultado.previsao.previsoes) ||
      Date.now() - resultado.salvoEm > TEMPO_CACHE
    ) {
      sessionStorage.removeItem(chave)
      return null
    }

    return resultado
  } catch {
    return null
  }
}

function salvarCache(chave: string, clima: Clima, previsao: DadosPrevisao) {
  try {
    sessionStorage.setItem(
      chave,
      JSON.stringify({ salvoEm: Date.now(), clima, previsao }),
    )
  } catch {
    // O painel funciona mesmo quando o navegador bloqueia o armazenamento.
  }
}

type Orientacao = {
  titulo: string
  mensagem: string
  simbolo: string
}

// Mensagens informativas: dados atuais e previsao das proximas 12 horas.
// Condicoes no momento e previstas para horarios futuros sao diferentes.
// Nao sao alertas oficiais ou recomendacoes para permanecer em casa.
function criarOrientacao(
  clima: Clima,
  previsao: DadosPrevisao | null,
): Orientacao {
  const agora = Date.now() / 1000
  const proximasHoras = (previsao?.previsoes ?? []).filter(
    (item) => item.horarioUtc >= agora && item.horarioUtc <= agora + 12 * 3600,
  )

  const possibilidades = proximasHoras
    .map((item) => item.probabilidadeChuva)
    .filter((valor) =>
      typeof valor === 'number' &&
      Number.isFinite(valor) &&
      valor >= 0 &&
      valor <= 100,
    )
  const maiorChance = possibilidades.length > 0
    ? Math.max(...possibilidades)
    : null

  const ventoMaisForte = Math.max(
    clima.vento,
    ...proximasHoras.map((item) => item.vento),
  )
  const maiorCalor = Math.max(
    clima.temperatura,
    clima.sensacaoTermica,
    ...proximasHoras.map((item) => item.temperatura),
  )

  const chuvaAgora = mencionaChuva(clima.descricao)
  const intensidade = /chuva forte|tempestade|trovoada/i
  const tempestadeAgora = intensidade.test(clima.descricao)
  const tempestadePrevista = proximasHoras.some((item) =>
    intensidade.test(item.descricao),
  )
  const chuvaPrevista = proximasHoras.some((item) =>
    mencionaChuva(item.descricao),
  )

  if (tempestadeAgora) {
    return {
      simbolo: '⛈️',
      titulo: 'Atenção às condições neste momento',
      mensagem: `Em ${clima.cidade}, a condição informada agora é ${clima.descricao}. Se houver chuva intensa ou trovoadas, procure um local protegido, evite áreas alagadas e acompanhe os avisos oficiais antes de sair.`,
    }
  }

  if (tempestadePrevista) {
    return {
      simbolo: '⛈️',
      titulo: 'Acompanhe a possibilidade de tempestade',
      mensagem: `A previsão para ${clima.cidade} indica condições de tempestade ou trovoadas em algum momento das próximas 12 horas. Planeje seus deslocamentos e acompanhe os avisos oficiais. Se houver chuva intensa, evite áreas alagadas.`,
    }
  }

  if (chuvaAgora) {
    return {
      simbolo: '🌧️',
      titulo: 'Está chovendo na região consultada',
      mensagem: `A condição informada agora em ${clima.cidade} é ${clima.descricao}. Se for sair, leve proteção para a chuva e tenha cuidado com pisos escorregadios e pontos de alagamento.`,
    }
  }

  if (maiorChance !== null && maiorChance >= 70) {
    return {
      simbolo: '☔',
      titulo: 'Prepare-se para uma possível chuva',
      mensagem: `Em ${clima.cidade}, a probabilidade de precipitação chega a ${formatar(maiorChance, 0)}% em pelo menos um intervalo das próximas 12 horas. Isso não significa que vai chover durante todo o dia. Considere levar um guarda-chuva e confira a previsão antes de sair.`,
    }
  }

  if (chuvaPrevista) {
    return {
      simbolo: '☁️',
      titulo: 'Há indicação de chuva em alguns horários',
      mensagem: `A previsão para ${clima.cidade} menciona chuva em algum período das próximas 12 horas. Mesmo que a probabilidade informada seja baixa, vale levar proteção caso vá passar muito tempo ao ar livre.`,
    }
  }

  if (ventoMaisForte >= 10) {
    return {
      simbolo: '💨',
      titulo: 'Atenção ao vento',
      mensagem: `Em ${clima.cidade}, o vento informado chega a ${formatar(ventoMaisForte * 3.6, 0)} km/h agora ou nas próximas 12 horas. Cuidado com objetos soltos e com estruturas instáveis durante ventanias.`,
    }
  }

  if (maiorCalor >= 35) {
    return {
      simbolo: '☀️',
      titulo: 'Cuide-se durante o calor',
      mensagem: `Em ${clima.cidade}, a temperatura ou sensação térmica chega a ${formatar(maiorCalor, 0)} °C nos dados consultados. Beba água regularmente e procure evitar esforço intenso sob sol forte.`,
    }
  }

  if (!previsao || proximasHoras.length === 0) {
    return {
      simbolo: '🌤️',
      titulo: 'Confira o tempo antes de sair',
      mensagem: `Em ${clima.cidade}, a condição atual informada é ${clima.descricao}, com ${formatar(clima.temperatura)} °C. Não há previsão suficiente das próximas horas disponível para uma orientação mais específica.`,
    }
  }

  return {
    simbolo: '🌤️',
    titulo: 'Confira a previsão ao longo do dia',
    mensagem: `Em ${clima.cidade}, os dados disponíveis das próximas 12 horas não atingiram os critérios de atenção definidos pelo CitizenTech para chuva, vento ou calor. Isso não elimina a possibilidade de mudanças no tempo.`,
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

  async function pesquisarCidade(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const busca = cidade.trim()
    if (!busca) {
      setErro('Informe uma cidade ou CEP.')
      return
    }

    const pesquisaAtual = ++numeroPesquisa.current
    setCarregando(true)
    setCarregandoPrevisao(false)
    setErro('')
    setClima(null)
    setPrevisao(null)

    try {
      // Mesmo CEP ou cidade consultados na sessão: exibição imediata.
      const chaveBusca = `citizentech:v2:clima:${busca.toLowerCase()}`
      const cacheBusca = lerCache(chaveBusca)
      if (cacheBusca) {
        setClima(cacheBusca.clima)
        setPrevisao(cacheBusca.previsao)
        return
      }

      let cidadeParaConsultar = busca

      // Mantém a pesquisa por CEP com o ViaCEP.
      if (/^[\d-]+$/.test(busca)) {
        const cep = busca.replace(/\D/g, '')

        if (cep.length !== 8) {
          throw new Error('O CEP deve conter 8 números.')
        }

        const respostaCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

        if (!respostaCep.ok) {
          throw new Error('Não foi possível consultar o CEP.')
        }

        const endereco = (await respostaCep.json()) as {
          localidade?: string
          uf?: string
          erro?: boolean
        }

        if (endereco.erro || !endereco.localidade) {
          throw new Error('CEP não encontrado.')
        }

        cidadeParaConsultar = `${endereco.localidade},BR`
      }

      if (pesquisaAtual !== numeroPesquisa.current) return

      const chave = `citizentech:v2:clima:${cidadeParaConsultar.toLowerCase()}`
      const emCache = lerCache(chave)

      // Pesquisas repetidas aparecem imediatamente, sem novas chamadas à API.
      if (emCache) {
        setClima(emCache.clima)
        setPrevisao(emCache.previsao)
        return
      }

      const parametro = encodeURIComponent(cidadeParaConsultar)
      setCarregandoPrevisao(true)

      // As duas requisições ocorrem em paralelo. O clima atual aparece
      // assim que chegar, sem esperar a previsão de cinco dias.
      const tarefaClima = fetch(`${API_URL}/clima?cidade=${parametro}`)
        .then(async (resposta) => {
          if (!resposta.ok) throw new Error('Clima atual indisponível.')
          return (await resposta.json()) as Clima
        })
        .then((dados) => {
          if (pesquisaAtual === numeroPesquisa.current) {
            setClima(dados)
            setCarregando(false)
          }
          return dados
        })

      const tarefaPrevisao = fetch(`${API_URL}/clima/previsao?cidade=${parametro}`)
        .then(async (resposta) => {
          if (!resposta.ok) throw new Error('Previsão indisponível.')
          return (await resposta.json()) as DadosPrevisao
        })
        .then((dados) => {
          if (pesquisaAtual === numeroPesquisa.current) {
            setPrevisao(dados)
            setCarregandoPrevisao(false)
          }
          return dados
        })

      const [resultadoClima, resultadoPrevisao] = await Promise.allSettled([
        tarefaClima,
        tarefaPrevisao,
      ])

      if (pesquisaAtual !== numeroPesquisa.current) return

      if (resultadoClima.status === 'fulfilled' && resultadoPrevisao.status === 'fulfilled') {
        salvarCache(chave, resultadoClima.value, resultadoPrevisao.value)
        if (chaveBusca !== chave) {
          salvarCache(chaveBusca, resultadoClima.value, resultadoPrevisao.value)
        }
      } else if (resultadoClima.status === 'rejected' && resultadoPrevisao.status === 'rejected') {
        setErro('Não foi possível consultar o clima. Tente novamente em instantes.')
      } else if (resultadoClima.status === 'rejected') {
        setErro('O clima atual não carregou, mas a previsão está disponível.')
      } else {
        setErro('O clima atual carregou, mas a previsão de cinco dias está indisponível.')
      }
    } catch (error) {
      if (pesquisaAtual !== numeroPesquisa.current) return
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível realizar a pesquisa.',
      )
    } finally {
      if (pesquisaAtual === numeroPesquisa.current) {
        setCarregando(false)
        setCarregandoPrevisao(false)
      }
    }
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
                onChange={(evento) => setCidade(evento.target.value)}
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
                Um resumo por dia, com a condição próxima do meio-dia e a maior
                chance de precipitação entre os horários disponíveis.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {dias.map((dia) => {
                  const horario = horaLocal(
                    dia.horarioReferencia,
                    previsao.fusoHorarioSegundos,
                  )
                  return (
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
                      <p className={`mb-2 text-sm capitalize ${textoPrincipal}`}>
                        {dia.descricao}
                      </p>
                      <p className={`mb-3 text-xs ${textoSecundario}`}>
                        Condição prevista às {horario}
                      </p>
                      <p className={`text-sm ${textoSecundario}`}>
                        {dia.maiorProbabilidade === null
                          ? 'Chance de precipitação não informada'
                          : dia.maiorProbabilidade === 0 && dia.indicaChuva
                            ? 'Há chuva indicada em alguns horários; confira a previsão atualizada.'
                            : dia.maiorProbabilidade === 0
                              ? 'Sem precipitação indicada nos horários disponíveis'
                              : `Maior chance de precipitação: ${formatar(dia.maiorProbabilidade, 0)}% às ${horaLocal(dia.horarioMaiorProbabilidade!, previsao.fusoHorarioSegundos)}`}
                      </p>
                    </article>
                  )
                })}
              </div>

              <p className={`mt-6 text-center text-xs ${textoSecundario}`}>
                Fonte: OpenWeatherMap. Mínimas e máximas aproximadas a partir
                das previsões disponíveis a cada 3 horas. A maior chance de
                precipitação refere-se a um único intervalo, não à probabilidade
                de chuva do dia inteiro. Hoje pode ter menos horários disponíveis.
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
                Orientação informativa baseada nos dados do OpenWeatherMap e
                nos critérios do CitizenTech (chuva prevista ou chance a partir
                de 70% em algum intervalo, temperatura ou sensação térmica a
                partir de 35 °C, vento a partir de 36 km/h). Não é um alerta
                oficial e não garante
                ausência de riscos. Para avisos oficiais, consulte{' '}
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
        </div>
      </main>

      <footer className="w-full bg-[#231b54] px-10 py-6 text-white [@media(max-width:640px)]:px-4 [@media(max-width:640px)]:py-5 text-center text-[0.84rem]">
        <p className="m-0">
          &copy; Todos os direitos reservados — CitizenTech — 2026
        </p>
      </footer>
    </>
  )
}
