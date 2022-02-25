/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import Web3Context from "../../context/Web3Context";
import CollectionCard from "../../components/CollectionCard"
import {v4 as uuidv4} from "uuid"
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import CustomButton from "../../components/CustomButton"

export default function MyCollections() {
  const { isActive, getUserCollections } = useContext(Web3Context);
  const [userCollections, setUserCollections] = useState(undefined);
  
  useEffect(() => {
    if(!isActive){
      setTimeout(()=>getUserCollections().then(data => setUserCollections(data)), 10000)
    } else {
      getUserCollections().then(data => setUserCollections(data));
    }

  }, [])

  const ListOfUserCollections = () => {
    return (
      <Grid container >
        {userCollections.map((collection) => {
            return (<CollectionCard key={uuidv4()} metaDataHash={collection.metaDataHash} collection={collection} />);
        })}
      </Grid>
    );
  }

  return (
    <Grid container sx={{display: "flex", flexDirection:"column", alignItems: "center", padding: 2}}>
      <Grid  sx={{width: "70%", display: "flex", flexDirection:"column", justifyContent: "flex-start", paddingTop: 0}}>
        <div style={{padding: 16}}>
          <h1 style={{fontSize: 40, fontWeight: 700, marginBottom: 32}}>My Collections</h1>
          <div style={{marginBottom: 24, color: "#555", fontSize: 16}}>Create, curate, and manage collections of unique NFTs to share and sell.</div>
          <div>
            <CustomButton variant="contained" component={Link} to="/createCollection" >Create a collection</CustomButton>
          </div>
        </div>
        <div >
          {!userCollections ? 
            <CircularProgress style={{margin: 16}}/>
            :
            userCollections.length > 0 ?
              <ListOfUserCollections />
            :
              <div style={{padding: "16px 24px", color: "red"}}>No NFT. Create a new collection</div>
          }
        </div>
      </Grid>
    </Grid>
  )
}
