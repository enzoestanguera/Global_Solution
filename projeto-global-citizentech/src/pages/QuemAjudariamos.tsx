import plantacoes from '../assets/img/plantacoes.png'

export default function QuemAjudariamos() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Quem ajudaríamos?</h1>

      <div className="space-y-4 text-justify leading-relaxed">
        <p>
          Indo mais a fundo no propósito do nosso projeto, queremos utilizar o espaço como mais um
          meio de prever o clima de áreas do planeta, proporcionando diversas vantagens para todas as
          pessoas.
        </p>
        <p>
          Com o nosso projeto funcionando como imaginamos, ajudaríamos todo tipo de pessoa na Terra,
          principalmente aquelas que dependem muito de como o clima estará em determinado dia ou
          horário.
        </p>
      </div>

      <img
        src={plantacoes}
        alt="Plantação que depende das condições do clima"
        className="mx-auto my-6 h-auto w-full max-w-lg rounded-lg shadow-md"
      />

      <p className="text-justify leading-relaxed">
        Um bom exemplo são os agricultores: certas plantas dependem muito de como estará o clima em
        determinado momento. Com os satélites aprimorados, a margem de erro seria muito menor, o que
        diminuiria a perda de safra do agricultor.
      </p>
    </section>
  )
}