import React, {useState, useEffect, useContext} from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CustomButton from "../components/CustomButton"
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {truncateString} from "../utils/Utils"
import SellIcon from '@mui/icons-material/Sell';
import {displayHash} from '../utils/Utils'

import { Link, useNavigate } from "react-router-dom";
import { getJSONfromHash } from "../config/axios";
import backgroundImg from '../assets/background.png'
import Web3Context from "../context/Web3Context";
import ExplorePageContext from "../context/ExplorePageContext";
import { utils } from "ethers";

export default function SaleNFTCard(props) {
  const navigate = useNavigate()
  const { tokenId, nftContract, price, royalty, creator, owner, isAuction, itemId, auction, accounts } = props
  const { setSelectedNFTtoBuy } = useContext(ExplorePageContext);
  const { tokenURI, createAuctionBid } = useContext(Web3Context);
  const [currentMetaData, setCurrentMetaData] = useState({});
  const [nftData, setNftData] = useState();
  const [bid, setBid] = useState(0);
  const [timeLeft, setTimeLeft] = useState(new Date());

  useEffect(() => {
    if (auction?.timeEnding) {
      const timer = setTimeout(() => {
          calculateTimeLeft(auction.timeEnding.toString());
      }, 60000);
    }
  });

  useEffect(() => {
    fetchMetaData();
  }, [tokenId]);

  const fetchMetaData = async () => {
    const nftData = {
        ...props
    }
    nftData["tokenURI"] = await tokenURI(tokenId, nftContract);
    nftData["metaData"] = (await getJSONfromHash(nftData.tokenURI)).data;
    setNftData(nftData);
    setCurrentMetaData(nftData.metaData);
    calculateTimeLeft(auction?.timeEnding.toString());
  }

  const calculateTimeLeft = (endTime) => {
    let currDate = Date.now();
    const actualDate = new Date(parseInt(endTime) * 1000);
    setTimeLeft(new Date(actualDate - currDate))
  };

  function handleBuy() {
    setSelectedNFTtoBuy(nftData);
    navigate(`/buyNFT`)
  }

  const handleBid = async () => {
    await createAuctionBid(itemId, bid);
    // reload [Not changes bid vale in the card. [ToDo] Need to correct]
    fetchMetaData();
  }

  const getLeftPeriod = () => {
    let value = ""
    const days = Math.floor(timeLeft / 86400000)
    const hrs =  timeLeft.getHours()
    const mins =  timeLeft.getMinutes()
    const secs = timeLeft.getSeconds()

    if (days > 0) {
      value = `${days} days`
    } else if (hrs > 0) {
      value = `${hrs} hrs`
    } else if (mins > 0) {
      value = `${mins} mins`
    } else if (secs > 0) {
      value = `${secs} secs`
    }
    return value
  }

  return (
    <Card 
      variant="outlined"
      sx={{ 
        width: 345, 
        minHeight: 300,
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
        <Typography gutterBottom variant="h7" component="div" sx={{fontWeight: 700}}>
          {truncateString(currentMetaData?.name, 50)}
        </Typography>
        <div style={{display:"flex",fontSize: 10 }}>Owned by <span style={{padding: "2px 8px", background: "#e3f2fd", color:"#1976d2", marginLeft: 8, borderRadius: 12}}>{accounts && (accounts[0] === owner) ? "You" : displayHash(owner)}</span></div>
        <div style={{width: "100%", display:"inline-flex", flexDirection:"row", justifyContent: "space-between", marginTop: 12}}>
          <div>
            <div style={{display: "inline-flex", alignItems: "center", fontSize: 14}}>
              <SellIcon disabled style={{fontSize: 18, color: "#808080"}}/>
              <div style={{paddingLeft: "4px"}}>{utils.formatEther(price)} ETH</div>
            </div>
          </div>
          <div style={{textAlign: "right", fontSize: 14}}>
            <div style={{fontSize: 12, padding: "2px 8px", border: "1px #f0f0f0 solid", borderRadius: 16, marginBottom: 8, background: "#f0f0f0", color: "#606060"}}>{isAuction ? "auction" : "direct buy"}</div>
            {isAuction && <div>Top Bid</div>}
            {isAuction && <div>{utils.formatEther(auction.highestBid)} ETH</div>}
            {isAuction ? <div style={{fontSize: 14}}>{`${getLeftPeriod()} left`}</div> : <div style={{height: 24}}>{""}</div>}
          </div>
        </div>
        
        {/* <Typography variant="body2" color="text.secondary">
          {currentMetaData?.description}
        </Typography> */}
      </CardContent>
      <CardActions style={{justifyContent: "flex-end", alignSelf: "flex-end"}}>
        {isAuction ? 
          <>
            <div style={{flex:1, display: "flex"}}>
              <TextField size="small" label="Bid value" onChange={(e) => setBid(e.target.value)} style={{width: "100%", paddingRight: 16, fontSize: 14}}>{bid}</TextField>
            </div>
            <CustomButton variant="contained" onClick={handleBid} size="small" sx={{padding: "4px 12px"}}>Place Bid</CustomButton>
          </>
          :
          <div style={{width:"100%", display:"inline-flex", justifyContent: "space-between", alignItems: "center"}}>
            {nftData && nftData.sold ? <div style={{padding: "2px 8px", background: "#ffebee", color:"#f44336", fontSize: 12, marginLeft: 8, borderRadius: 4}}>SOLD</div> : <div/>}
            <CustomButton variant="contained" onClick={handleBuy} size="small" sx={{padding: "4px 12px"}}>More</CustomButton>
          </div>
        } 
      </CardActions>
    </Card>
  )
}
