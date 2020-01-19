export const UPDATE_TICKET_REQUEST = 'updateTicket'
export const IS_UPDATING = 'isUpdating'
export const UPDATED = 'updated'
export const UPDATE_FAILED = 'updateFailed'
export const CLEAR_FLAGS = 'clearFlags'
export const GET_FILE_REQUEST = 'getFile'
export const FILE_DOWNLOADED = 'fileDownloaded'
export const FILE_DOWNLOADING_FAILED = 'fileDownloadingFailed'
export const FILE_IS_DOWNLOADING = 'fileIsDownloading'


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
