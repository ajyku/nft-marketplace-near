/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import CollectionBanner from './CollectionBanner'
import NFTContainer from "./NFTContainer"

import Web3Context from '../../context/Web3Context';
import { getJSONfromHash } from '../../config/axios';

export default function CollectionDetail() {
  const { account, accounts, totalSupply, balanceOf, tokenOfOwnerByIndex, tokenURI, isApprovedForAll } = useContext(Web3Context)
  const { metaDataHash, contractAddress, ownerAddress } = useParams();
  const [currentMetaData, setCurrentMetaData] = useState({});
  const [totalNFTs, setTotalNFTs] = useState(-1);
  const [NFTDetails, setNFTDetails] = useState()
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      const response = parseInt((await balanceOf(ownerAddress, contractAddress)).toString());
      setTotalNFTs(response);
    }
    const checkApproval = async () => {
      setIsApproved(await isApprovedForAll(ownerAddress, contractAddress));
    }
    if (contractAddress) {
      checkApproval();
      fetchNFTs();
    }
  }, [contractAddress])

  useEffect(() => {
    const fetchMetaData = async () => {
      if (metaDataHash) {
        const response = await getJSONfromHash(metaDataHash)
        setCurrentMetaData(response.data);
      }
    }
    fetchMetaData();
  }, [metaDataHash]);

  useEffect(() => {
    const fetchNFTData = async () => {
      if (totalNFTs < 0) {
          return;
      }
      let nfts = [];
      for (var i = 0; i < totalNFTs; i++) {
        const nftData = {
            ownerAddress: ownerAddress,
            contractAddress: contractAddress,
            tokenId: parseInt((await tokenOfOwnerByIndex(ownerAddress, i, contractAddress)).toString()),
        }
        nftData["tokenURI"] = await tokenURI(nftData.tokenId, contractAddress);
        nftData["metaData"] = (await getJSONfromHash(nftData.tokenURI)).data;
        nfts.push(nftData);
      }
      setNFTDetails(nfts);
    }

    fetchNFTData();
  }, [totalNFTs]);

  return (
    <Grid container sx={{display: "flex", justifyContent: "center", paddingTop: 2}}>
      <Grid container xs={12} md={10} sx={{justifyContent: "center", paddingTop: 2}}>
        <CollectionBanner totalNFTs={totalNFTs} metaData={currentMetaData} isApproved={isApproved} setIsApproved={setIsApproved} isOwner={accounts && (ownerAddress == accounts[0]) }/>
        <div style={{height: 1, width: "100%", background: "#f0f0f0", margin: "32px 0px"}}/>
        <NFTContainer isApproved={isApproved} metaDataHash={metaDataHash} nFTDetails={NFTDetails} ownerAddress={ownerAddress} accounts={accounts} totalNFTs={totalNFTs}/>
      </Grid>
    </Grid>
  )
}
