const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Debt = require('../../entities/debt')
const DebtRepository = require('../../../infra/data/repositories/debtRepository')

const dependency = { DebtRepository }

const deleteDebt = injection =>
  usecase('Delete Debt', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: Boolean,

    //Authorization with Audit
    // authorize: (user) => (user.canDeleteDebt ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the Debt exist': step(async ctx => {
      const repo = new ctx.di.DebtRepository(injection)
      const [debt] = await repo.findByID(ctx.req.id)
      ctx.debt = debt

      if (debt) return Ok()
      return Err.notFound({
          message: `Debt ID ${ctx.req.id} does not exist`,
          payload: { entity: 'Debt' }
      })
    }),

    'Delete the Debt': step(async ctx => {
      const repo = new ctx.di.DebtRepository(injection)
      ctx.ret = await repo.delete(ctx.debt)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret)
    })
  })

module.exports =
  herbarium.usecases
    .add(deleteDebt, 'DeleteDebt')
    .metadata({ group: 'Debt', operation: herbarium.crud.delete, entity: Debt })
    .usecase