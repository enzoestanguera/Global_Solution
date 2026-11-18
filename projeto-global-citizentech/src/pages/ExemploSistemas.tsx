import menuJava from '../assets/img/menu-java.jpg'
import menuPython from '../assets/img/menu-python.jpg'

export default function ExemplosSistemas() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Exemplos de funcionamento de outros sistemas
      </h1>

      <img
        src={menuJava}
        alt="Menu do sistema do projeto desenvolvido em Java"
        className="mx-auto my-6 h-auto w-full max-w-sm rounded-lg shadow-md"
      />
      <p className="text-center leading-relaxed">
        Aqui temos o nosso sistema em Java em funcionamento. O intuito dele é mostrar ao usuário como
        o nosso projeto funciona de forma geral: a pessoa sairia desse menu sem dúvidas sobre o
        projeto.
      </p>

      <img
        src={menuPython}
        alt="Menu do sistema do projeto desenvolvido em Python"
        className="mx-auto my-6 h-auto w-full max-w-sm rounded-lg shadow-md"
      />
      <p className="text-center leading-relaxed">
        Assim como no menu em Java, aqui o intuito é o mesmo, porém em outra linguagem de
        programação.
      </p>
    </section>
  )
}