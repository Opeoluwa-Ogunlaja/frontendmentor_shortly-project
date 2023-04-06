import axios from "axios";

axios.interceptors.response.use(undefined, (err) => {
    const { config, message } = err

    if (!config || !config.retry) {
        return Promise.reject(err)
    }

    if (!(message.includes('timeout') || message.includes('Network Error'))) {
        return Promise.reject(err)
    }

    config.retry -= 1
    const delayRetryRequest = new Promise(resolve => {
        setTimeout(resolve, config.retryDelay || 1000)
    })

    return delayRetryRequest.then(() => axios(config))
})


export const validUrl = (url) => {
    if (typeof url !== 'string') return false
    const validRegexHTTP = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    const validRegexNoHTTP = /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
    return url.match(validRegexHTTP) || url.match(validRegexNoHTTP)
}


export const fetchShortLink = (link) => {
    return axios.get(`https://api.shrtco.de/v2/shorten?url=${link}`, { retry: 3 }).then(res => res.data)
}


export const getLocalStorageValue = (key, initialValue) => {
    if (localStorage.getItem(key) == null) {
        if (typeof initialValue == 'function') {
            localStorage.setItem(key, JSON.stringify(initialValue()))
            return initialValue()
        }
        else{
            localStorage.setItem(key, JSON.stringify(initialValue))
            return initialValue
        }
    }
    else{
        return JSON.parse(localStorage.getItem(key));
    }
}

export const setLocalStorageValue = (key, value) => {
    if (typeof value == 'function') {
        localStorage.setItem(key, JSON.stringify(value()))
    }
    else{
        localStorage.setItem(key, JSON.stringify(value))
    }

    const  localStorageEvent = new CustomEvent('localstorage', {detail: typeof value == 'function' ? value() : value})
    window.dispatchEvent(localStorageEvent)
    return typeof value == 'function' ? value() : value
}


















export const copyLink = (text) => {
    navigator.clipboard.writeText(text)

    const CopyEvent = new CustomEvent('copylink', { detail: text })
    window.dispatchEvent(CopyEvent)
}