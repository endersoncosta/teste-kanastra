const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const { error } = require('../../../infra/log/logger')
const DebtRepository = require('../../../infra/data/repositories/debtRepository')
const DebtPaymentReceiptRepository = require('../../../infra/data/repositories/debtPaymentReceiptRepository')
const BoletoService = require('../../../infra/service/boletoService')
const MaillingService = require('../../../infra/service/maillingService')
const DebtPaymentReceipt = require('../../entities/debtPaymentReceipt')

const dependency = { DebtRepository, BoletoService, MaillingService, DebtPaymentReceiptRepository }

const receiveDebtPayment = injection =>
  usecase('Receive Debt Payment', {
    request: request.from(DebtPaymentReceipt),
    response: DebtPaymentReceipt,
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Validate debt payment': step(async ctx => {
      ctx.debtReceipt = DebtPaymentReceipt.fromJSON(ctx.req)

      if (!ctx.debtReceipt.isValid())
        return Err.invalidEntity({
          message: 'The DebtPaymentReceipt entity is invalid',
          payload: { entity: 'Debt' },
          cause: ctx.debtPaymentReceipt.errors
        })

      return Ok()
    }),

    'Save debt payment receipt': step(async ctx => {
      const repo = new ctx.di.DebtPaymentReceiptRepository(injection)
      const debt = ctx.debtReceipt
      ctx.ret = await repo.insert(debt)
      return Ok()
    }),

    'Retrieve the Debt': step(async ctx => {
      const id = ctx.debtReceipt.debtId
      const repo = new ctx.di.DebtRepository(injection)
      const [debt] = await repo.findByID(id)
      ctx.debt = debt
      if (debt === undefined) {
        error('Debt not found - ID: ${id}', ctx.debtReceipt)
        ctx.stop()
      }

      return Ok(ctx.ret = debt)
    }),

    'Update the Debt': step(async ctx => {
      const repo = new ctx.di.DebtRepository(injection)
      await repo.updateDebtPaidStatus(ctx.debt.debtId, true)
      return (ctx.ret = ctx.debtReceipt)
    })
  })

module.exports =
  herbarium.usecases
    .add(receiveDebtPayment, 'ReceiveDebtPayment')
    .metadata({ group: 'DebtPaymentReceipt', operation: herbarium.crud.create, entity: DebtPaymentReceipt })
    .usecase


