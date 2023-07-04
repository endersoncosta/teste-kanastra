const Debt = require('../../entities/debt')
const findAllDebt = require('./findAllDebt')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllDebtSpec = spec({

    usecase: findAllDebt,
  
    'Find all debts': scenario({
      'Given an existing debt': given({
        request: { limit: 0, offset: 0 },
        user: { hasAccess: true },
        injection: {
            DebtRepository: class DebtRepository {
              async findAll(id) { 
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
          },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must return a list of debts': check((ctx) => {
        assert.strictEqual(ctx.response.ok.length, 1)
      })

    }),

  })
  
module.exports =
  herbarium.specs
    .add(findAllDebtSpec, 'FindAllDebtSpec')
    .metadata({ usecase: 'FindAllDebt' })
    .spec