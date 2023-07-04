const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Debt = require('../../entities/debt')
const DebtRepository = require('../../../infra/data/repositories/debtRepository')

const dependency = { DebtRepository }

const findDebt = injection =>
  usecase('Find a Debt', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: Debt,

    //Authorization with Audit
    // authorize: (user) => (user.canFindOneDebt ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return the Debt': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.DebtRepository(injection)
      const [debt] = await repo.findByID(id)
      if (!debt) return Err.notFound({ 
        message: `Debt entity not found by ID: ${id}`,
        payload: { entity: 'Debt', id }
      })
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = debt)
    })
  })

module.exports =
  herbarium.usecases
    .add(findDebt, 'FindDebt')
    .metadata({ group: 'Debt', operation: herbarium.crud.read, entity: Debt })
    .usecase