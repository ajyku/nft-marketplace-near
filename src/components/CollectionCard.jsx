import React, {useState, useEffect, useContext} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {displayHash} from "../utils/Utils"

import { Link } from "react-router-dom";
import { getJSONfromHash } from "../config/axios";
import backgroundImg from '../assets/background.png'
import {truncateString} from "../utils/Utils"
import Web3Context from "../context/Web3Context";

export default function CollectionCard({metaData, metaDataHash, collection}) {
  const [currentMetaData, setCurrentMetaData] = useState({});
  const {accounts} = useContext(Web3Context)

  useEffect(() => {
    const fetchMetaData = async () => {
      if (metaDataHash) {
        const response = await getJSONfromHash(metaDataHash)
        setCurrentMetaData(response.data);
      }
    }
    fetchMetaData();
  }, [metaDataHash]);

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        width: 345, 
        minHeight: 350,
        margin: 2,
        textDecoration: "none",
        ':hover': {
          cursor: "pointer",
          boxShadow: 4
        }
      }}
      component={Link} 
      to={`/CollectionDetails/${collection?.contractAddress}/${collection?.metaDataHash}/${collection?.creator}`}
    >
      <CardMedia
        component="img"
        height={200}
        image={currentMetaData?.image?.length > 0 ? `https://ipfs.io/ipfs/${currentMetaData?.image}` : backgroundImg}
        alt="green iguana"
      />
      <CardContent style={{textAlign: "left"}}>
        <Typography gutterBottom variant="h6" component="div" sx={{fontWeight: 700}}>
          {currentMetaData?.name}
        </Typography>
        <div style={{fontSize: 12, marginBottom: 24}}>Created by <span style={{padding: "2px 8px", background: "#e3f2fd", color:"#1976d2", marginLeft: 4, borderRadius: 12}}>{accounts && accounts[0] == collection?.creator ? "You" : displayHash(collection?.creator)}</span></div>
        <Typography variant="body2" color="text.secondary">
          {truncateString(currentMetaData?.description, 100)}
        </Typography>
      </CardContent>
    </Card>
  )
}
