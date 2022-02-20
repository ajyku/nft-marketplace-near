import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { Link } from "react-router-dom";
import backgroundImg from '../assets/background.png'

export default function NFTCard({nftData, isOwner, accounts, isApproved}) {

  const processHash =(value) =>{
    if(!value) return null
    const _hash = `${value.substring(0,6)}...${value.slice(-4)}`
    return _hash
  }

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
      to={`/nft/${nftData?.contractAddress}/${nftData?.tokenURI}/${nftData?.ownerAddress}/${isApproved ? 1 : 0}/${nftData?.tokenId}`}
    >
      <CardMedia
        component="img"
        height={200}
        image={nftData?.metaData?.image?.length > 0 ? `https://ipfs.io/ipfs/${nftData?.metaData?.image}` : backgroundImg}
        alt="green iguana"
        
      />
      <CardContent style={{textAlign: "left"}}>
        <Typography gutterBottom variant="h6" component="div" sx={{fontWeight: 700}}>
          {nftData?.metaData?.name}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          {nftData?.metaData?.description}
        </Typography> */}
        <div style={{display:"flex",fontSize: 10, marginTop: 16}}>Owned by <span style={{padding: "2px 8px", background: "#e3f2fd", color:"#1976d2", marginLeft: 8, borderRadius: 12}}>{accounts && accounts[0] == nftData?.ownerAddress ? "You" : processHash(nftData?.ownerAddress)}</span></div>
      </CardContent>
    </Card>
  )
}
