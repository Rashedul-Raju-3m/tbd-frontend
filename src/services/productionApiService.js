import axios from "axios";

export const getSelectDataWithParam = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: import.meta.env.VITE_API_GATEWAY_URL+value.url,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        params : value.param
    })
        .then(res => {
            data = res.data.data
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const getDataWithParam = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        params : value.param
    })
        .then(res => {
            data = res.data
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const getDataWithoutParam = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        }
    })
        .then(res => {
            data = res.data.data
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const createData = async (value) => {
    let data = []
    await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        data : value.data
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};
export const createDataWithFile = async (value) => {
    let data = []
    await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `multipart/form-data`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        data : value.data
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const editData = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const updateData = async (value) => {
    let data = []
    await axios({
        method: value.url==='inventory/config-update'?'POST':'PATCH',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": value.url==='inventory/config-update'?`multipart/form-data`:`application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        data : value.data
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const inlineUpdateData = async (value) => {
    let data = []
    await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value.url}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
        data : value.data
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const showData = async (value) => {
    let data = []
    await axios({
        method: 'get',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};

export const deleteData = async (value) => {
    let data = []
    await axios({
        method: 'delete',
        url: `${import.meta.env.VITE_API_GATEWAY_URL+value}`,
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Access-Control-Allow-Origin": '*',
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "X-Api-User": JSON.parse(localStorage.getItem('user')).id
        },
    })
        .then(res => {
            data = res
        })
        .catch(function (error) {
            console.log(error)
        })
    return data
};