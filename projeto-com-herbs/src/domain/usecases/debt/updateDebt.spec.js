const Debt = require('../../entities/debt')
const updateDebt = require('./updateDebt')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateDebtSpec = spec({

  usecase: updateDebt,
  'Update a existing debt when it is valid': scenario({

    'Valid debts': samples([
      {
        debtId: 99,
        name: 'a text',
        governmentId: 99,
        email: 'valid@email.com',
        debtAmount: 99
      },
      {
        debtId: 99,
        name: 'a text',
        governmentId: 99,
        email: 'valid@email.com',
        debtAmount: 99
      }
    ]),

    'Valid debts Alternative': samples([
      {
        debtId: 99,
        name: 'a text',
        governmentId: 99,
        email: 'valid@email.com',
        debtAmount: 99
      },
      {
        debtId: 99,
        name: 'a text',
        governmentId: 99,
        email: 'valid@email.com',
        debtAmount: 99
      }
    ]),

    'Given a valid debt': given((ctx) => ({
      request: ctx.sample,
      user: { hasAccess: true }
    })),

    'Given a repository with a existing debt': given((ctx) => ({
      injection: {
        DebtRepository: class DebtRepository {
          async findByID(id) {
            const fakeDebt = {
              debtId: 99,
              name: 'a text',
              governmentId: 99,
              email: 'valid@email.com',
              debtAmount: 99
            }
            return ([Debt.fromJSON(fakeDebt)])
          }
          async update(id) { return true }
        }
      },
    })),

    // when: default when for use case

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must confirm update': check((ctx) => {
      assert.ok(ctx.response.ok === true)
    })

  }),

  'Do not update a debt when it is invalid': scenario({
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
      injection: {},
    }),

    // when: default when for use case

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr)
      // assert.ok(ctx.response.isInvalidEntityError)
    }),

  }),

  'Do not update debt if it does not exist': scenario({
    'Given an empty debt repository': given({
      request: {
        debtId: 99,
        name: 'a text',
        governmentId: 99,
        email: 'valid@email.com',
        debtAmount: 99
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
    .add(updateDebtSpec, 'UpdateDebtSpec')
    .metadata({ usecase: 'UpdateDebt' })
    .spec