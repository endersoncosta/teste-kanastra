const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Debt = require('../../entities/debt')
const DebtRepository = require('../../../infra/data/repositories/debtRepository')
const BoletoService = require('../../../infra/service/boletoService')
const MaillingService = require('../../../infra/service/maillingService')
const { error } = require('../../../infra/log/logger')

const dependency = { DebtRepository, BoletoService, MaillingService }

const emitDebt = injection =>
  usecase('Emit Debt', {
    request: Object,
    response: Array,
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Search for all debts that have not been paid': step(async ctx => {
      const repo = new ctx.di.DebtRepository()
      const debts = await repo.find({ where: { paid: 'false' } })
      ctx.debts = debts
      return Ok()
    }),

    'Issue the boleto': step(async ctx => {
      ctx.boletos = ctx.debts.map(debt => {
        const service = new ctx.di.BoletoService()
        return service.generate(debt)
      })

      return Ok(ctx.boletos)
    }),

    'Send email': step(async ctx => {
      const emailsSent = ctx.boletos.map(boleto => {
        const service = new ctx.di.MaillingService()
        const boletoDebt = ctx.debts.find(debt => debt.debtId === boleto.debtId)
        return service.sendDebtBoleto(boletoDebt, boleto)
      })

      const errors = emailsSent.filter(email => !email?.sent)
      if (errors.length) {
        error('Erro ao enviar e-mails', errors)
        return Err.buildCustomErr(500, 'Erro ao enviar e-mails')
      }

      return Ok(ctx.ret = emailsSent)
    })
  })

module.exports =
  herbarium.usecases
    .add(emitDebt, 'EmitDebt')
    .metadata({ group: 'Debt', entity: Debt })
    .usecase
