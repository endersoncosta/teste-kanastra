const { Repository } = require("@herbsjs/herbs2knex")
const { herbarium } = require('@herbsjs/herbarium')
const DebtPaymentReceipt = require('../../../domain/entities/debtPaymentReceipt')
const connection = require('../database/connection')

class DebtPaymentReceiptRepository extends Repository {
    constructor(injection) {
        super({
            entity: DebtPaymentReceipt,
            table: "debt_payment_receipts",
            knex: connection
        })
    }
}

module.exports =
    herbarium.repositories
        .add(DebtPaymentReceiptRepository, 'DebtPaymentReceiptRepository')
        .metadata({ entity: DebtPaymentReceipt })
        .repository