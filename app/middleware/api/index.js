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
    //console.warn('axios onError', error.response)
    if (error.response.status === 400) {
      throw Error('Не верный логин или пароль')
    } else if (error.response.status > 400) {
      //throw Error('При обработке запроса произошла ошибка, мы ее зафиксировали и уже разбираемся в причинах.')
      console.log(error.response.status)
    }
  } else if (error.request) {
    //console.warn('axios onError', error.request)
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

const fetchDocuments = () => instance.get('vNext/v1/documents?filters=DocumentsForMyVisa', conf).catch(onError)
const fetchTasks = () => instance.get('vNext/v1/tasks?orderBy=number+desc', conf).catch(onError)
const getTaskComments = taskId => instance.get(`vNext/v1/works?filterBy=task.id=${id}`).catch(onError)

const agreeTicket = (comment, id) => instance.post(`vNext/v1/documents/${id}/agree`, comment)
const disagreeTicket = (comment, id) => instance.post(`vNext/v1/documents/${id}/disagree`, comment)
const getFileLink = fileId => instance.get(`vNext/v1/files/${fileId}`)

const updateTicket = (ticket) => instance.patch(`/vnext/v1/requests/${ticket.id}`, ticket)
const addTicket = (ticket) => instance.post('/vNext/v1/requests', ticket).catch(onError)


export default { login, authorize, setAuthHeader,
                 fetchDocuments, fetchTasks,
                 updateTicket, getFileLink,
                 agreeTicket, disagreeTicket,
                 addTicket, getTaskComments }
