const Debt = require('../../entities/debt')
const findDebt = require('./findDebt')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findDebtSpec = spec({

  usecase: findDebt,

  'Find a debt when it exists': scenario({
    'Given an existing debt': given({
      request: {

      },
      user: { hasAccess: true },
      injection: {
        DebtRepository: class DebtRepository {
          async findByID(id) {
            const fakeDebt = {
              debtId: 99,
              name: 'a text',
              governmentId: 99,
              email: 'valid@email.com',
              debtAmount: 99,
              debtDueDate: new Date(),
              paid: false
            }
            return ([Debt.fromJSON(fakeDebt)])
          }
        }
      },
    }),

    // when: default when for use case

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return a valid debt': check((ctx) => {
      assert.strictEqual(ctx.response.ok.isValid(), true)
    })

  }),

  'Do not find a debt when it does not exist': scenario({
    'Given an empty debt repository': given({
      request: {

      },
      user: { hasAccess: true },
      injection: {
        DebtRepository: class DebtRepository {
          async findByID(id) { return [] }
        }
      },
    }),

    // when: default when for use case

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr)
      assert.ok(ctx.response.isNotFoundError)
    }),
  }),
})

module.exports =
  herbarium.specs
    .add(findDebtSpec, 'FindDebtSpec')
    .metadata({ usecase: 'FindDebt' })
    .spec