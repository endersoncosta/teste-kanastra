const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Boleto =
    entity('Boleto', {
        debtId: id(Number),
        barCode: field(Number),
        debtAmount: field(Number),
        debtDueDate: field(Date),
        issueDate: field(Date)
    })

const fromDebt = (debt) => {
    const boleto = new Boleto()

    boleto.debtId = debt.debtId
    boleto.debtAmount = debt.debtAmount
    boleto.debtDueDate = debt.debtDueDate
    boleto.issueDate = new Date()

    return boleto
}

module.exports =
    herbarium.entities
        .add(Boleto, 'Boleto')
        .entity

module.exports.fromDebt = fromDebt
