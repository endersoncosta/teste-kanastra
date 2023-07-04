/* eslint-disable no-unused-vars */
const { req2request } = require('@herbsjs/herbs2rest')
const papa = require('papaparse');
const { error } = require('../../log/logger')

const csvController = async (uc, req, user, res, next) => {
    try {
        const usecase = uc()
        const csvRequest = papa.parse(String(req.body), { header: true, dynamicTyping: true })
        if (csvRequest?.errors?.length) error('erro detectado no csv', csvRequest.errors)


        const dateFields = []
        const requestField = Object.keys(usecase.requestSchema)
        const entity = usecase.requestSchema[requestField][0]
        const schema = entity.schema

        const fields = Object.keys(schema)

        fields.map(field => {
            if (schema[field].type === Date)
                dateFields.push(field)
        })

        const requestFormated = csvRequest.data.map(data => {
            dateFields.forEach(field => data[field] = new Date(data[field]))
            return entity.fromJSON(data)
        })

        /* Authorization */
        const hasAccess = await usecase.authorize(user)
        if (hasAccess === false) {
            console.info(usecase.auditTrail)
            return res.status(403).json({ message: 'User is not authorized' })
        }

        /* Execution */
        const response = await usecase.run({ debts: requestFormated })

        console.info(usecase.auditTrail)

        if (response.isOk) {
            res.status(200).json(response.ok)
        }
        else {
            // Err
            let status = 400
            if (response.isInvalidArgumentsError) status = 400
            if (response.isPermissionDeniedError) status = 403
            if (response.isNotFoundError) status = 404
            if (response.isAlreadyExistsError) status = 409
            if (response.isInvalidEntityError) status = 422
            if (response.isUnknownError) status = 500
            res.status(status).json({ error: response.err })
        }
        res.end()

    } catch (error) {
        error('ocorreu um erro desconhecido', error)
        res.status(500).json({ code: 500, message: 'ocorreu um erro interno' })
        next()
    }
}

module.exports = csvController