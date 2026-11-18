import menuPython from '../assets/img/menu_python.jpg'
import NavegacaoPaginas from '../components/NavegacaoPaginas'

export default function ExemplosSistemas() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Exemplos de funcionamento de outros sistemas
      </h1>

      <p className="text-center leading-relaxed">
        O nosso menu Java, é a página da API (desenvolvida em Java) que é responsável por receber as requisições do site. 
        Por isso não temos nenhuma imagem, se quiser ver como ele funciona, visite a página Painel Climático.
        Abaixo, você pode ver um exemplo de como seria o menu de outro sistema desenvolvido em Python.
      </p>

      <img
        src={menuPython}
        alt="Menu do sistema do projeto desenvolvido em Python"
        className="mx-auto my-6 w-[500px] h-[300px] object-cover rounded-lg shadow-md"
      />

      <NavegacaoPaginas />
    </section>
  )
}