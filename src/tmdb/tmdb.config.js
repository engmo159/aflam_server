const baseUrl = process.env.TMDB_BASE_URL
const key = process.env.TMDB_KEY

const getUrl = (endpoint, params) => {
  // transfer params from object to query url from class urlsearchparams
  const qs = new URLSearchParams(params)

  return `${baseUrl}${endpoint}?api_key=${key}&${qs}`
}

export default { getUrl }
