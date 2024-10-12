import mongoose from 'mongoose'
import responseHandler from '../handlers/response.handler.js'
import favoriteModel from '../models/favorite.model.js'

const addFavorite = async (req, res) => {
  try {
    // Check if the favorite already exists
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId,
    })

    // If it already exists, return the existing favorite
    if (isFavorite) {
      const favorites = await favoriteModel.find({ user: req.user.id })
      return responseHandler.ok(res, favorites)
    }

    // Create a new favorite
    const favorite = new favoriteModel({
      ...req.body,
      user: req.user.id,
    })

    // Save the new favorite to the database
    await favorite.save()

    // Fetch the updated list of favorites
    const favorites = await favoriteModel.find({ user: req.user.id })

    // Respond with the full favorites array
    responseHandler.created(res, favorites)
  } catch (error) {
    console.error(error) // Log the error for debugging
    responseHandler.error(res)
  }
}

const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params

    // Validate the favoriteId format
    if (!mongoose.Types.ObjectId.isValid(favoriteId)) {
      return responseHandler.badRequest(res, 'Invalid favorite ID format')
    }

    // Find the favorite item for the authenticated user
    const favorite = await favoriteModel.findOne({
      user: req.user.id,
      _id: favoriteId,
    })

    // Check if the favorite item exists
    if (!favorite) {
      return responseHandler.notfound(res, 'Favorite not found for this user')
    }

    // Remove the favorite item
    await favorite.remove()

    // Return a success response
    responseHandler.ok(res, { message: 'Favorite removed successfully' })
  } catch (error) {
    console.error('Error removing favorite:', error) // Log the error for debugging
    responseHandler.error(res, 'An error occurred while removing the favorite')
  }
}
const getFavoritesOfUser = async (req, res) => {
  try {
    const favorite = await favoriteModel
      .find({ user: req.user.id })
      .sort('-createdAt')

    responseHandler.ok(res, favorite)
  } catch {
    responseHandler.error(res)
  }
}

export default { addFavorite, removeFavorite, getFavoritesOfUser }
