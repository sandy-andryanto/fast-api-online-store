import axios from "axios"

const http = (auth:boolean, token?: string) => {

   let headers = {}

    headers = {
        ...headers,
        "Content-type": "application/json",
    }

    if(auth){
        const tokenStorage = localStorage.getItem('auth_token')
        headers = {
            ...headers,
            "Authorization ": `Bearer ${tokenStorage}`
        }
    }else{
        if (token !== undefined && token !== null) {
            headers = {
                ...headers,
                "Authorization ": `Bearer ${token}`
            }
        }
    }

    return axios.create({ baseURL: `${import.meta.env.VITE_APP_BACKEND_URL}`, headers: headers })
}

const ping = async () => {
    return await http(false).get("/api/ping")
}

const expiredMessage = `Your session has been expired. Please log in again to continue using the app`

const getFile = (param:string) => {
    return `${import.meta.env.VITE_APP_BACKEND_URL}/${param}`
}

const auth = {
    login: async (body: unknown) => {
        return await http(false).post("/api/auth/login", body)
    },
    register: async (body: unknown) => {
        return await http(false).post("/api/auth/register", body)
    },
    confirm: async (token:string) => {
        return await http(false).get(`/api/auth/confirm/${token}`)
    },
    resend: async (token:string) => {
        return await http(false).get(`/api/auth/resend/${token}`)
    },
    forgot: async (body: unknown) => {
        return await http(false).post("/api/auth/email/forgot", body)
    },
    reset: async (token:string, body: unknown) => {
        return await http(false).post(`/api/auth/email/reset/${token}`, body)
    },
}

const profile = {
    detail: async () => {
        return await http(true).get("/api/profile/detail")
    },
    activity: async () => {
        return await http(true).get("/api/profile/activity")
    },
    changePassword: async (body:unknown) => {
        return await http(true).post("/api/profile/password", body)
    },
    changeProfile: async (body:unknown) => {
        return await http(true).post("/api/profile/update", body)
    },
    upload: async (formData:unknown) => {
        const auth_token = localStorage.getItem('auth_token')
        const headerUpload = { 'Content-Type': 'multipart/form-data', "Authorization ": `Bearer ${auth_token}`}
        return await axios.create({ baseURL: `${import.meta.env.VITE_APP_BACKEND_URL}`, headers: headerUpload }).post("/api/profile/upload", formData)
    },
}

const home = {
    component: async () => {
        return await http(false).get("/api/home/component")
    },
    page: async () => {
        return await http(false).get("/api/home/page")
    },
    newsletter: async (data:unknown) => {
        return await http(false).post("/api/newsletter/send", data)
    },
}

const store = {
    list: async (params:unknown) => {
        return await http(true).get(`/api/shop/list?${params}`)
    },
    filter: async () => {
        return await http(true).get("/api/shop/filter")
    },
}

const order = {
    list: async (params:unknown) => {
        return await http(true).get(`/api/order/list?${params}`)
    },
    billing: async () => {
        return await http(true).get(`/api/order/initial`)
    },
    product: async () => {
        return await http(true).get(`/api/order/session`)
    },
    cancel: async (id:number) => {
        return await http(true).get(`/api/order/cancel/${id}`)
    },
    cartDetail: async (id:number) => {
        return await http(true).get(`/api/order/cart/${id}`)
    },
    cartAdd: async (id:number, data:unknown) => {
        return await http(true).post(`/api/order/cart/${id}`, data)
    },
    wishlist: async (id:number) => {
        return await http(true).get(`/api/order/wishlist/${id}`)
    },
    detail: async (id:number) => {
        return await http(true).get(`/api/order/detail/${id}`)
    },
    listReview: async (id:number) => {
        return await http(true).get(`/api/order/review/${id}`)
    },
    createReview: async (id:number, data:unknown) => {
        return await http(true).post(`/api/order/review/${id}`, data)
    },
    checkout: async (data:unknown) => {
        return await http(true).post(`/api/order/checkout`, data)
    },
}

export default {
    ping,
    getFile,
    expiredMessage,
    auth,
    profile,
    store,
    home,
    order
}