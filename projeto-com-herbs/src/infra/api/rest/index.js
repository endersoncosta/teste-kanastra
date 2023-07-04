const express = require('express')
const cors = require('cors')
const { raw, json } = require('body-parser')
const { generateRoutes, generateControllers } = require('@herbsjs/herbs2rest')
const { herbarium } = require('@herbsjs/herbarium')
const controller = require('./controller')
const debtRoutes = require('./debtRoutes')

async function rest(app, config) {

    // Request security
    app.use(json({ limit: '50mb', strict: false }));
    app.use(raw({ limit: '50mb', type: ['text/*'] }));

    const routes = new express.Router()

    herbs2rest({ routes, config })

    app.use(routes)
}

function herbs2rest({ routes, config }) {

    // Herbs to REST will populate the Express routes and controllers 
    // based on your entities and use cases.

    // 1. Prepare Routes and Controllers
    // Firts, it will pre-generate all routes for your use cases 
    // using the default controller implementation. 
    // Later, you will have the opportunity to customize it.
    const controllers = generateControllers({ herbarium, controller })

    // 2. Add Custom Route and Controller
    // controllers.push({
    //     name: 'Search',
    //     post: {
    //         usecase: herbarium.usecases.get('SearchUsers').usecase,
    //         controller: searchController
    //     }
    // })

    const customRoutes = debtRoutes(herbarium)
    customRoutes.forEach(route => controllers.push(route))

    // 3. Or Edit Default Controllers 
    // const userControllers = controllers.find((ctrl) => ctrl.name === 'User')
    // userControllers.delete.controller = async (uc, req, user, res, next) => res.status(200).end()

    // 4. Apply Routes and Controllers to Express
    const showEndpoints = !config.isProd
    generateRoutes(controllers, routes, showEndpoints)

}

module.exports = { rest }