const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');

// const IncidentsController = require('./controllers/IncidentsController');
// const ProfileController = require('./controllers/ProfileController');
// const SessionController = require('./controllers/SessionController')

/**
 * ROTAS / RECURSOS
 */

/**
  * Tipos de parâmetros:
  * 
  * Query Params: Parâmetros nomeados enviados na rota após o  "?" 
  * ex.: routes.get => const params = req.query;
  * 
  * Route Params: Parâmetros uti9lizados para identificar recursos
  * ex.: routes.get => const params = req.params;
  * 
  * Request Body: Corpo da requisição, utilizado para criar ou alterar recursos
  * ex.: routes.post => const body = req.body;
  */

//  routes.post('/sessions', SessionController.create)

routes.get('/users', UserController.index);
routes.post('/users', UserController.sign);
routes.post('/user/new', UserController.create);
routes.delete('/user/:id', UserController.delete);
routes.put('/user/:id', UserController.update);

 /* routes.post('/ongs', OngController.create);
 
 routes.get('/profile', ProfileController.index);

 routes.get('/incidents', IncidentsController.index);
 routes.post('/incidents', IncidentsController.create);
 routes.delete('/incidents/:id', IncidentsController.delete); */

module.exports = routes;