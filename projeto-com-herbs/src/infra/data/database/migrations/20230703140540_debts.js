
exports.up = async function (knex) {
    knex.schema.hasTable('debts')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('debts', function (table) {
                    table.integer('debt_id').primary()
                    table.string('name')
                    table.bigint('government_id')
                    table.string('email')
                    table.decimal('debt_amount', 14, 2);
                    table.timestamp('debt_due_date')
                    table.boolean("paid").notNullable().defaultTo(0)
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('debts')
}
