import responseHandler from '../handlers/response.handler.js'
import reviewModel from '../models/review.model.js'

const create = async (req, res) => {
  try {
    const { mediaId, content, mediaType, mediaTitle, mediaPoster, mediaRate } =
      req.body

    const review = new reviewModel({
      user: req.user.id,
      mediaId,
      content,
      mediaType,
      mediaTitle,
      mediaPoster,
      mediaRate,
    })

    await review.save()

    responseHandler.created(res, {
      ...review._doc,
      id: review._id, // Make sure this is included
      user: req.user,
    })
  } catch (error) {
    console.error('Error creating review:', error)
    responseHandler.error(res)
  }
}

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params

    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user.id,
    })

    if (!review) return responseHandler.notfound(res)

    await review.remove()

    // Optionally, you can return a message confirming deletion
    responseHandler.ok(res, { message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error removing review:', error)
    responseHandler.error(res)
  }
}

const getReviewsOfUser = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({
        user: req.user.id,
      })
      .sort('-createdAt')

    responseHandler.ok(res, reviews)
  } catch {
    responseHandler.error(res)
  }
}

export default { create, remove, getReviewsOfUser }
