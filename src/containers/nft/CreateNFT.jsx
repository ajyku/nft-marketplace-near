/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect, useContext} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {v4 as uuidv4} from "uuid"
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CustomButton from "../../components/CustomButton"

import Web3Context from "../../context/Web3Context";
import { getJSONfromHash, pinFileToIPFS, pinJSONToIPFS, unPin } from '../../config/axios';

export default function CreateNFT() {
  const {getUserCollections, mint, showAlert} = useContext(Web3Context)
  const { metaDataHash, name, hash } = useParams();
  const navigate = useNavigate()
  const [userCollections, setUserCollections] = useState(undefined);
  const [metaData, setMetaData] = useState({})
  const [imageFile, setImageFile] = useState(null);
  // const [currentMetaData, setCurrentMetaData] = useState({});
  const [menuData, setMenuData] = useState([])
  const [contractAddress, setContractAddress] = useState(null)

  useEffect(() => {
    getUserCollections().then(data => {
      // console.log("data", data)
      setUserCollections(data)
      actionMenuItems(data)
    });
  }, [])

  // useEffect(()=>{
  //   console.log("menuData", menuData)
  // },[menuData])

  // console.log("metaDataHash", metaDataHash, name, hash)
  
  // useEffect(() => {
  //   const fetchMetaData = async () => {
  //     if (metaDataHash) {
  //       const response = await getJSONfromHash(metaDataHash)
  //       setCurrentMetaData(response.data);
  //     }
  //   }
  //   fetchMetaData();
  // }, [metaDataHash]);

  const selectCollection = (event) => {
    setContractAddress(event.target.value);
  };

  // const jsonMetaData = async (_metaDataHash) => {
  //     if (_metaDataHash) {
  //       const response = await getJSONfromHash(_metaDataHash)
  //       console.log("jsonMetaData", response.data.name)
  //       return response.data.name
  //     }
  //     return null
  //   }

  function actionMenuItems(list) {
    if(!list) return
    list.map(async (collection) => {
      getJSONfromHash(collection.metaDataHash)
        .then(resp=>{
          // console.log("getJSONfromHash", resp, menuData)
          setMenuData((prevState)=>[...prevState, [collection.contractAddress, resp.data.name ]])
        })
    })
  }

  function handleChange(e) {
    e.preventDefault()
    if(e.target.id == "royalty") {
      let value = e.target.value.replace(/[^0-9]+/g, "");
      if (parseInt(value) > 20) {
        showAlert("Royalty cannot exceed 20%", 'error');
        value = "20"
      }
      setMetaData({...metaData, [e.target.id]: value})
    } else {
      setMetaData({...metaData, [e.target.id]:e.target.value})
    }
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

  function validate() {
    if(!imageFile) return false
    if(!metaData.hasOwnProperty("name")) return false
    if(!contractAddress) return false
    return true
  }

  const createNFT = async () => {
    if(!validate()) {
      showAlert("Required fields unavaiable!", "error")
      return
    }

    showAlert("Uploading File to IPFS", 'info', 1000);
    const added = await pinFileToIPFS(imageFile);
    showAlert("File Uploaded, uploading metadata", 'success', 1000);

    const { IpfsHash } = added.data;
    const finalHash = await pinJSONToIPFS({ ...metaData, image: IpfsHash });
    const txn = await mint(finalHash.data.IpfsHash, metaData.royalty, contractAddress);
    if (txn) {
        // console.log(txn);
        navigate("/userCollections")
    }
    else {
        unPin(IpfsHash);
        unPin(finalHash.data.IpfsHash);
    }
  }

  return (
    <Grid container sx={{display: "flex", flexDirection:"column", alignItems: "center", padding: 4}}>
      <Grid  sx={{width: "70%", display: "flex", flexDirection:"column", justifyContent: "flex-start", paddingTop: 0}}>
        <h1 style={{fontSize: 40, fontWeight: 700, marginBottom: 32}}>Create new NFT</h1>
        <div>* required field</div>
        <div style={{fontWeight: 700, marginTop: 24}}>Featured image</div>
        <div style={{color: "#808080"}}>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</div>
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
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
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
            required
            fullWidth
            id="name"
            label="Name"
            variant="outlined"
            sx={{marginTop: 4}}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            multiline
            id="description"
            label="Description"
            variant="outlined"
            sx={{marginTop: 4}}
            onChange={handleChange}
            rows={3}
          />
          <TextField
            fullWidth
            id="url"
            label="URL"
            variant="outlined"
            sx={{marginTop: 4}}
            onChange={handleChange}
          />
          <FormControl fullWidth sx={{marginTop: 4}}>
            <InputLabel id="collection">Collection*</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="collection"
              value={!contractAddress ? "" : contractAddress}
              label="Collection"
              onChange={selectCollection}
            >
              { menuData.map(item => {
                return <MenuItem key={uuidv4()} value={item[0]}>{item[1]}</MenuItem>
              })}
            </Select>
          </FormControl>
          {/* <TextField
            disabled
            fullWidth
            id="collection"
            label="Collection"
            variant="outlined"
            sx={{marginTop: 4}}
            value={name}
          /> */}
          <TextField
            fullWidth
            id="royalty"
            label="Royalty (%)"
            variant="outlined"
            sx={{marginTop: 4}}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id="attribute1"
            label="Attribute 1"
            variant="outlined"
            sx={{marginTop: 4}}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id="attribute2"
            label="Attribute 2"
            variant="outlined"
            sx={{marginTop: 4}}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id="attribute3"
            label="Attribute 3"
            variant="outlined"
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
            onClick={createNFT}
          >
            Create
          </CustomButton>
        </div>
      </Grid>
    </Grid>
  )
}
