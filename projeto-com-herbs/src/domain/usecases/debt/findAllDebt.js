const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Debt = require('../../entities/debt')
const DebtRepository = require('../../../infra/data/repositories/debtRepository')

const dependency = { DebtRepository }

const findAllDebt = injection =>
  usecase('Find all Debts', {
    // Input/Request metadata and validation
    request: {
      limit: Number,
      offset: Number
    },

    // Output/Response metadata
    response: [Debt],

    //Authorization with Audit
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return all the Debts': step(async ctx => {
      const repo = new ctx.di.DebtRepository(injection)
      const debts = await repo.findAll(ctx.req)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = debts)
    })
  })

module.exports =
  herbarium.usecases
    .add(findAllDebt, 'FindAllDebt')
    .metadata({ group: 'Debt', operation: herbarium.crud.readAll, entity: Debt })
    .usecase
