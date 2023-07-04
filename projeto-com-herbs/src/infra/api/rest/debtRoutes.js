const controller = require('./controller')
const csvController = require('./csvController')

const debtRoutes = (herbarium) => (
    [{
        name: 'ImportDebts',
        post: {
            usecase: herbarium.usecases.get('ImportDebts').usecase,
            controller: csvController
        }
    },
    {
        name: 'EmitDebt',
        getAll: {
            usecase: herbarium.usecases.get('EmitDebt').usecase,
            controller
        }
    }])


module.exports = debtRoutes