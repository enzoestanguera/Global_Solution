import transito from '../assets/img/transito.jpg'
import neve from '../assets/img/cidade_neve.jpg'

export default function Sobre() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Propósito do Projeto</h1>

      <p className="text-justify leading-relaxed">
        Vendo que todas as pessoas seriam beneficiadas pelo nosso projeto, imaginamos que ele é bem
        útil para todos, mais para uns do que para outros, porém muito importante, desde
        trabalhadores de cidades grandes até agricultores de cidades do interior.
      </p>

      <img
        src={transito}
        alt="Trânsito intenso na cidade de São Paulo durante a chuva"
        className="mx-auto my-6 h-auto w-full max-w-lg rounded-lg shadow-md"
      />

      <p className="text-justify leading-relaxed">
        A imagem acima mostra um trânsito muito denso na cidade de São Paulo, o que não é uma coisa
        que ninguém quer passar. Se o trânsito já é ruim, imagine com uma chuva intensa e risco de
        enchente. Nosso projeto poderia diminuir a ocorrência de situações como essa.
      </p>

      <img
        src={neve}
        alt="Rua de uma cidade coberta de neve"
        className="mx-auto my-6 h-auto w-full max-w-lg rounded-lg shadow-md"
      />

      <p className="text-justify leading-relaxed">
        Novamente, na imagem temos uma situação muito desagradável: imagine sair de casa em um dia e
        se deparar com essa quantidade de neve por todo lado? Diversos acidentes são causados por
        neve no mundo todo, causando até mesmo mortes. Com a previsão mais exata, poderíamos alertar
        os cidadãos dias antes de nevar, para que todos pudessem se preparar.
      </p>
    </section>
  )
}