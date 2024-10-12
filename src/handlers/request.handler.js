import { validationResult } from 'express-validator'
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.error('Validation Errors:', errors.array()) // Log the validation errors
    return res.status(400).json({
      status: 400,
      message: errors
        .array()
        .map(err => err.msg)
        .join(', '),
    })
  }
  next()
}
export default { validate }
