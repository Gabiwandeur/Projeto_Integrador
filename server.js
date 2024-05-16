const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Habilita o CORS para todas as rotas permitindo acesso de qualquer origem
app.use(cors());

// Configuração do pool de conexão com o banco de dados
const pool = new Pool({
  user: 'gabi',
  host: 'db', // Usando o nome do serviço do contêiner do banco de dados
  database: 'limpeza',
  password: 'gabi',
  port: 5432,
});

function EnviaEmail(destinarario, assunto, corpo) {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wandeur12@gmail.com',
      pass: 'wmoo taqc lhud rxyp'
    }
  });

  var mailOptions = {
    from: 'wandeur12@gmail.com',
    to: destinarario,
    subject: assunto,
    html: corpo
  };

  transporter.sendMail(mailOptions, function (error, info) {

    if (error)
      console.log(error);
    else
      console.log('Email sent: ' + info.response);

  });

}

// Middleware para analisar o corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Adiciona suporte para JSON

//Schedule para enviar emails que roda de minuto em minuto
//https://crontab.guru/#*_*_*_*_*
cron.schedule('* * * * *', () => {

  console.log('Verificando disparos de emails pendentes');

  pool.query('SELECT * FROM CLIENTES WHERE ENVIADO_CONFIRMACAO=false OR ENVIADO_LEMBRETE=false OR ENVIADO_COMPROVANTE=false').then((result) => {

    //Caso não tenha qualquer email pendente nesse momento a rotina se encerra
    if (!result.rowCount)
      return;

    //Cada tipo de envio pendente é filtrado da consulta original
    let pendentesConfirmacao = result.rows.filter((registro) => !registro.enviado_confirmacao);
    let pendentesLembrete = result.rows.filter((registro) => !registro.enviado_lembrete);
    let pendentesComprovante = result.rows.filter((registro) => !registro.enviado_comprovante);

    //Rotina para envio de confirmações
    pendentesConfirmacao.forEach((registro) => {

      let corpoEmail = `
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f9e3eb; /* Fundo rosa claro */
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              span {
                  color: #666;
              }
              img {
                  max-width: 100%;
                  height: auto;
                  display: block;
                  margin: 20px auto;
              }
          </style>
      </head>
      <body>
         <div class="container">
            <h1>Confirmaçao para ${registro.nome}</h1>
            <span>${registro.nome} O agendamento da sua limpeza está confirmado para ${registro.datas}</span>
            <br /><br />
            <h2>Rua: ${registro.rua}</h2>
            <h2>Cidade: ${registro.cidade}</h2>
            <h2>Estado: ${registro.estado}</h2>
            <br />
         </div>
      </body>
      </html>
  `;

      EnviaEmail(registro.email, "LimaDiniz Confirmação de agendamento", corpoEmail);
      const query = 'UPDATE CLIENTES SET ENVIADO_CONFIRMACAO=true WHERE ID=' + registro.id;
      console.log(query);

      // Executar a query SQL
      pool.query(query, (error) => {

        if (error)
          console.error('Erro ao atualizar registro:', error);
        else
          console.log('Sucesso ao atualizar registro');

      });

    });

    //Rotina para envio de lembretes
    pendentesLembrete.forEach((registro) => {

      //Verifica se a data do agendamento está menos de 24 de ser concluida
      let pendenteLembrete = (Date.now() - (24 * 3600000)) < (Date.parse(registro.datas));

      if(!pendenteLembrete)
        return;

        let corpoEmail = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9e3eb; /* Fundo rosa claro */
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                span {
                    color: #666;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 20px auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Lembrete para ${registro.nome}</h1>
                <span>${registro.nome} O agendamento da sua limpeza está marcado para ${registro.datas}</span>
                <br /><br />
                <h2>Rua: ${registro.rua}</h2>
                <h2>Cidade: ${registro.cidade}</h2>
                <h2>Estado: ${registro.estado}</h2>
                <br />
            </div>
        </body>
        </html>
    `;

      EnviaEmail(registro.email, "LimaDiniz Lembrete de agendamento", corpoEmail);
      const query = 'UPDATE CLIENTES SET ENVIADO_LEMBRETE=true WHERE ID=' + registro.id;
      console.log(query);

      pool.query(query, (error) => {

        if (error)
          console.error('Erro ao atualizar registro:', error);
        else
          console.log('Sucesso ao atualizar registro');

      });

    });

    //Rotina para envio de comprovantes
    pendentesComprovante.forEach((registro) => {

      let pendenteComprovante =  (Date.parse(registro.datas) < Date.now());

      if(!pendenteComprovante)
        return;

        let corpoEmail = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9e3eb; /* Fundo rosa claro */
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                span {
                    color: #666;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 20px auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Comprovante para ${registro.nome}</h1>
                <span>${registro.nome} O seu agendamento foi concluído </span>
                <br /><br />
                <h2>Rua: ${registro.rua}</h2>
                <h2>Cidade: ${registro.cidade}</h2>
                <h2>Estado: ${registro.estado}</h2>
                <br />
            </div>
        </body>
        </html>
    `;

      EnviaEmail(registro.email, "LimaDiniz Comprovante de agendamento", corpoEmail);
      const query = 'UPDATE CLIENTES SET ENVIADO_COMPROVANTE=true WHERE ID=' + registro.id;
      console.log(query);

      pool.query(query, (error) => {

        if (error)
          console.error('Erro ao atualizar registro:', error);
        else
          console.log('Sucesso ao atualizar registro');

      });

    });

  });

});

// Rota para lidar com o envio do formulário de contato
app.post('/submit-form', (req, res) => {
  // Extrai os dados do corpo da requisição
  const { nome, email, telefone, rua, cep, cidade, datas, estado } = req.body;

  // Verifica se os dados foram recebidos corretamente
  if (!nome || !email || !telefone) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos do formulário.' });
  }

  // Query SQL para inserir os dados no banco de dados
  const query = 'INSERT INTO clientes (nome, email, telefone, rua, cep, cidade, datas, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

  // Valores a serem inseridos
  const values = [nome, email, telefone, rua, cep, cidade, datas, estado];

  // Executar a query SQL
  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Erro ao inserir dados no banco de dados:', error);
      res.status(500).json({ error: 'Erro ao enviar o formulário. Por favor, tente novamente mais tarde.' });
    } else {
      console.log('Dados inseridos com sucesso no banco de dados.');
      console.log('Dados recebidos:', { nome, email, telefone, rua, cep, cidade, datas, estado });
      res.json({ success: 'Obrigado por enviar o formulário!' });
    }
  });
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
