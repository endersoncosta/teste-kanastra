const Debt = require('../../entities/debt')
const importDebts = require('./importDebts')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const baseInjection = {
  DebtRepository: class DebtRepository {
    async batchInsert(debts) {
      return debts
    }
  }
}

const fakeDebt = Debt.fromJSON({
  debtId: 8291,
  name: 'John Doe',
  governmentId: 11111111111,
  email: 'johndoe@kanastra.com.br',
  debtAmount: 100,
  debtDueDate: new Date('2022-10-12'),
  paid: false
})

const importDebtsSpec = spec({
  usecase: importDebts,

  'Import Debit': scenario({
    'Given an existing debt': given({
      request: {
        debts: [fakeDebt]
      },
      user: { hasAccess: true },
      injection: baseInjection,
    }),
    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return a list of sent debts': check((ctx) => {
      assert.strictEqual(String(ctx.response.ok), String([Debt.fromJSON(fakeDebt)]))
    })

  })
})

module.exports =
  herbarium.specs
    .add(importDebtsSpec, 'ImportDebtsSpec')
    .metadata({ usecase: 'ImportDebtsSpec' })
    .spec