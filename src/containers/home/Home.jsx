/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import CustomButton from "../../components/CustomButton"
import HomeImage from "../../assets/opensea_img.jpeg"
import NFTImg from "../../assets/nft.svg"
import CollectionImg from "../../assets/collection.svg"
import WalletImg from "../../assets/wallet.svg"
import SaleImg from "../../assets/sale.svg"
import Aurora from "../../assets/aurora.svg"
import Near from "../../assets/near.svg"
import Solidity from "../../assets/solidity1.png"
import Ethers from "../../assets/ethers.svg"
import Ethereum from "../../assets/ethereum.png"
import Pinata from "../../assets/pinata.svg"
import Ipfs from "../../assets/ipfs.svg"
import Reactjs from "../../assets/react.svg"
import Metamask from "../../assets/metamask.svg"
import Mui from "../../assets/mui.svg"

import "./Home.css"

const item = (img, title, text) => {
  return (
    <div style={{width: "22%", textAlign: "center", padding: "0px 32px"}}>
      <img 
        width={48}
        src={img}
        alt="Image"
        // style={{objectFit: "cover", borderRadius: 8, border: "1px #e0e0e0 solid"}}
        loading="lazy"
      />
      <div style={{fontWeight: 700, padding: "8px 0px"}}>{title}</div>
      <div style={{color: "#606060"}}>{text}</div>
    </div>
  )
}

const imgComp = (Img, alt, height=50, color="black", url) => (
  <a
    href={url} 
    target="_blank" 
    className="logo"
  >
    <img 
      height={height}
      src={Img}
      alt={alt}
      style={{color: color, }}
      loading="lazy"
    />
  </a>
)

export default function Home() {
 
  return (
    <Grid container sx={{display: "flex", flexDirection:"column", alignItems: "center", padding: 3, marginTop: 6}}>
      <Grid  sx={{width: "80%", display: "flex", flexDirection:"column", justifyContent: "flex-start", paddingTop: 0}}>
        <div style={{display: "inline-flex", alignItems: "center"}}>
          <div style={{width: "50%", padding: "0px 48px"}}>
            <h1 style={{fontSize: 40, fontWeight: 700, marginBottom: 32, lineHeight: 1.2}}>Discover, collect, and sell extraordinary NFTs</h1>
            <h2 style={{marginBottom: 48}}>OpenSea <span style={{color: "red"}}>clone</span> NFT marketplace <span style={{fontWeight: 700}}>dApp</span> for <a href="https://aurora.dev/" target="_blank"  style={{textDecoration:"none", color:"#2196f3"}}>Aurora EVM</a> implemented on the <a href="https://near.org/" target="_blank"  style={{textDecoration:"none", color:"#2196f3"}}>NEAR Blockchain</a></h2>
            <CustomButton
              variant="contained"
              sx={{padding: "8px 48px"}}
              component={Link}
              to="/explore"
            >
            Explore
            </CustomButton>
            <CustomButton
              variant="outlined"
              sx={{padding: "8px 48px", marginLeft: "24px"}}
              component={Link}
              to="/createCollection"
            >
            Create
            </CustomButton>
          </div>
          <div style={{width: "50%", paddingLeft: 48}}>
            <img 
              width={500}
              src={HomeImage}
              alt="Collection Image"
              style={{objectFit: "cover", borderRadius: 8, border: "1px #e0e0e0 solid"}}
              loading="lazy"
            />
          </div>
        </div>
        <div style={{paddingTop: 144}}>
          <div style={{display: "flex", justifyContent:"center"}}>
            <h2 style={{fontWeight: 700, marginBottom: 64}}>Create and sell your NFTs</h2>
          </div>
          <div style={{display:"inline-flex", justifyContent: "space-between", alignItems: "flex-start"}}>
            {item(WalletImg, "Set up your wallet","Once you’ve set up your wallet of choice, connect it to localhost by clicking the wallet icon in the top right corner.")}
            {item(CollectionImg, "Create your collection","Click My Collections and set up your collection. Add social links, a description, profile & banner images, and set a secondary sales fee.")}
            {item(NFTImg, "Add your NFTs","Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs with properties, stats, and unlockable content.")}
            {item(SaleImg, "List them for sale","Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs, and we help you sell them!")}
          </div>
        </div>
        <div style={{paddingTop: 144}}>
          <div style={{flex:1, display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginBottom: 48}}>
            <h2 style={{fontWeight: 700}}>Blockchain Ecosystems and Softwares</h2>
            <h3 style={{marginTop: -16, color: "#808080"}}>Following blockchain systems and frontend softwares are used to build this NFT Marketplace dApp</h3>
          </div>
          <div style={{display:"flex", justifyContent: "center"}}>  
            <div href="" style={{display: "flex", flexDirection: "row", wrapFlex: "wrap"}}>
              {imgComp(Near, "Near", 40, "black", "https://near.org/")}
              {imgComp(Aurora, "Aurora", 45, "#76ff03", "https://aurora.dev/")}
              {imgComp(Metamask, "Metamask", 45, "black", "https://metamask.io/")}
              {imgComp(Solidity, "Solidity", 45, "black", "https://docs.soliditylang.org/en/v0.8.12/")}
              {imgComp(Ethers, "Ethers", 35, "#2535a0", "https://docs.ethers.io/v5/")}
              {imgComp(Ethereum, "Ethereum", 50, "black", "https://ethereum.org/en/")}
              <a href="https://web3js.readthedocs.io/en/v1.7.0/" target="_blank" className="logo">web3.js</a>
              {imgComp(Pinata, "Pinata", 60, "black", "https://www.pinata.cloud/")}
              {imgComp(Ipfs, "Ipfs", 60, "black", "https://ipfs.io/")}
              {imgComp(Reactjs, "Reactjs", 40, "black", "https://reactjs.org/")}
              {imgComp(Mui, "Mui", 45, "black", "https://mui.com/")}
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  )
}
