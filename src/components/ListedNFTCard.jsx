import React, {useState, useEffect, useContext} from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CustomButton from "../components/CustomButton"
import Typography from '@mui/material/Typography';
import {displayHash} from '../utils/Utils'

import { useNavigate } from "react-router-dom";
import { getJSONfromHash } from "../config/axios";
import backgroundImg from '../assets/background.png'
import Web3Context from "../context/Web3Context";

export default function ListedNFTCard(props) {
  const { tokenId, nftContract, price, royalty, creator, owner, itemId, accounts } = props
  const navigate = useNavigate()
  const { tokenURI, unlistItem } = useContext(Web3Context);
  const [currentMetaData, setCurrentMetaData] = useState({});
  const [nftData, setNftData] = useState();

  useEffect(() => {
    const fetchMetaData = async () => {
      const nftData = {
          ...props
      }
      nftData["tokenURI"] = await tokenURI(tokenId, nftContract);
      nftData["metaData"] = (await getJSONfromHash(nftData.tokenURI)).data;
      setNftData(nftData);
      setCurrentMetaData(nftData.metaData);
    }
    fetchMetaData();
  }, [tokenId]);

  const handleUnlist = async () => {
    if (await unlistItem(itemId)) {
        navigate("/explore")
    }
  }

  return (
    <Card 
      variant="outlined"
      sx={{ 
        width: 345, 
        minHeight: 350,
        margin: 2,
      }} 
    >
      <div style={{display:"flex",fontSize: 10, padding: "8px 16px", alignItems: "center" }}>Creator <span style={{padding: "2px 8px", background: "#e0f2f1", color:"#009688", marginLeft: 8, borderRadius: 12}}>{accounts && (accounts[0] === creator) ? "You" : displayHash(creator)}</span></div>
      <CardMedia
        component="img"
        height={200}
        image={nftData?.metaData?.image?.length > 0 ? `https://ipfs.io/ipfs/${currentMetaData?.image}` : backgroundImg}
        alt="green iguana"
      />
      <CardContent style={{textAlign: "left"}}>
        <Typography gutterBottom variant="h6" component="div" sx={{fontWeight: 700}}>
          {currentMetaData?.name}
        </Typography>
        <div style={{display:"flex",fontSize: 10 }}>Owned by <span style={{padding: "2px 8px", background: "#e3f2fd", color:"#1976d2", marginLeft: 8, borderRadius: 12}}>{accounts && (accounts[0] === owner) ? "You" : displayHash(owner)}</span></div>
        {/* <Typography variant="body2" color="text.secondary">
          {currentMetaData?.description}
        </Typography> */}
      </CardContent>
      <CardActions style={{flexDirection: "row", justifyContent: "space-between"}}>
        {nftData && nftData.sold ? <div style={{padding: "2px 8px", background: "#ffebee", color:"#f44336", fontSize: 12, marginLeft: 8, borderRadius: 4, marginTop: 12}}>SOLD</div> : <div/>}
        {accounts && (accounts[0] === owner || accounts[0] === creator) && (nftData && !nftData.sold) && <CustomButton variant="contained" onClick={handleUnlist} size="small" sx={{padding: "4px 12px"}}>Unlist</CustomButton>} 
      </CardActions>
    </Card>
  )
}
