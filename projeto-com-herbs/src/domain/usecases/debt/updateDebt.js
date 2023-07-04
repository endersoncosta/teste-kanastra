const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const Debt = require('../../entities/debt')
const DebtRepository = require('../../../infra/data/repositories/debtRepository')

const dependency = { DebtRepository }

const updateDebt = injection =>
  usecase('Update Debt', {
    // Input/Request metadata and validation 
    request: request.from(Debt),

    // Output/Response metadata
    response: Debt,

    //Authorization with Audit
    // authorize: (user) => (user.canUpdateDebt ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Retrieve the Debt': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.DebtRepository(injection)
      const [debt] = await repo.findByID(id)
      ctx.debt = debt
      if (debt === undefined) return Err.notFound({
        message: `Debt not found - ID: ${id}`,
        payload: { entity: 'Debt' }
      })

      return Ok(debt)
    }),

    'Check if it is a valid Debt before update': step(ctx => {
      const oldDebt = ctx.debt
      const newDebt = Debt.fromJSON(merge.all([ oldDebt, ctx.req ]))
      ctx.debt = newDebt

      return newDebt.isValid() ? Ok() : Err.invalidEntity({
        message: `Debt is invalid`,
        payload: { entity: 'Debt' },
        cause: newDebt.errors
      })

    }),

    'Update the Debt': step(async ctx => {
      const repo = new ctx.di.DebtRepository(injection)
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.update(ctx.debt))
    })

  })

module.exports =
  herbarium.usecases
    .add(updateDebt, 'UpdateDebt')
    .metadata({ group: 'Debt', operation: herbarium.crud.update, entity: Debt })
    .usecase