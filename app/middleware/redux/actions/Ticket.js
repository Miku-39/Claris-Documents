export const UPDATE_TICKET_REQUEST = 'updateTicket'
export const IS_UPDATING = 'isUpdating'
export const UPDATED = 'updated'
export const UPDATE_FAILED = 'updateFailed'
export const CLEAR_FLAGS = 'clearFlags'
export const GET_FILE_REQUEST = 'getFile'
export const FILE_DOWNLOADED = 'fileDownloaded'
export const FILE_DOWNLOADING_FAILED = 'fileDownloadingFailed'
export const FILE_IS_DOWNLOADING = 'fileIsDownloading'
export const ADD_TICKET_REQUEST = 'addTicket'
export const IS_ADDING = 'isAdding'
export const ADDED = 'added'
export const ADDING_FAILED = 'addingFailed'

export const DOWNLOAD_COMMENTS_REQUEST = 'downloadComments'
export const COMMENTS_DOWNLOADED = 'commentsDownloaded'
export const COMMENTS_DOWNLOADING_FAILED = 'commentsDownloadingFailed'
export const COMMENTS_DOWNLOADING = 'commentsDownloading'

export const add = (ticket) => {
    return {
        type: ADD_TICKET_REQUEST,
        payload: ticket
    }
}

export const isAdding = (isAdding) => {
    return {
        type: IS_ADDING,
        payload: isAdding
    }
}

export const added = () => {
    return {
        type: ADDED
    }
}

export const addingFailed = (error) => {
    return {
        type: ADDING_FAILED,
        payload: error
    }
}

export const update = (ticket) => {
    return {
        type: UPDATE_TICKET_REQUEST,
        payload: ticket
    }
}

export const isUpdating = (isUpdated) => {
    return {
        type: IS_UPDATING,
        payload: isUpdating
    }
}

export const updated = () => {
    return {
        type: UPDATED
    }
}

export const updateFailed = (error) => {
    return {
        type: UPDATE_FAILED,
        payload: error
    }
}

export const dismiss = () => {
    return {
        type: CLEAR_FLAGS
    }
}

export const getFile = (file) => {
  return {
      type: GET_FILE_REQUEST,
      payload: file
  }
}

export const fileIsDownloading = (fileIsDownloading) => {
    return {
        type: FILE_IS_DOWNLOADING,
        payload: fileIsDownloading
    }
}

export const fileDownloadingFailed = (error) => {
    return {
        type: FILE_DOWNLOADING_FAILED,
        payload: error
    }
}

export const fileDownloaded = (link) => {
    return {
        type: FILE_DOWNLOADED,
        payload: link
    }
}

export const downloadComments = (id) => {
  return {
      type: DOWNLOAD_COMMENTS_REQUEST,
      payload: id
  }
}

export const commentsDownloading = (commentsDownloading) => {
    return {
        type: COMMENTS_DOWNLOADING,
        payload: commentsDownloading
    }
}

export const commentsDownloadingFailed = (error) => {
    return {
        type: COMMENTS_DOWNLOADING_FAILED,
        payload: error
    }
}

export const commentsDownloaded = (comments) => {
    return {
        type: COMMENTS_DOWNLOADED,
        payload: comments
    }
}
