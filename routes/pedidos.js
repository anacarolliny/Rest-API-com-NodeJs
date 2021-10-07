const express = require("express")
const router = express.Router()//aqui declarando que é uma rota do express
const mysql = require("../mysql").pool

// RETORNA TODOS OS PRODUTOS
router.get("/", (req, res, next) => { //retorna todos os pedidos
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } // retorna um erro se nao conseguir acessar a conexão
        conn.query( // "SELECT * FROM pedidos", essa query só retorna parametros não muito interessantes, vou mudar para uma consulta entre tabelas
            `SELECT pedidos.id_pedido,
                pedidos.quantidade,
                produtos.id_produto,
                produtos.nome,
                produtos.preco
                FROM pedidos
                INNER JOIN produtos
                ON produtos.id_produto = pedidos.id_produto;`,
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = { // Aqui posso documentar meu método Get melhor, boas praticas
                    pedidos: result.map(pedido => { // no array e produtos, cada item dele vou modificar o valor, vai ter esse padrão
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },


                            request: { //
                                tipo: "GET",
                                descricao: "Retorna os detalhe de um pedido específico",//documentação dos meus métodos
                                url: "http://localhost:3000/pedidos/" + pedido.id_pedido // link para se clicar na API vai redirecionar para o GET individual do produto
                            }
                        }
                    })
                }
                return res.status(200).send(response) // executando essa query, ela vai ser retornar minha const response
            }
        )
    })

})


// INSERE UM PEDIDO
router.post("/", (req, res, next) => {
    mysql.getConnection((error, conn) => { // conexão com o banco

        if (error) { return res.status(500).send({ error: error }) }// executando duas queries no mesmo metodo

        conn.query("SELECT * FROM  produtos WHERE id_produto = ?; ", // primeiro verifico se tem o produto
            [req.body.id_produto],
            (error, result, field) => {

                if (error) { return res.status(500).send({ error: error }) }
                if (result.length == 0) { // tratamento de erro de nao encontrar um produto que eu quero inserir
                    return res.status(404).send({
                        mensagem: "Produto não foi encontrado"
                    })
                }
                conn.query( // se ele tenha o produto ele nao vai entrar no if
                    "INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)", // detalhe do banco, ele só deixa criar um pedido se tiver um produto
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, field) => {
                        conn.release()//muito importante porque quando ele entrar na callback tem que liberar a query
                        if (error) { return res.status(500).send({ error: error }) } // retorna um erro se nao conseguir executar a query


                        const response = {
                            mensagem: "Pedido inserido com sucesso",
                            pedidoCriado: {
                                id_pedido: result.id_pedido,
                                id_produto: req.body.id_produto,//REFERENCES `produtos` (`id_produto`)
                                quantidade: req.body.quantidade,

                                request: {
                                    tipo: "GET",
                                    descricao: "Retorna todos os pedidos",
                                    url: "http:localhost:3000/pedidos"
                                }
                            }
                        }
                        return res.status(201).send(response)
                    }
                )
            })

    })

})


// RETORNA OS DADOS DE UM PRODUTO
router.get("/:id_pedido", (req, res, next) => { // entra em detalhes de um unico pedido
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } // aqui é o callback da conexão
        conn.query(
            "SELECT * FROM  pedidos WHERE id_pedido = ?; ",
            [req.params.id_pedido],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }//aqui é o callback da query

                if (result.length == 0) { // tratamento de erro
                    return res.status(404).send({
                        mensagem: "Não foi encontrado pedido com esse ID"
                    })
                }
                const response = { // Aqui posso documentar meu método Get melhor, boas praticas
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: { //
                            tipo: "GET",
                            descricao: "Retorna um pedido específico",//documentação dos meus métodos
                            url: "http://localhost:3000/pedidos/"  // link para se clicar na API vai redirecionar para o GET individual do produto
                        }
                    }

                }
                return res.status(200).send(response) // executando essa query, ela vai ser retornar minha const response
            }

        )
    })

})

//DELETA UM PEDIDO
router.delete("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( //  a query já é um callback em si
            "DELETE FROM pedidos WHERE id_pedido = ?", [req.body.id_pedido],
            (error, resultado, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: "Pedido removido com sucesso",
                    request: {
                        tipo: "POST",
                        descricao: "Insere um pedido novo",
                        url: "http://localhost:3000/pedidos",
                        body: {
                            id_produto: "Number",
                            quantidade: "Number"
                        }
                    }
                }
                res.status(202).send(response)
            }
        )
    })

})
module.exports = router // exporta produtos com esses verbos, o POST e GET