const responseWithData = (res, statusCode, data) =>
  res.status(statusCode).json(data)

const error = (res, message = 'Internal Server Error', statusCode = 500) =>
  responseWithData(res, statusCode, {
    status: statusCode,
    message,
  })

const badRequest = (res, message) =>
  responseWithData(res, 400, {
    status: 400,
    message,
  })

const ok = (res, data) => responseWithData(res, 200, data)

const created = (res, data) => responseWithData(res, 201, data)

const unauthorize = res =>
  responseWithData(res, 401, {
    status: 401,
    message: 'Unauthorized',
  })

const notFound = res =>
  responseWithData(res, 404, {
    status: 404,
    message: 'Resource not found',
  })

const conflict = (res, message) =>
  responseWithData(res, 409, {
    status: 409,
    message,
  })

export default {
  error,
  badRequest,
  ok,
  created,
  unauthorize,
  notFound,
  conflict,
}
