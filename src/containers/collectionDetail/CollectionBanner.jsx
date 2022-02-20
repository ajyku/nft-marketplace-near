import React, { useContext} from 'react'
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {displayHash} from "../../utils/Utils"
import CustomButton from "../../components/CustomButton"

import Web3Context from '../../context/Web3Context';

export default function CollectionBanner({ isOwner, metaData, isApproved, setIsApproved, totalNFTs }) {
  const { accounts, setApprovalForAll } = useContext(Web3Context);
  const { contractAddress, ownerAddress } = useParams();

  const handleApproval = async () => {
    setIsApproved(await setApprovalForAll(true, contractAddress));
  }

  return (
    <Grid container xs={12} md={4} sx={{display:"flex", flexDirection:"column", justifyContent: "center"}}>
      <img src={`https://ipfs.io/ipfs/${metaData?.image}`} alt="" style={{height: 300, objectFit: "cover"}}/>
      <h1 style={{fontSize: 40, fontWeight: 700}}>{metaData.name}</h1>
      <div style={{fontSize: 12, marginBottom: 24}}>by <span style={{padding: "2px 8px", background: "#e3f2fd", color:"#1976d2", marginLeft: 4, borderRadius: 12}}>{accounts && (accounts[0] == ownerAddress) ? "You" : displayHash(ownerAddress)}</span></div>
      {/* <h3 style={{marginTop: -16}}>{metaData.subtitle}</h3> */}
      <div>{metaData.description}</div>
      <div style={{fontWeight: "600", color: "#808080", marginTop: 16}}>{`${totalNFTs} items`}</div>
      {isOwner && <div style={{display:"inline-flex"}}>
        <CustomButton variant="outlined" onClick={handleApproval} style={{marginTop: 16}} color={isApproved ? "success":"error"}>{isApproved ? "Approved" : "Approve"}</CustomButton>
      </div>}
      {isOwner && !isApproved &&
        <div style={{background: "#ffebee", color: "#f44336", fontSize: 14, padding: 8, borderRadius: 4, margin:"8px 0px"}}>Approve once for sell/listing of its all NFTs to the marketplace.</div>
      }
    </Grid>
  )
}
