# CitizenTech — Global Solution FIAP 2026/2

**Turma:** 1TDSPF  
**Projeto:** CitizenTech — Informação e Orientação Climática

## Sobre o projeto

O CitizenTech é um projeto acadêmico desenvolvido para a Global Solution da FIAP.

Nossa proposta é apresentar a importância das informações meteorológicas para o cotidiano das pessoas, especialmente no planejamento de deslocamentos e na prevenção de situações relacionadas a chuvas intensas, enchentes e outros eventos climáticos.

O projeto aborda o uso de informações meteorológicas e dados de satélites como possibilidades para melhorar a orientação dos cidadãos.

Nesta versão, o site apresenta a proposta do projeto, informações sobre a solução, integrantes, perguntas frequentes e um formulário de contato.

**Importante:** a aplicação ainda não realiza previsões meteorológicas em tempo real nem consulta automaticamente dados de satélites.

## Tecnologias utilizadas

**Front-end:**
- React
- TypeScript
- Vite
- Tailwind CSS
- HTML

**API Java:**
- Java 21
- Spring Boot
- JDBC
- Oracle Database
- Docker
- Render

## Estrutura do projeto

- `src/assets`: imagens e recursos visuais.
- `src/components`: componentes reutilizáveis, como o cabeçalho.
- `src/pages`: páginas do site.
- `src/services`: funções de comunicação com a API.

O site possui as páginas Home, Sobre, Integrantes, FAQ e Contato.

## Integração com a API Java

O front-end CitizenTech utiliza a API Java **ClimaCidadão**, desenvolvida separadamente com Spring Boot e banco de dados Oracle.

**URL da API:**  
https://climacidadao-java.onrender.com

**Repositório do Java:**  
https://github.com/arthurarrudaa/climacidadao-java

O formulário da página Contato realiza uma requisição HTTP `POST /contatos`, enviando nome, e-mail e mensagem para armazenamento no banco Oracle.

A API Java também possui recursos de usuários, cidades favoritas e pesquisas climáticas. Esses recursos existem no back-end, mas não possuem interfaces de uso implementadas nas páginas atuais do site.

O formulário de comentários da página FAQ é demonstrativo e não envia informações à API.

## Como executar o front-end

1. Abra o projeto no Visual Studio Code.
2. Acesse a pasta `projeto-global-citizentech`.
3. Abra o terminal e execute:

```bash
npm install
npm run dev
```

4. Acesse o endereço local indicado pelo Vite, normalmente:

`http://localhost:5173`

Para verificar a compilação de produção:

```bash
npm run build
```

## Configuração da API

O projeto utiliza a variável de ambiente `VITE_API_URL`, com o endereço-base da API Java.

Exemplo:

```env
VITE_API_URL=https://climacidadao-java.onrender.com
```

A configuração pode ser consultada no arquivo `.env.example`.

Caso a variável não esteja definida, o formulário utiliza o endereço público da API Java configurado no código.

## Repositório GitHub

**Repositório oficial do front-end:**  
https://github.com/enzoestanguera/Global_Solution

## Integrantes

**Álvaro Morais Holanda — RM 568607**  
GitHub: https://github.com/AlvaroHolanda

**Arthur Arruda da Silva — RM 569593**  
GitHub: https://github.com/arthurarrudaa

**Dhiego Gozzo Belmonte — RM 571505**  
GitHub: https://github.com/dhiegobelmonte

**Giovane Dias Chicoli — RM 569750**  
GitHub: https://github.com/Giovvane

**Enzo Torres Estanguera — RM 568937**  
GitHub: https://github.com/enzoestanguera

**Turma:** 1TDSPF

## Utilização de inteligência artificial

O ChatGPT foi utilizado como ferramenta de apoio para desenvolvimento, revisão de código, integração da API e documentação. O grupo é responsável por compreender, testar e apresentar a implementação.