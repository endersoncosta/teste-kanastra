const Debt = require('../../entities/debt')
const Boleto = require('../../entities/boleto')
const emitDebt = require('./emitDebt')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const baseInjection = {
  BoletoService: class BoletoService {
    generate(debt) {
      const boleto = new Boleto()
      boleto.debtId = debt.debtId
      return boleto
    }
  },
  MaillingService: class MaillingService {
    sendDebtBoleto(debt, boleto) {
      return { debt: debt.debtId, sent: true }
    }
  },
  DebtRepository: class DebtRepository {
    async find(id) {
      const fakeDebt = {
        debtId: 99,
        name: 'a text',
        governmentId: 99,
        email: 'a text',
        debtAmount: 99
      }
      return ([Debt.fromJSON(fakeDebt)])
    }
  }
}

const emitDebtSpec = spec({
  usecase: emitDebt,

  'Emit Debit': scenario({
    'Given an existing debt': given({
      request: {},
      user: { hasAccess: true },
      injection: baseInjection,
    }),
    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return a list of sent debts': check((ctx) => {
      assert.strictEqual(ctx.response.ok.length, 1)
    })

  }),

  'Does Not Emit Debit': scenario({
    'Given an existing debt with email error': given({
      request: {},
      user: { hasAccess: true },
      injection: {
        baseInjection,
        MaillingService: class MaillingService {
          sendDebtBoleto(debt, boleto) {
            return { debt: debt.debtId, sent: false }
          }
        },
      },
    }),
    'Must run and get an error': check((ctx) => {
      assert.ok(ctx.response.isErr)
    }),

    'Must return error when try to send the email': check((ctx) => {
      assert.strictEqual(ctx.response.err.code, 500)
    })

  }),

  'Does Not Emit Debit': scenario({
    'Given a not existing debt': given({
      request: {},
      user: { hasAccess: true },
      injection: {
        baseInjection,
        DebtRepository: class DebtRepository {
          async find(id) {
            return []
          }
        }
      },
    }),
    'Must run and get an error': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return error when try to send the email': check((ctx) => {
      assert.strictEqual(ctx.response.ok.length, 0)
    })

  }),

})

module.exports =
  herbarium.specs
    .add(emitDebtSpec, 'EmitDebtSpec')
    .metadata({ usecase: 'EmitDebtSpec' })
    .spec