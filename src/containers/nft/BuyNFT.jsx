/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
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
import ExplorePageContext from "../../context/ExplorePageContext";
import { utils } from "ethers";

export default function BuyNFT() {
  const { selectedNFTtoBuy } = useContext(ExplorePageContext);
  const { accounts, buyNFT, showAlert, createMarketItem, createMarketAuction} = useContext(Web3Context);
  const navigate = useNavigate()
  const [openSell, setOpenSell] = useState(false)
  const [saleType, setSaleType] = useState("fixed")
  const [salePrice, setSalePrice] = useState()
  const [noDays, setNoDays] = useState()

  useEffect(() => {
    if (!selectedNFTtoBuy) {
        navigate("/explore");
    }
  }, [selectedNFTtoBuy]);

  const { metaData, tokenId, price, royalty, creator, owner, seller, nftContract, itemId, sold } = selectedNFTtoBuy;
  
  const handleBuyNFT = async () => {
    await buyNFT(nftContract, itemId, price);
    navigate("/explore");
  }

  function handleChange(e) {
    if  (e.target.name == "amount") setSalePrice(e.target.value)
    if  (e.target.name == "duration") setNoDays(e.target.value)
  }

  async function handleListing() {
    if(saleType == "fixed") {
      if(!salePrice) {
        showAlert("Amount is missing", "error")
        return
      }

      await createMarketItem(nftContract, tokenId, salePrice)
      navigate('/')
    }

    if(saleType == "timed") {
      if(!salePrice) {
        showAlert("Amount is missing", "error")
        return
      }

      if(!noDays) {
        showAlert("Duration is missing", "error")
        return
      }

      await createMarketAuction(nftContract, tokenId, salePrice, noDays);
      navigate('/')
    }
  }

  return (
    <Grid container sx={{display: "flex", flexDirection:"column", alignItems: "center", padding: 2, marginTop: 6}}>
      <Grid  sx={{width: "70%", display: "flex", flexDirection:"row", justifyContent: "flex-start", paddingTop: 2}}>
        <img 
          width={500}
          minHeight={250}
          src={!metaData ? backgroundImg :`https://ipfs.io/ipfs/${metaData.image}`}
          alt="Collection Image"
          style={{objectFit: "cover", borderRadius: 8, border: "1px #e0e0e0 solid"}}
          loading="lazy"
        />
        <Grid container xs={12} md={6} sx={{padding: 1, marginLeft: 3, flexDirection: "column"}}>
          <div style={{fontSize: 12}}>Creator <span style={{padding: "2px 8px", background: "#e3f2fd", color:"#009688", marginLeft: 4, borderRadius: 12}}>{accounts[0] == creator ? "You" : displayHash(creator)}</span></div>
          <h1 style={{fontSize: 32, fontWeight: 600, marginBottom: 24}}>{metaData && metaData.name}</h1>
          { owner != "0x0000000000000000000000000000000000000000" ? 
            <div style={{fontSize: 12, marginBottom: 24}}>Owned by <span style={{padding: "2px 8px", background: "#e3f2fd", color:"#1976d2", marginLeft: 4, borderRadius: 12}}>{accounts[0] == owner ? "You" : displayHash(owner)}</span></div>
            :
            <div style={{fontSize: 12, marginBottom: 24}}>Seller <span style={{padding: "2px 8px", background: "#e3f2fd", color:"#1976d2", marginLeft: 4, borderRadius: 12}}>{accounts[0] == seller ? "You" : displayHash(seller)}</span></div>
          }
          <div style={{marginBottom: 16}}>{metaData && metaData.description}</div>
          {metaData.url && <a target="_blank" href={metaData.url}>{metaData.url}</a>}
          <div style={{marginBottom: 56}}/>
          <Stack direction="row" spacing={2} style={{marginBottom: 48}}>
            {metaData && metaData.attribute1 && <Chip label={metaData && metaData.attribute1} />}
            {metaData && metaData.attribute2 && <Chip label={metaData && metaData.attribute2} />}
            {metaData && metaData.attribute3 &&<Chip label={metaData && metaData.attribute3} />}
          </Stack>
          <div>
            <div style={{marginBottom: 16}}><span style={{fontWeight: 700, marginRight: 8}}>Price</span>{utils.formatEther(price)} ETH</div>
            <div><span style={{fontWeight: 700, marginRight: 8}}>Royalty</span>{utils.formatEther(royalty)} ETH</div>
          </div>
          <div style={{marginTop: 32}}>
            {!sold && <CustomButton
                component="span"
                color="primary"
                variant="contained"
                style={{marginRight: 24, padding: "8px 48px"}}
                onClick={handleBuyNFT}
            >
                Buy
            </CustomButton>}
          </div>
          <Dialog open={openSell} onClose={()=>setOpenSell(false)} >
            <DialogTitle>List item for sale</DialogTitle>
            <DialogContent style={{width: 400}}>
              <DialogContentText style={{marginBottom: 16}}>
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
