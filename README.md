Instruções para Configurar Ambiente Docker do site Limpeza Gabi.
==========================================

Sobre o projeto
O projeto consiste em um sistema de agendamento de serviços de limpeza, composto por um front end desenvolvido em HTML/CSS. A página inicial oferece informações sobre os serviços disponíveis, enquanto a página de contato contém um formulário para envio de pedidos de limpeza.

O front end está integrado com um servidor Node.js, cujo código em JavaScript realiza requisições POST para um endpoint de cadastro de clientes.

Para configurar o ambiente de desenvolvimento, foram utilizados três containers Docker: um para o servidor web NGINX, outro para o servidor Node.js e um terceiro para o banco de dados Postgres. Todo o ambiente pode ser montado utilizando o arquivo docker-compose.yml.

A estrutura do projeto é composta pelos seguintes arquivos:

background.jpg: Imagem de fundo utilizada no front end.
contato.html: Página de contato com o formulário de envio de pedido de limpeza.
docker-compose.yml: Arquivo de configuração do Docker Compose para montagem do ambiente.
Dockerfile: Arquivo de configuração para a construção da imagem Docker do servidor Node.js.
index.html: Página inicial de boas-vindas com informações sobre os serviços de limpeza.
init.sql: Script SQL para inicialização do banco de dados Postgres.
package.json: Arquivo de manifesto do Node.js com as dependências do projeto.
README.md: Documentação do projeto em formato Markdown.
server.js: Código do servidor Node.js que lida com as requisições e integração com o endpoint de cadastro de clientes.
styles.css: Arquivo de folha de estilo CSS para estilização do front end.

Este documento fornece instruções para configurar um ambiente Docker para o projeto "limpeza-gabi", incluindo a instalação do Rancher Desktop no Windows, o build da imagem, a execução do ambiente e o acesso aos serviços.

Instalando o Rancher Desktop no Windows
---------------------------------------

1.  Baixe o instalador do Rancher Desktop para Windows no [site oficial](https://rancherdesktop.io/).
2.  Execute o instalador e siga as instruções na tela para concluir a instalação.

Build da Imagem "limpeza-gabi"
------------------------------

1.  Certifique-se de ter o Docker instalado e em execução no seu sistema.
2.  Clone o repositório do projeto "limpeza-gabi" do GitHub.
3.  Navegue até o diretório raiz do projeto no terminal.
4.  Execute o seguinte comando para construir a imagem:

`docker build -t limpeza-gabi .`

Subindo o Ambiente "limpeza-gabi" e Banco de Dados com Docker Compose
---------------------------------------------------------------------

1.  Certifique-se de estar no diretório raiz do projeto "limpeza-gabi".
2.  Crie um arquivo chamado `docker-compose.yml` com o seguinte conteúdo:

Subindo o Ambiente
==========================================

1.  Execute o seguinte comando para iniciar os serviços:

`docker-compose up -d`

Parando o Ambiente "limpeza-gabi" e Banco de Dados com Docker Compose
---------------------------------------------------------------------

1.  Certifique-se de estar no diretório raiz do projeto "limpeza-gabi".
2.  Execute o seguinte comando para parar os serviços:

`docker-compose down`

Acessando o Site "limpeza-gabi"
-------------------------------

Para acessar o site "limpeza-gabi", abra o navegador da web e visite:

`http://localhost:8080` ou `http://127.0.0.1:8080` 

Acessando o Banco de Dados Postgres (Recomendavel usar um client SQL instalado no Windows)
-----------------------------------

Para acessar o banco de dados Postgres, utilize as seguintes credenciais:

-   Host: localhost
-   Banco: limpeza
-   Porta: 5432
-   Usuário: gabi
-   Senha: gabi
