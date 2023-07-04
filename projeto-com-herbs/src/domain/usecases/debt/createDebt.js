const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Debt = require('../../entities/debt')
const DebtRepository = require('../../../infra/data/repositories/debtRepository')

const dependency = { DebtRepository }

const createDebt = injection =>
  usecase('Create Debt', {
    // Input/Request metadata and validation 
    request: request.from(Debt, { ignoreIDs: true }),

    // Output/Response metadata
    response: Debt,

    //Authorization with Audit
    // authorize: (user) => (user.canCreateDebt ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    //Step description and function
    'Check if the Debt is valid': step(ctx => {
      ctx.debt = Debt.fromJSON(ctx.req)
      
      if (!ctx.debt.isValid()) 
        return Err.invalidEntity({
          message: 'The Debt entity is invalid', 
          payload: { entity: 'Debt' },
          cause: ctx.debt.errors 
        })

      // returning Ok continues to the next step. Err stops the use case execution.
      return Ok() 
    }),

    'Save the Debt': step(async ctx => {
      const repo = new ctx.di.DebtRepository(injection)
      const debt = ctx.debt
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.insert(debt))
    })
  })

module.exports =
  herbarium.usecases
    .add(createDebt, 'CreateDebt')
    .metadata({ group: 'Debt', operation: herbarium.crud.create, entity: Debt })
    .usecase