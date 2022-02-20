import React, { useState, createContext, useEffect } from "react";
import FactoryAbi from '../abi/FactoryABI.json';
import NftABI from '../abi/NftABI.json';
import MarketPlaceABI from '../abi/MarketPlaceABI.json';
import { factoryContractAddress, nftMarketplaceAddress } from "../config/contractAddress";
import { ethers, Contract, utils } from 'ethers';

import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import { hooks, metaMask } from '../connectors/metaMask'
import signerConfig from "../config/metaMask"

const Web3Context = createContext();

const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider, useENSNames } = hooks

export const Web3Provider = (props) => {
  const [account, setAccount] = useState();
  const [evmProvider, setEvmProvider] = useState();
  const [isApiConnected, setIsApiConnected] = useState();
  const [signer, setSigner] = useState();
  const functionsToExport = {};

  const [alert, setAlert] = useState(null)

  const chainId = useChainId()
  const accounts = useAccounts()
  const error = useError()
  const isActivating = useIsActivating()
  const isActive = useIsActive()
  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  useEffect(()=>{
      console.log("Init Web3Context", isActive, provider)
  },[])

  useEffect(() => {
    async function fn() {
      if(isActive){
        const _signer = await provider.getSigner()
        setSigner(_signer)
        setEvmProvider(provider)
      } else {
        setSigner()
        setEvmProvider()
      }
    }
    fn()
  },[isActive, provider])

  useEffect(()=>console.log(error),[error])

  functionsToExport.setup = async (hash, provider, wallet) => {
    setAccount(hash)
    setEvmProvider(provider)
    if(provider != undefined){
      const _signer = await provider.getSigner()
      setSigner(_signer)
    } else {
      setSigner(null)
    }
  }

  functionsToExport.setupSigner = async () => {
    if(!isActive) {
      if(!isActivating && (metaMask instanceof WalletConnect || metaMask instanceof Network)) {
        metaMask.activate(signerConfig.aurora_testnet.chainId)
      } else {
        metaMask.activate(signerConfig.aurora_testnet)
      }
    } else {
      showAlert('Wallet is already connected', 'info')
    //   if(isActive) metaMask.deactivate()
    }  
  }

  const checkSigner = async () => {
    if (!signer) {
        await functionsToExport.setupSigner();
    } else {
      //
    }
    return true;
  }

  const showAlert = (message, type, timeout) => {
    setAlert({message, type, timeout})
    setTimeout(()=>{
      setAlert(null)
    },timeout)
  }

  const showTransactionProgress = async (result) => {
      showAlert('Transaction Initiated!', 'info', 2000)
      let completeResult, receipt;
      try {
          completeResult = await Promise.resolve(result);
      }
      catch (e) {
          showAlert(`Transaction Failed! ${e.toString()}`, "error", 2000);
          return false;
      }
      showAlert(`Transaction Sent! your hash is: ${completeResult.hash}`, "success", 6000);
      try {
          receipt = await completeResult.wait();
      }
      catch (e) {
          showAlert(`Transaction Failed! ${e.toString()}`, "error", 2000);
          return false;
      }

      if (receipt.status === 1) {
          showAlert(`Transaction Success!`, "success", 2000);

      }
      else {
          showAlert(`Transaction Failed!`, "error", 2000);
      }
      return receipt;

  }

  functionsToExport.totalCollections = async () => {
    showAlert('Transaction Initiated!', 'success', 2000)
    // await checkSigner();
    const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
    const result = await factoryContract.totalCollections();
    return result;
  }

  functionsToExport.getCollectionCreationPrice = async () => {
    // await checkSigner();
    // console.log(FactoryAbi)
    // console.log(signer);
    const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
    // console.log(factoryContract);
    const result = await factoryContract.getPrice();
    // console.log(result);
    return result
  }

  //Title,Description and Image
  functionsToExport.createCollection = async (name, symbol, metadata, creationValue) => {
      // await checkSigner();
      // console.log(name, metadata, symbol, creationValue);
      // console.log(metadata);
      // console.log(symbol);
      // console.log(creationValue);
      const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
      return (await showTransactionProgress(factoryContract.createCollection(name, symbol, metadata, { value: creationValue })));

  }

  functionsToExport.getUserCollections = async () => {
    await checkSigner();
    const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
    const result = await factoryContract.getUserCollections();
    // console.log(result);
    return (result);
  }

  functionsToExport.totalCollections = async () => {
    // await checkSigner();
    const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
    const result = await factoryContract.totalCollections();
    return result;
    // console.log(result);
  }

  functionsToExport.getCollections = async (startIndex, endIndex) => {
    // await checkSigner();
    const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
    const result = await factoryContract.getCollectionsPaginated(startIndex, endIndex);
    return result;
    // console.log(result);
  }

  //NFT functions
  functionsToExport.mint = async (metadata, royaltyPercentage, contractAddress) => {
      // await checkSigner();
      const nftContract = new Contract(contractAddress, NftABI, signer);
      return (await showTransactionProgress(nftContract.mint(metadata, royaltyPercentage)));
  }

  functionsToExport.tokenURI = async (tokenID, contractAddress) => {
      const nftContract = new Contract(contractAddress, NftABI, signer);
      const result = await nftContract.tokenURI(tokenID);
      // console.log(result);
      return result;
  }

  functionsToExport.getTokenRoyalty = async (tokenID, contractAddress) => {
      // await checkSigner();
      const nftContract = new Contract(contractAddress, NftABI, signer);
      const result = await nftContract.getTokenRoyalty(tokenID);
      console.log(result);
  }

  functionsToExport.totalSupply = async (contractAddress) => {
      // await checkSigner();
      const nftContract = new Contract(contractAddress, NftABI, signer);
      const result = await nftContract.totalSupply();

      // console.log(result);
      return result;
  }

  functionsToExport.balanceOf = async (userAddress, contractAddress) => {
      const nftContract = new Contract(contractAddress, NftABI, signer);
      const result = await nftContract.balanceOf(userAddress);
      return result;
      // console.log(result);
  }

  functionsToExport.tokenByIndex = async (contractAddress, index) => {
      const nftContract = new Contract(contractAddress, NftABI, signer);
      const result = await nftContract.tokenByIndex(index);
      console.log(result);
  }

  functionsToExport.tokenOfOwnerByIndex = async (ownerAddress, index, contractAddress) => {
      // await checkSigner();
      const nftContract = new Contract(contractAddress, NftABI, signer);
      const result = await nftContract.tokenOfOwnerByIndex(ownerAddress, index);
      // console.log(result);
      return result;
  }

  functionsToExport.setApprovalForAll = async (bool, contractAddress) => {
      const nftContract = new Contract(contractAddress, NftABI, signer);
      return (await showTransactionProgress(nftContract.setApprovalForAll(nftMarketplaceAddress, bool)));
  }

  functionsToExport.isApprovedForAll = async (userAddress, contractAddress) => {
      const nftContract = new Contract(contractAddress, NftABI, signer);
      //operator address is marketplace contract address
      const result = await nftContract.isApprovedForAll(userAddress, nftMarketplaceAddress);
      // console.log(result);
      return result;
  }

  functionsToExport.createMarketItem = async (NFTContractAddress, tokenID, price) => {
      const etherPrice = utils.parseEther(price);
      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      return (await showTransactionProgress(marketPlaceContract.createMarketItem(NFTContractAddress, tokenID, etherPrice)));
  }

  //returns all unsold items as array of structs
  functionsToExport.fetchMarketItems = async () => {
      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      const result = await marketPlaceContract.fetchMarketItems();
      // console.log(result);
      return result;
  }

  functionsToExport.fetchItemsCreated = async () => {
      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      const result = await marketPlaceContract.fetchItemsCreated();
      return result;
  }

  functionsToExport.fetchMyNFTs = async () => {
      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      const result = await marketPlaceContract.fetchMyNFTs();
      return result;

  }

  functionsToExport.buyNFT = async (NFTContractAddress, itemId, nftPrice) => {

      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      return (await showTransactionProgress(marketPlaceContract.createMarketSale(NFTContractAddress, itemId, { value: nftPrice })));
  }

  functionsToExport.unlistItem = async (itemId) => {
      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      return (await showTransactionProgress(marketPlaceContract.unlistItem(itemId)));
  }

  functionsToExport.createMarketAuction = async (NFTContractAddress, tokenId, floorPrice, auctionDays) => {
      const etherPrice = utils.parseEther(floorPrice);

      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      return (await showTransactionProgress(marketPlaceContract.createMarketAuction(NFTContractAddress, tokenId, etherPrice, auctionDays)));
  }

  functionsToExport.createAuctionBid = async (itemId, bidAmount) => {
      const etherPrice = utils.parseEther(bidAmount);
      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      return (await showTransactionProgress(marketPlaceContract.createAuctionBid(itemId, { value: etherPrice })));
  }

  functionsToExport.createAuctionSale = async (NFTContractAddress, itemId) => {
      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      return (await showTransactionProgress(marketPlaceContract.createAuctionSale(NFTContractAddress, itemId)));
  }
  //Only bids where user is highest bidder are visible through this
  functionsToExport.fetchUserBids = async () => {
      const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
      const result = await marketPlaceContract.fetchUserBids();
      console.log(result);
  }
  functionsToExport.startBidListening = async (onBidUpdate) => {
        // const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        // marketPlaceContract.on("MarketItemBid", (a, b, c) => {
        //     console.log(a);
        //     console.log(b);
        //     console.log(c);
        // })


    }

  return (<Web3Context.Provider value={{ isActive, account, accounts, evmProvider, alert, showAlert, ...functionsToExport }}>
        {props.children}
    </Web3Context.Provider>)
}

export default Web3Context;

