const Debt = require('../../entities/debt')
const deleteDebt = require('./deleteDebt')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteDebtSpec = spec({

    usecase: deleteDebt,
  
    'Delete debt if exists': scenario({
      'Given an existing debt': given({
        request: {
            
        },
        user: { hasAccess: true },
        injection:{
            DebtRepository: class DebtRepository {
                async delete(entity) { return true }
                async findByID(id) { return [Debt.fromJSON({ id })] }            }
        },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must confirm deletion': check((ctx) => {
        assert.ok(ctx.response.ok === true)
      })

    }),

    'Do not delete debt if it does not exist': scenario({
        'Given an empty debt repository': given({
          request: {
              
          },
          user: { hasAccess: true },
          injection:{
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
    .add(deleteDebtSpec, 'DeleteDebtSpec')
    .metadata({ usecase: 'DeleteDebt' })
    .spec