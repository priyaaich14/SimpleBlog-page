const { checkSchema, validationResult } = require('express-validator')

const blogValidationSchema = {
    title: {
        in: ['body'],
        exists: {
            errorMessage: 'Title is required'
        },
        notEmpty: {
            errorMessage: 'Title cannot be empty'
        },
        trim: true,
        isString: {
            errorMessage: 'Title must be a string'
        },
        isLength: {
            options: { min: 5, max: 255 },
            errorMessage: 'Title must be between 5 and 255 characters'
        }
    },
    content: {
        in: ['body'],
        exists: {
            errorMessage: 'Content is required'
        },
        notEmpty: {
            errorMessage: 'Content cannot be empty'
        },
        trim: true,
        isString: {
            errorMessage: 'Content must be a string'
        },
        isLength: {
            options: { min: 10 },
            errorMessage: 'Content must be at least 10 characters long'
        }
    }
}

const idValidationSchema = {
    id: {
        in: ['params'],
        exists: {
            errorMessage: 'ID is required'
        },
        isMongoId: {
            errorMessage: 'Invalid blog ID'
        }
    }
}

const validate = (schemas) => {
    return async (req, res, next) => {
        await Promise.all(schemas.map((schema) => schema.run(req)))

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        res.status(400).json({ errors: errors.array() })
    }
}

module.exports = {
    blogValidationSchema,
    idValidationSchema,
    validate
}
