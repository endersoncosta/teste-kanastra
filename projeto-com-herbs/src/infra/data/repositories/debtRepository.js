const { Repository } = require("@herbsjs/herbs2knex")
const { herbarium } = require('@herbsjs/herbarium')
const Debt = require('../../../domain/entities/debt')
const connection = require('../database/connection')

class DebtRepository extends Repository {
    constructor(injection) {
        super({
            entity: Debt,
            table: "debts",
            knex: connection
        })
    }

    async batchInsert(debts) {
        const fields = this.dataMapper.tableFields()
        const payload = debts.map(debt => this.dataMapper.tableFieldsWithValue(debt))

        const ret = await this.knex(this.tableQualifiedName)
            .returning(fields)
            .insert(payload)

        return ret.map(debt => this.dataMapper.toEntity(debt))
    }

    async updateDebtPaidStatus(debtId, paidStatus) {
        const tableIDs = this.dataMapper.tableIDs()

        const ret = await this.knex(this.tableQualifiedName)
            .where({ [tableIDs[0]]: debtId })
            .update({
                paid: paidStatus
            })

        return this.dataMapper.toEntity(ret)
    }
}

module.exports =
    herbarium.repositories
        .add(DebtRepository, 'DebtRepository')
        .metadata({ entity: Debt })
        .repository