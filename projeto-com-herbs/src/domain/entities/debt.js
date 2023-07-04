const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Debt =
  entity('Debt', {
    debtId: id(Number),
    name: field(String),
    governmentId: field(Number),
    email: field(String, { validation: { email: true } }),
    debtAmount: field(Number),
    debtDueDate: field(Date),
    paid: field(Boolean)
  })

module.exports =
  herbarium.entities
    .add(Debt, 'Debt')
    .entity
