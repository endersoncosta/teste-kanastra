const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const DebtPaymentReceipt =
  entity('DebtPaymentReceipt', {
    debtId: id(Number),
    paidAt: field(Date),
    paidAmount: field(Number),
    paidBy: field(String)
  })

module.exports =
  herbarium.entities
    .add(DebtPaymentReceipt, 'DebtPaymentReceipt')
    .entity
