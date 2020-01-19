import axios from 'axios'

export const API_SERVER_URL = 'https://api.claris.su/main/'

const conf = {
    baseURL: API_SERVER_URL,
    headers: { 'Cache-Control': 'no-cache' },
    timeout: 15000
}

const instance = axios.create(conf)

const onError = (error) => {
  if (error.response) {
    console.warn('axios onError', error.response)
    if (error.response.status === 400) {
      throw Error('Не верный логин или пароль')
    } else if (error.response.status > 400) {
      throw Error('При обработке запроса произошла ошибка, мы ее зафиксировали и уже разбираемся в причинах.')
    }
  } else if (error.request) {
    console.warn('axios onError', error.request)
    throw Error('Сервер недоступен. Проверьте свое интернет-соединение')
  } else {
    console.warn('Error', error.message)
  }
}


const login = (user, password) =>  {
  const body = `grant_type=password&username=${user}&password=${password}`
  const conf = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
  return instance.post('/token', body, conf).catch(onError)
}

const authorize = () => instance.get('/vNext/v1/users/current')
const setAuthHeader = (token) => instance.defaults.headers.authorization = `Bearer ${token}`

const fetchDocuments = () => instance.get('vNext/v1/documents', conf).catch(onError)
const fetchTasks = () => instance.get('vNext/v1/tasks', conf).catch(onError)

const getFileLink = fileId => instance.post(`vNext/v1/files/${fileId}`)

const updateTicket = (ticket) => instance.patch(`/vnext/v1/requests/${ticket.id}`, ticket)


export default { login, authorize, setAuthHeader,
                 fetchDocuments, fetchTasks,
                 updateTicket, getFileLink }
