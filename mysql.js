const mysql = require("mysql")


// var pool = mysql.createPool({ dessa maneira o código fica com falhas de segurança
//     "user" : "root",
//     "password":"Gr@zi@N1",
//     "database":"ecommerce",
//     "host":"localhost",
//     "port":3306
// }) //pesquisar sobre

var pool = mysql.createPool({
    "user" : process.env.MYSQL_USER,
     "password":process.env.MYSQL_PASSWORD,
     "database":process.env.MYSQL_DATABASE,
     "host":process.env.MYSQL_HOST,
     "port":process.env.MYSQL_PORT
})

exports.pool = pool


//nao precisa ficar usando as variaveis na maquina local, no ambient dev, basta usar o recurso do nodemon.json
//arquivo de configuração para o nodemon aqui vamos colocar nossa variavel de ambiente, o proprio nomen ai deficir essas variaveis de ambiente e o mysql vai pegar o valor que a gente definio no mysql