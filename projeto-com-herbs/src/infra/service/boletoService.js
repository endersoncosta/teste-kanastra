const { herbarium } = require('@herbsjs/herbarium')
const Boleto = require('../../domain/entities/boleto')

class BoletoService {
    generate(debt) {
        const boleto = Boleto.fromDebt(debt)
        boleto.barCode = this.barCodeGenerate()
        return boleto
    }

    barCodeGenerate() {
        const min = 100000000
        const max = 999999999
        return String(Math.floor(Math.random() * (max - min) + min));
    }
}

module.exports =
    herbarium.repositories
        .add(BoletoService, 'BoletoService')
        .metadata({ entity: Boleto })
        .repository