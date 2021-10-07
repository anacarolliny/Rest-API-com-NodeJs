const express = require("express") // pegar o express
const app = express() // criando uma instancia do express para poder consumir o metodo GET,POST,PUT,PATCH
const rotaProdutos = require("./routes/produtos") //estou chamando a rota produtos
const rotaPedidos = require("./routes/pedidos")
const morgan = require("morgan") // ele mostra em ambiente de desenvolvimento o que acontece
const bodyParser = require("body-parser") // pegar o bodyparser das dependencias



app.use(morgan("dev")) // util no terminal, ele retorna o codigo de erro e a rota executada
app.use("/uploads", express.static("uploads")) // estou dizendo que minha rota uploads é publica
app.use(bodyParser.urlencoded({ extended: false })) // apenas dados simples vamos aceitar

app.use(bodyParser.json()) // recebe somente formato json

app.use((req, res, next) => {// aqui ele vai passar pelo código até chegar no next
    res.header("Access-Control-Allow-Origin", "*") // aqui estou dando permissão para qual servidor pode consumir minha api, nesse caso estou dizendo todas :*
    res.header(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization") // que tipo de cabeçalho vou aceitar, ex : JSON, XML etc
    // no header porque é no cabeçalho pro portocolo http
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")//quando for utilizar o front end esse metodo vai ser muito utilizado
        return res.status(200).send({})
    } // AQUI ELE DIZ QUE SE NO MOMENTO DO TOKEN PEDIR OPTIONS, TRABALHAMOS COM ESSES MÉTODOS
    next()
})

app.use("/produtos", rotaProdutos)//vai pegar nossa rota
app.use("/pedidos", rotaPedidos)//vai pegar nossa rota


//tratamento para quando ele nao encontrar nenhuma rota
app.use((req, res, next) => {
    const erro = new Error("Não encontrado")
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) => {//aqui ele nao retorna um erro estatico mas o que esta mesmo retornando
    res.status(error.status || 500) // retorna o erro, mas se nao for definido nenhum erro vai ser o 500
    return res.send({
        erro: error.message
    })
})

module.exports = app//aqui exportei o app