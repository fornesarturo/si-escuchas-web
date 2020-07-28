import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: { "Access-Control-Allow-Origin": process.env.VUE_APP_API_URL },
  withCredentials: true
})

axiosInstance.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data
  }, error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(`Oh no, error ocurred:`)
    console.log(error)
    if (error.response)
      return error.response
    return error
  })

export default axiosInstance
