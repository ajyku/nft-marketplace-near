const axios = require("axios");
const instance = axios.create({
    baseURL: "https://api.pinata.cloud",
});
export const getHeader = () => {
    return {
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_JWT}`,
            "content-type": "application/json",
        },
    };
};
const getMultipartHeader = () => {
    return {
        headers: {
            pinata_api_key: process.env.REACT_APP_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_API_SECRET, "content-type": "multipart/form-data",
        },
    };
};
export const testAuthentication = () => {
    console.log("header: ", getHeader())
    const url = `/data/testAuthentication`;
    return instance
        .get(url,
            getHeader()
        )
        .then(function (response) {
            console.log(response);
            //handle your response here
        })
        .catch(function (error) {
            console.log(error);
            //handle error here
        });
};
export const pinFileToIPFS = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const url = `/pinning/pinFileToIPFS`;
    return instance.post(url, formData, getMultipartHeader())
}
export const pinJSONToIPFS = (json) => {
    const url = `/pinning/pinJSONToIPFS`;
    return instance.post(url, json, getHeader())

}
export const unPin = (hash) => {
    const url = `/pinning/unpin/${hash}`;
    return instance.delete(url, getHeader());
}
export const getJSONfromHash = (hash) => {
    return axios.get(`https://ipfs.io/ipfs/${hash}`);
}