# Use a imagem do Nginx como base
FROM nginx:alpine

# Instale o Node.js e o npm
RUN apk add --no-cache nodejs npm

# COPIA DOS ARQUIVOS PARA O CONTAINER
COPY index.html /usr/share/nginx/html
COPY contato.html /usr/share/nginx/html
COPY styles.css /usr/share/nginx/html
COPY background.jpg /usr/share/nginx/html

# EXPOSE PORTA WEB
EXPOSE 80 

# Instale as dependências do servidor Node.js, incluindo o pacote 'cors'
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install cors body-parser
RUN npm install nodemailer
RUN npm install node-cron

# Copie o código do servidor Node.js
COPY . .

# Exponha a porta do servidor Node.js (não é necessário se você planeja acessar o servidor apenas internamente)
EXPOSE 3000

# Inicie tanto o Nginx quanto o servidor Node.js usando um script de inicialização
CMD ["sh", "-c", "nginx && node server.js"]
