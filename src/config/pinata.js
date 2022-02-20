const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.REACT_APP_API_KEY, process.env.REACT_APP_API_SECRET);
const options = {
    pinataMetadata: {
        name: "MyCustomName",
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};
export const uploadFile = (readableStreamForFile) => {
    return pinata.pinFileToIPFS(readableStreamForFile, options);
}

export const pinataImageUrl = "https://gateway.pinata.cloud/ipfs"
