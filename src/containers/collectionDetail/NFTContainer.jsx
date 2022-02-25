import React from 'react'
import { Link} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import CustomButton from '../../components/CustomButton';
import NFTCard from "../../components/NFTCard"
import {v4 as uuidv4} from "uuid"
import { ContactlessOutlined } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

export default function NFTContainers({metaDataHash, nFTDetails, ownerAddress, accounts, isApproved, totalNFTs}) {
  const isOwner = accounts && ownerAddress == accounts[0]

  return (
    <Grid container sx={{display:"flex", flexDirection:"column", justifyContent: "center", marginTop: 0}}>
      {isOwner && <div style={{marginLeft: 16, marginBottom: 16}}>
        <CustomButton variant="contained" component={Link} to={`/createNFT`}>New NFT</CustomButton>
      </div>}
      {nFTDetails != undefined && totalNFTs != -1 ? 
        (nFTDetails.length > 0 ?
          <Grid container xs={12} md={10}>
            {nFTDetails.map(nftData => {
              return (<NFTCard key={uuidv4()} nftData={nftData} isApproved={isApproved} ownerAddress={ownerAddress} accounts={accounts}/>)
            })}
          </Grid>
          :
          <div style={{padding: "16px 24px", color: "red"}}>No NFT</div>
          )
        :
        <div style={{flex:1, display:"flex", padding: 48}}>
          <CircularProgress/>
        </div>
      }
    </Grid>
  )
}
