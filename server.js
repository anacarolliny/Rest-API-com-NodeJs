const http = require("http")//estamos importando para nosso projeto o http
const app = require("./app")// aqui importei o app com todas as funções
const port = process.env.PORT || 3000 // criando uma variavel para armazenar a porta do nosso serviço se não estiver preenchida vai usar a 3000
const server = http.createServer(app)// criar o servidor - depois de criado ele vai ouvir no servidor esse app criado
//nesse caso vai ser localhost:/3000
server.listen(port) // o servidor vai escutar a porta

