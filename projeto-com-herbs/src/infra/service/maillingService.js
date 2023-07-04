const { herbarium } = require('@herbsjs/herbarium')

class MaillingService {
    sendDebtBoleto(debt, boleto) {
        return { debt: debt.debtId, sent: false }
    }
}

module.exports =
    herbarium.repositories
        .add(MaillingService, 'MaillingService')
        .repository