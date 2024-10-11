import userModel from '../models/user.model.js'
import jsonwebtoken from 'jsonwebtoken'

const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body

    const checkUser = await userModel.findOne({ username })
    if (checkUser) {
      return res
        .status(400)
        .json({ status: 400, message: 'Username already used' })
    }

    const user = new userModel()
    user.displayName = displayName
    user.username = username
    user.setPassword(password)

    await user.save()

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      token,
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ status: 500, message: error || 'Oops! Something went wrong!' })
  }
}

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await userModel
      .findOne({ username })
      .select('username password salt id displayName')

    if (!user) {
      return res.status(400).json({ status: 400, message: 'User not found' })
    }

    if (!user.validPassword(password)) {
      return res.status(400).json({ status: 400, message: 'Wrong password' })
    }

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      token,
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ status: 500, message: 'Oops! Something went wrong!' })
  }
}

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body

    const user = await userModel
      .findById(req.user.id)
      .select('password id salt')
    if (!user) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' })
    }

    if (!user.validPassword(password)) {
      return res.status(400).json({ status: 400, message: 'Wrong password' })
    }

    user.setPassword(newPassword)
    await user.save()

    res
      .status(200)
      .json({ status: 200, message: 'Password updated successfully' })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ status: 500, message: 'Oops! Something went wrong!' })
  }
}

const getInfo = async (req, res) => {
  try {
    // Find the user by ID from the token
    const user = await userModel.findById(req.user.id)

    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: 'Resource not found' })
    }

    // Prepare the response data, including the token info if needed
    const userInfo = {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      createdAt: user.createdAt,
      token: req.headers.authorization?.split(' ')[1],
    }

    res.status(200).json({ status: 200, data: userInfo })
  } catch (error) {
    console.error(error)
    if (error.name === 'CastError') {
      return res
        .status(400)
        .json({ status: 400, message: 'Invalid user ID format' })
    }
    res
      .status(500)
      .json({ status: 500, message: 'Oops! Something went wrong!' })
  }
}

export default {
  signup,
  signIn,
  getInfo,
  updatePassword,
}
