/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import Web3Context from "../../context/Web3Context";
import ExplorePageContext from "../../context/ExplorePageContext";
import {v4 as uuidv4} from "uuid"
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import SaleNFTCard from "../../components/SaleNFTCard"
import ListedNFTCard from "../../components/ListedNFTCard"

export default function Explore() {
  const { selectedNFTtoBuy, setSelectedNFTtoBuy } = useContext(ExplorePageContext);
  const { accounts, fetchMarketItems, fetchMyNFTs, fetchItemsCreated, startBidListening } = useContext(Web3Context);
  const [allCollections, setAllCollections] = useState(undefined);
  const [myItemsListed, setMyItemsListed] = useState(undefined);
  const [myOwnedItems, setMyOwnedItems] = useState(undefined);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    startBidListening();
    const fetch = async () => {
      const result = await fetchMarketItems()
      const collectionsArray = result[0];
      const auctionArray = result[1];
      const allCollectionsData = collectionsArray.map((e, index) => ({ collection: e, auction: auctionArray[index] }));

      setAllCollections(allCollectionsData);
      setMyItemsListed(await fetchItemsCreated());
      setMyOwnedItems(await fetchMyNFTs());
      setSelectedNFTtoBuy({});
    }
    fetch();
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
     <Grid container sx={{display: "flex", flexDirection:"column", alignItems: "center", padding: 3}}>
      <Grid  sx={{width: "70%", display: "flex", flexDirection:"column", justifyContent: "flex-start", paddingTop: 0}}>
        <h1 style={{fontSize: 40, fontWeight: 700, marginBottom: 32}}>Marketplace</h1>
        <Tabs value={tabValue} onChange={handleTabChange} >
          <Tab label="All Listed Items" sx={{fontSize: "16px", textTransform: "None", fontFamily: "Poppins", fontWeight: 700}}/>
          <Tab label="My Listed Items " sx={{fontSize: "16px", textTransform: "None", fontFamily: "Poppins", fontWeight: 700}}/>
          <Tab label="My Purchased Items" sx={{fontSize: "16px", textTransform: "None", fontFamily: "Poppins", fontWeight: 700}}/>
        </Tabs>
        <div style={{height: "1px", width: "100%", background: "#f0f0f0"}}/>
        <Grid container sx={{marginTop: 4}}>
            {/*All Listed Items for sale*/}
            {tabValue == 0 && (!allCollections ? 
              <CircularProgress style={{margin: 16}}/> 
              :
              allCollections.length > 0 ?
                <Grid container >
                  {allCollections.map((data) => {
                      return (<SaleNFTCard key={uuidv4()} {...(data.collection)} auction={data.auction} accounts={accounts}/>);
                  })}
                </Grid>
              :
                <div style={{padding: 16, color: "red"}}>No NFT</div>
            )}
            {/*My Listed Items for sale*/}
            {tabValue == 1 && (!myItemsListed ? 
              <CircularProgress style={{margin: 16}}/> 
              :
              myItemsListed.length > 0 ?
                <Grid container >
                  {myItemsListed.map((collection) => {
                      return (<ListedNFTCard key={uuidv4()} {...collection} accounts={accounts}/>);
                  })}
                </Grid>
              :
                <div style={{padding: 16, color: "red"}}>No NFT</div>
            )}
            {/*My purchased NFTs*/}
            {tabValue == 2 && (!myOwnedItems ? 
              <CircularProgress style={{margin: 16}}/> 
              :
              myOwnedItems.length > 0 ?
                <Grid container >
                    {myOwnedItems.map((collection) => {
                        return (<SaleNFTCard key={uuidv4()} {...collection} accounts={accounts}/>);
                    })}
                </Grid>
              :
                <div style={{padding: 16, color: "red"}}>No NFT</div>
            )}
        </Grid>
      </Grid>
    </Grid>
  )
}
