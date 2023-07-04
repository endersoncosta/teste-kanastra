
exports.up = async function (knex) {
    knex.schema.hasTable('debt_payment_receipts')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('debt_payment_receipts', function (table) {
                    table.integer('debt_id')
                    table.string('paid_by')
                    table.decimal('paid_amount', 14, 2);
                    table.timestamp('paid_at')
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('debt_payment_receipts')
}
