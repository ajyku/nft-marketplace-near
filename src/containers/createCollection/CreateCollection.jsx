/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useContext} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CustomButton from "../../components/CustomButton"

import Web3Context from "../../context/Web3Context";
import { formatEther } from '@ethersproject/units'
import { pinFileToIPFS, pinJSONToIPFS, unPin } from "../../config/axios";
import {toBn} from "evm-bn";

export default function CreateCollection() {
  const {getCollectionCreationPrice, createCollection, showAlert} = useContext(Web3Context)
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null);
  const [metaData, setMetaData] = useState({})
  const [cost, setCost] = useState()

  useEffect(() => {
    const getF = async () => {
      const cPrice = await getCollectionCreationPrice()
      setCost(formatEther(cPrice));
    }
    getF();
  }, [])

  function handleChange(e) {
    e.preventDefault()
    setMetaData({...metaData, [e.target.id]:e.target.value})
  }

  const fileSelectHandler = e => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setImageFile(file);
    };

    reader.readAsDataURL(file);
  };

  const handleCreateCollection = async () => {
    if(!imageFile || !metaData.hasOwnProperty("name") || !metaData.hasOwnProperty("symbol")) {
      showAlert("Required fields unavaiable!", "error")
      return
    }

    showAlert("Uploading File to IPFS", 'info', 1000);

    const added = await pinFileToIPFS(imageFile);
    showAlert("File Uploaded, uploading metadata", 'success', 1000);

    const { IpfsHash } = added.data;
    const newJson = {
        title: metaData.title,
        subtitle: metaData.subtitle,
        name: metaData.name,
        description: metaData.description,
        image: IpfsHash,
    }
    const finalHash = await pinJSONToIPFS({ ...metaData, image: IpfsHash });
    showAlert("Meta Data Uploaded! Please complete the transaction", 'success', 3000);

    const txn = await createCollection(metaData.name, metaData.symbol, finalHash.data.IpfsHash, toBn(cost.toString()));
    if (txn) {
        // console.log(txn);
        navigate("/myCollections")
    }
    else {
        showAlert("Failure, reverting changed", 'error', 3000);

        unPin(IpfsHash);
        unPin(finalHash.data.IpfsHash);
    }
  }
  
  return (
     <Grid container sx={{display: "flex", flexDirection:"column", alignItems: "center", padding: 3}}>
      <Grid  sx={{width: "70%", display: "flex", flexDirection:"column", justifyContent: "flex-start", paddingTop: 0}}>
        <h1 style={{fontSize: 40, fontWeight: 700, marginBottom: 32}}>Create a collection</h1>
        <div>* required field</div>
        <div style={{fontWeight: 700, marginTop: 24}}>Featured image*</div>
        <div style={{color: "#808080"}}>This image will be used for featuring your collection on the homepage, category pages, or other promotional areas. 600 x 400 recommended.</div>
        <div style={{width:"100%", display:"flex", flexDirection:"row", justifyContent: "flex-start", alignItems: "center"}}>
          <input
            accept="image/*"
            style={{display:"none"}}
            id="outlined-button-file"
            multiple
            type="file"
            name="image"
            onChange={fileSelectHandler}
          />
          <label htmlFor="outlined-button-file">
            <Grid container 
              sx={{
                width:"510px",
                height:"260px",
                marginTop:2,
                // background: "red",
                border: "3px #ccc dashed",
                borderRadius: 2,
                justifyContent:"center",
                alignItems:"center",
                ':hover': {
                  cursor: "pointer",
                  background: "#f0f0f0"
                }
              }}
            >
              {imageFile ? 
                <img 
                  width={500}
                  height={250}
                  src={!imageFile ? InsertPhotoIcon : URL.createObjectURL(imageFile)}
                  alt="Collection Image"
                  style={{objectFit: "cover", borderRadius: 8}}
                  loading="lazy"
                />
                :
                <InsertPhotoIcon color="disabled" sx={{width: 100, height: 100}}/>
              }
            </Grid>
          </label>
          {/* <div style={{marginLeft: 16}}>{imageFile && imageFile.name}</div> */}
        </div>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            id="name"
            label="Name*"
            variant="outlined"
            size="large"
            sx={{marginTop: 4}}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            multiline
            id="description"
            label="Description"
            variant="outlined"
            size="large"
            rows={3}
            sx={{marginTop: 4}}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id="symbol"
            label="Symbol (ETH)*"
            variant="outlined"
            size="large"
            sx={{marginTop: 4}}
            onChange={handleChange}
          />  
          <TextField
            fullWidth
            id="url"
            label="URL"
            variant="outlined"
            size="large"
            sx={{marginTop: 4}}
            onChange={handleChange}
          />
        </Grid>
        <div style={{marginTop: 32}}>
          <CustomButton
            component="span"
            color="primary"
            variant="contained"
            style={{marginRight: 16}}
            onClick={handleCreateCollection}
          >
            Create
          </CustomButton>
        </div>
      </Grid>
    </Grid>
  )
}
