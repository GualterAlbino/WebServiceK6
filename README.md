# Teste de Carga/Stress a API do WebService utilizando K6.io

<h1 align="center">
  Utilização do K6.io para executar rotina/fluxos mais utilizados pelos usuários. Lembrando que o K6.io é uma ferramenta de código aberto que permite a execução de testes de carga e stress em aplicações web que nada tem a ver com Node.js, mas sim com Go. Porém, os testes são escritos em JavaScript.
  Mais em: https://k6.io/docs/ 
</h1>

<p align="center">
  <a href="https://www.linkedin.com/in/gualter/">
    <img alt="Feito por: " src="https://img.shields.io/badge/Feito%20por%3A%20-Gualter%20Albino-%231158c7">
  </a>
  <a href="https://github.com/GualterAlbino/Vue/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/GualterAlbino/Vue">
  </a>
</p>

## :dart: Instruções

1 - Realizar a instalação do K6.io, conforme a documentação: https://k6.io/docs/get-started/installation/

2 - Acessar o arquivo `Constantes.js` e alterar o valor das variaveis `HOST`, `USUARIOS_VIRTUAIS` e `QTD_USUARIOS_VIRTUAIS` conforme a necessidade.
Obs: Atentar ao fato de que o token do usuário não está sendo preenchido dinamicamente. Essa etapa deve ser realizada manualmente para cada usuário realizando a autenticação no postman e copiando o token gerado.

3 - Executar o comando: `k6 run --insecure-skip-tls-verify main.js` para iniciar os testes.
Obs: O parâmetro `--insecure-skip-tls-verify` é utilizado para ignorar a verificação de certificado SSL.
Obs: O arquivo `main.js` contém o fluxo padrão, podendo ser alterado conforme a necessidade.

## :rocket: Tecnologias

As seguintes tecnologias foram utilizadas no projeto:

- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [K6.io](https://k6.io/)

## :white_check_mark: Outros

- O projeto foi desenvolvido com o intuito de realizar testes de carga e stress na API do WebService.
- Esse é um protótipo utilizado para testar a ferramenta e verificar a viabilidade de utilização em projetos futuros.
