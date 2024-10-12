import jsonwebtoken from 'jsonwebtoken'
import responseHandler from '../handlers/response.handler.js'
import userModel from '../models/user.model.js'

// Function to decode and verify the token
const tokenDecode = req => {
  try {
    const bearerHeader = req.headers['authorization']

    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1]

      // Verify the token using the secret key
      return jsonwebtoken.verify(token, process.env.TOKEN_SECRET_KEY)
    }

    return false // Token not provided
  } catch (error) {
    console.error('Token verification error:', error) // Log the error for debugging
    return false // Return false if verification fails
  }
}

// Middleware function for authentication
const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req)

  if (!tokenDecoded) {
    return responseHandler.unauthorize(res) // Unauthorized if token is invalid
  }

  // Find the user by the ID extracted from the token
  const user = await userModel.findById(tokenDecoded.data)

  if (!user) {
    return responseHandler.unauthorize(res) // Unauthorized if user not found
  }

  req.user = user // Attach the user to the request object

  next() // Proceed to the next middleware or route handler
}

export default { auth, tokenDecode }
