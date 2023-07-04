const Debt = require('../../entities/debt')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const receiveDebtPayment = require('./receiveDebtPayment')
const DebtPaymentReceipt = require('../../entities/debtPaymentReceipt')

const baseInjection = {
  DebtPaymentReceiptRepository: class DebtPaymentReceiptRepository {
    insert(receipt) {
      return receipt
    }
  },
  DebtRepository: class DebtRepository {
    async findByID(id) {
      const fakeDebt = {
        debtId: 99,
        name: 'a text',
        governmentId: 99,
        email: 'test@valid.com',
        debtAmount: 99
      }
      return ([Debt.fromJSON(fakeDebt)])
    }
    async batchInsert(debts) {
      return debts
    }
    async updateDebtPaidStatus() {
      return true
    }
  }
}

const requestBase = {
  debtId: 515,
  paidAt: new Date(),
  paidAmount: 5151,
  paidBy: 'anon'
}


const receiveDebtPaymentSpec = spec({
  usecase: receiveDebtPayment,

  'Receive Debt Payment': scenario({
    'Given an existing debt receipt': given({
      request: {
        ...requestBase
      },
      user: { hasAccess: true },
      injection: baseInjection,
    }),
    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return a list of sent debts': check((ctx) => {
      assert.strictEqual(String(ctx.response.ok), String([DebtPaymentReceipt.fromJSON(requestBase)]))
    })
  }),


  'Receive Debt Payment Receipt Without Debt': scenario({
    'Given an existing debt receipt': given({
      request: {
        ...requestBase
      },
      user: { hasAccess: true },
      injection: {
        ...baseInjection,
        DebtRepository: class DebtRepository {
          async findByID(id) {
            return []
          }
          async batchInsert(debts) {
            return debts
          }
          async updateDebtPaidStatus() {
            return true
          }
        }
      },
    }),
    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return a list of sent debts': check((ctx) => {
      assert.strictEqual(ctx.response.ok, undefined);
    })

  })
})

module.exports =
  herbarium.specs
    .add(receiveDebtPaymentSpec, 'ReceiveDebtPaymentSpec')
    .metadata({ usecase: 'ReceiveDebtPaymentSpec' })
    .spec