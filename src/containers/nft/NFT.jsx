/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import backgroundImg from '../../assets/background.png'
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {displayHash} from "../../utils/Utils"
import CustomButton from "../../components/CustomButton"

import Web3Context from '../../context/Web3Context';
import { getJSONfromHash } from '../../config/axios';

export default function NFT() {
  const {account, accounts, showAlert, createMarketItem, createMarketAuction} = useContext(Web3Context)
  const { tokenId, tokenURI, contractAddress, ownerAddress, approved } = useParams();
  const navigate = useNavigate()
  const [nFTData, setNFTData] = useState()
  const [openSell, setOpenSell] = useState(false)
  const [saleType, setSaleType] = useState("fixed")
  const [price, setPrice] = useState()
  const [noDays, setNoDays] = useState()

  useEffect(() =>  {
    async function fn() {
      const data = await getJSONfromHash(tokenURI)
      setNFTData(data.data)
    }
    fn()
  },[])

  function handleChange(e) {
    if  (e.target.name == "amount") setPrice(e.target.value)
    if  (e.target.name == "duration") setNoDays(e.target.value)
  }

  async function handleListing() {
    if(saleType == "fixed") {
      if(!price) {
        showAlert("Amount is missing", "error")
        return
      }

      await createMarketItem(contractAddress, tokenId, price)
      navigate('/')
    }

    if(saleType == "timed") {
      if(!price) {
        showAlert("Amount is missing", "error")
        return
      }

      if(!noDays) {
        showAlert("Duration is missing", "error")
        return
      }

      await createMarketAuction(contractAddress, tokenId, price, noDays);
      navigate('/')
    }
  }

  return (
    <Grid container sx={{display: "flex", flexDirection:"column", alignItems: "center", padding: 2, }}>
      <Grid  sx={{width: "70%", display: "flex", flexDirection:"row", justifyContent: "flex-start", paddingTop: 2}}>
        <img 
          width={500}
          minHeight={250}
          src={!nFTData ? backgroundImg :`https://ipfs.io/ipfs/${nFTData.image}`}
          alt="Collection Image"
          style={{objectFit: "cover", borderRadius: 8, border: "1px #e0e0e0 solid"}}
          loading="lazy"
        />
        <Grid container xs={12} md={6} sx={{padding: 1, marginLeft: 3, flexDirection: "column"}}>
          <h1 style={{fontSize: 32, fontWeight: 600, marginBottom: 24}}>{nFTData && nFTData.name}</h1>
          <div style={{fontSize: 12, marginBottom: 24}}>Owned by <span style={{padding: "2px 8px", background: "#e3f2fd", color:"#1976d2", marginLeft: 4, borderRadius: 12}}>{accounts && accounts[0] == ownerAddress ? "You" : displayHash(ownerAddress)}</span></div>
          <div style={{marginBottom: 16}}>{nFTData && nFTData.description}</div>
          {nFTData?.url && <a target="_blank" href={nFTData?.url}>{nFTData?.url}</a>}
          <div style={{marginBottom: 56}}/>
          <Stack direction="row" spacing={2} style={{marginBottom: 48}}>
            {nFTData && nFTData.attribute1 && <Chip label={nFTData && nFTData.attribute1} />}
            {nFTData && nFTData.attribute2 && <Chip label={nFTData && nFTData.attribute2} />}
            {nFTData && nFTData.attribute3 &&<Chip label={nFTData && nFTData.attribute3} />}
          </Stack>
          <div>
            {accounts[0] == ownerAddress &&  
              <div>
                <CustomButton
                  disabled = {approved != 1}
                  component="span"
                  color="primary"
                  variant="contained"
                  style={{marginRight: 24, padding: "8px 48px"}}
                  onClick={()=>setOpenSell(true)}
                >
                  Sell
                </CustomButton>
                {accounts[0] == ownerAddress && approved != 1 && <div style={{background: "#ffebee", color: "#f44336", fontSize: 14, padding: 8, borderRadius: 4, marginTop: 16}}>
                  The collection of this NFT, has not been approved yet. Approve the collection once for sell/listing of its all NFTs to the marketplace.
                </div>}
              </div>
            }
          </div>
          <Dialog open={openSell} onClose={()=>setOpenSell(false)} >
            <DialogTitle>List item for sale</DialogTitle>
            <DialogContent style={{width: 400}}>
              <DialogContentText style={{marginBottom: 16}}>
                {nFTData && nFTData.name}
              </DialogContentText>
              <FormControl style={{marginBottom: 8}}>
                <FormLabel id="demo-radio-buttons-group-label">Type</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={saleType}
                  onChange={(e)=>setSaleType(e.target.value)}
                >
                  <FormControlLabel value="fixed" control={<Radio />} label="Fixed Price" />
                  <FormControlLabel value="timed" control={<Radio />} label="Timed Auction" />
                </RadioGroup>
              </FormControl>
              <TextField
                autoFocus
                margin="dense"
                name="amount"
                label="Amount in ETH (Aurora)"
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />
              {saleType == "timed" && <TextField
                autoFocus
                margin="dense"
                name="duration"
                label="Duration (Nos. of days)"
                type="number"
                fullWidth
                variant="standard"
                onChange={handleChange}
              />}
            </DialogContent>
            <DialogActions style={{marginBottom: 16, marginRight: 16, marginTop: 8}}>
              <CustomButton onClick={()=>setOpenSell(false)}>Cancel</CustomButton>
              <CustomButton onClick={handleListing} variant="outlined">Complete listing</CustomButton>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  )
}
