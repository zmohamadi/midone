import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        // 'Access-Control-Allow-Headers':'*',
        'Access-Control-Allow-Credentials' : true,
        'Content-Type': 'application/json,text/plain',
    },
    withCredentials: true,
    withXSRFToken1: true
})

export default axios
