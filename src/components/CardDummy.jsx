import React, {useState} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import backgroundImg from '../assets/background.png'

export default function CollectionCardDummy() {
  const [currentMetaData, setCurrentMetaData] = useState({});

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        maxWidth: 345, 
        minHeight: 350,
        margin: 2,
        textDecoration: "none",
      }}
    >
      <CardMedia
        component="img"
        height={200}
        image={currentMetaData?.image?.length > 0 ? `https://ipfs.io/ipfs/${currentMetaData?.image}` : backgroundImg}
        alt="green iguana"
      />
      <CardContent style={{textAlign: "left"}}>
        <Typography gutterBottom variant="h6" component="div" sx={{fontWeight: 700, background: "#f0f0f0"}}/>
        <div style={{fontSize: 12, marginBottom: 16, background: "#f0f0f0", width: 200, height: 25}}></div>
        <div style={{fontWeight: 700, background: "#f0f0f0", width: 300, height: 50}}/>
      </CardContent>
    </Card>
  )
}
