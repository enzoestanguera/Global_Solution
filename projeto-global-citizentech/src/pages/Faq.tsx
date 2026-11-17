
import { useState } from 'react'

type PerguntaFaq = {
  pergunta: string
  resposta: string
}

const textoResposta = 'm-0 px-4 pb-4 leading-[1.55] text-[var(--color-muted)]'

const perguntas: PerguntaFaq[] = [
  {
    pergunta: 'O que é o CitizenTech?',
    resposta:
      'O CitizenTech é um projeto acadêmico voltado à informação e à orientação climática. Sua proposta é ajudar os cidadãos a compreender melhor as condições meteorológicas e os riscos associados a eventos climáticos.'
  },
  {
    pergunta: 'Qual é o objetivo do projeto?',
    resposta:
      'O objetivo é apresentar uma proposta de melhoria no acesso às informações meteorológicas, buscando contribuir para o planejamento de atividades e deslocamentos em situações de risco climático.'
  },
  {
    pergunta: 'Por que o projeto aborda previsões do tempo?',
    resposta:
      'As condições climáticas podem afetar deslocamentos, compromissos e a segurança das pessoas. O projeto discute como informações meteorológicas mais claras podem ajudar na tomada de decisões.'
  },
  {
    pergunta: 'Qual é a relação do projeto com os satélites?',
    resposta:
      'Satélites meteorológicos são importantes fontes de informações sobre a atmosfera. O CitizenTech apresenta a proposta de utilizar dados espaciais para apoiar melhorias na análise das condições climáticas.'
  },
  {
    pergunta: 'Quem pode se beneficiar do CitizenTech?',
    resposta:
      'A proposta é voltada a cidadãos que desejam compreender melhor os riscos climáticos, especialmente pessoas que precisam planejar deslocamentos e atividades ao ar livre.'
  },
  {
    pergunta: 'Quais problemas o CitizenTech busca abordar?',
    resposta:
      'O projeto aborda os impactos das condições climáticas no cotidiano, incluindo chuvas intensas, enchentes, mudanças repentinas do tempo e dificuldades no planejamento de deslocamentos.'
  },
  {
    pergunta: 'Como a tecnologia participa da solução?',
    resposta:
      'O projeto utiliza um site desenvolvido em React e uma API Java com Spring Boot, JDBC e banco de dados Oracle. A API permite armazenar usuários, cidades favoritas, históricos de pesquisas e mensagens de contato.'
  },
  {
    pergunta: 'O CitizenTech já fornece previsões em tempo real?',
    resposta:
      'Não nesta versão. O site apresenta a proposta do projeto, enquanto a API Java realiza o armazenamento de dados. A consulta automática a serviços meteorológicos externos ainda não foi implementada.'
  },
  {
    pergunta: 'Como posso entrar em contato com a equipe?',
    resposta:
      'A página Contato possui um formulário com nome, e-mail e mensagem. Ao enviar os dados, o site utiliza a API Java para registrar a mensagem no banco de dados Oracle.'
  }
]

const msgDiscreta = 'mt-[5px] rounded-lg p-2 text-center text-[0.82rem] font-semibold'

function Faq() {
  const [abertas, setAbertas] = useState<Set<number>>(new Set())
  const [comentario, setComentario] = useState('')
  const [status, setStatus] = useState<'idle' | 'sucesso' | 'erro'>('idle')

  function alternarPergunta(index: number) {
    setAbertas((atual) => {
      const novo = new Set(atual)

      if (novo.has(index)) {
        novo.delete(index)
      } else {
        novo.add(index)
      }

      return novo
    })
  }

  function enviarComentario() {
    if (comentario.trim() !== '') {
      setStatus('sucesso')
      setComentario('')
    } else {
      setStatus('erro')
    }

    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <>
      <main>
        {/* .faq-hero */}
        <section className="mx-auto max-w-[var(--container-max)] px-6 pt-12 pb-6 text-left max-[480px]:pt-8">
          <span className="mb-2 block text-[0.84rem] font-semibold text-[var(--color-leaf)]">
            Dúvidas comuns
          </span>

          <h1>Perguntas frequentes</h1>

          <p className="m-0 max-w-[66ch] text-[var(--color-muted)]">
            Reunimos aqui respostas para dúvidas frequentes sobre o projeto CitizenTech.
          </p>
        </section>

        {/* .faq-container */}
        <section className="mx-auto max-w-[760px] px-6 pt-4 pb-6">
          {perguntas.map((item, index) => {
            const aberta = abertas.has(index)

            return (
              <div
                key={item.pergunta}
                className="mb-4 overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)]"
              >
                <button
                  type="button"
                  aria-expanded={aberta}
                  onClick={() => alternarPergunta(index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent p-4 text-left font-[family-name:var(--font-body)] text-[0.98rem] font-semibold text-[var(--color-indigo-dark)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-azure)]"
                >
                  {item.pergunta}

                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-[0.8rem] text-[var(--color-azure)] transition-transform duration-200 ease-in-out ${
                      aberta ? 'rotate-90' : ''
                    }`}
                  >
                    ❯
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-[max-height] duration-[250ms] ease-in-out ${
                    aberta ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <p className={textoResposta}>{item.resposta}</p>
                </div>
              </div>
            )
          })}
        </section>

        {/* .comentario-area */}
        <section className="mx-auto max-w-[760px] px-6 pt-4 pb-8 max-[480px]:px-4">
          {/* .caixa-flutuante */}
          <div className="flex w-full flex-col gap-2 rounded-2xl border-t-4 border-t-[var(--color-azure)] bg-[var(--color-surface)] p-6 shadow-md">
            <h3 className="m-0 text-[1.05rem] text-[var(--color-indigo)]">
              Deixe seu comentário
            </h3>

            <textarea
              id="texto-usuario"
              placeholder="Digite algo aqui..."
              aria-label="Seu comentário"
              value={comentario}
              onChange={(evento) => setComentario(evento.target.value)}
              className="min-h-[105px] w-full resize-y rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-[10px] font-[family-name:var(--font-body)] text-[0.9rem]"
            />

            <button
              id="btn-enviar-caixa"
              type="button"
              onClick={enviarComentario}
              className="cursor-pointer rounded-lg border-none bg-[var(--color-azure)] p-[10px] font-[family-name:var(--font-body)] font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-[var(--color-indigo)]"
            >
              Enviar comentário
            </button>

            {status === 'sucesso' && (
              <div
                id="caixa-sucesso"
                role="status"
                className={`${msgDiscreta} border border-[#c3e6cb] bg-[var(--color-leaf-light)] text-[#155724]`}
              >
                Este formulário é demonstrativo. O comentário não foi enviado à API.
              </div>
            )}

            {status === 'erro' && (
              <div
                id="caixa-erro"
                role="alert"
                className={`${msgDiscreta} border border-[#f5c6cb] bg-[#f8d7da] text-[#721c24]`}
              >
                Por favor, digite uma mensagem.
              </div>
            )}
          </div>
        </section>
      </main>

      
    </>
  )
}

export default Faq
