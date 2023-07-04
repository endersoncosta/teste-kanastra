const createDebt = require('./createDebt')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createDebtSpec = spec({

  usecase: createDebt,

  'Create a new debt when it is valid': scenario({
    'Given a valid debt': given({
      request: {
        debtId: 99,
        name: 'a text',
        governmentId: 99,
        email: 'email@valid.com',
        debtAmount: 99
      },
      user: { hasAccess: true },
      injection: {
        DebtRepository: class DebtRepository {
          async insert(debt) { return (debt) }
        }
      },
    }),

    // when: default when for use case

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return a valid debt': check((ctx) => {
      assert.strictEqual(ctx.response.ok.isValid(), true)
      // TODO: check if it is really a debt
    })

  }),

  'Do not create a new debt when it is invalid': scenario({
    'Given a invalid debt': given({
      request: {
        debtId: true,
        name: true,
        governmentId: true,
        email: true,
        debtAmount: true,
        debtDueDate: true
      },
      user: { hasAccess: true },
      injection: {
        debtRepository: new (class DebtRepository {
          async insert(debt) { return (debt) }
        })
      },
    }),

    // when: default when for use case

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr)
      // assert.ok(ret.isInvalidEntityError)
    }),

  }),
})

module.exports =
  herbarium.specs
    .add(createDebtSpec, 'CreateDebtSpec')
    .metadata({ usecase: 'CreateDebt' })
    .spec