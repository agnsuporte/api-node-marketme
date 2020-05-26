require('dotenv/config');

const cors = require('cors');
const express = require("express");
const { errors } = require('celebrate');
const userRoutes = require("./routes/user-routes");


const app  = express();
const port = process.env.PORT || process.env.APP_PORT_SERVER

app.use(cors());

/**
 * Necessário para trabalhar com
 * requisições json
 */
app.use(express.json());


/**
 * ROTAS
 */
app.use(userRoutes);

app.use(errors());

app.listen(port, () => {
    console.log('Servidor executando na porta:', port)
});
