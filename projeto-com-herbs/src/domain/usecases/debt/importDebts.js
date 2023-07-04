const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Debt = require('../../entities/debt')
const DebtRepository = require('../../../infra/data/repositories/debtRepository')

const dependency = { DebtRepository }

const importDebts = injection =>
  usecase('Import Debts', {
    request: { debts: [Debt] },
    response: Boolean,

    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    //Step description and function
    'Check if the Debt is valid': step(ctx => {
      const debts = []

      for (let i = 0; i < ctx.req.debts.length; i++) {
        const debt = ctx.req.debts[i];
        
        if (!debt.isValid())
          return Err.invalidEntity({
            message: 'The Debt entity is invalid',
            payload: { entity: 'Debt' },
            cause: ctx.debt.errors
          })
        debts.push(Debt.fromJSON(debt))
      }
      ctx.debts = debts
      return Ok()
    }),

    'Save the Debt': step(async ctx => {
      const repo = new ctx.di.DebtRepository(injection)
      const debts = ctx.debts
      return (ctx.ret = await repo.batchInsert(debts))
    })
  })

module.exports =
  herbarium.usecases
    .add(importDebts, 'ImportDebts')
    .metadata({ group: 'Debt', entity: Debt })
    .usecase