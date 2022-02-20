import React, {useState, useEffect, useContext} from 'react'
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import WalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Web3Context from "../context/Web3Context";

export default function Wallet() {
  const {isActive, accounts, setupSigner} = useContext(Web3Context)

  const [walletHash, setWalletHash] = useState()
  const [copyHash, setCopyHash] = useState(false)
  const [displayHash, setDisplayHash] = useState()

  useEffect(()=>{
    if(isActive && accounts.length > 0){
      setWalletHash(accounts[0])
      setDisplayHash(processHash(accounts[0]))
    }
  },[accounts, isActive])

  const handleCopyHash = (event) => {
    navigator.clipboard.writeText(walletHash)
    setCopyHash(true)
    setTimeout(() => {
      setCopyHash(false)
    }, 1000);
  }

  const processHash =(value) =>{
    if(!value) return null
    const _hash = `${value.substring(0,6)}...${value.slice(-4)}`
    return _hash
  }

  return (
    <>
      {isActive &&
        <Tooltip 
          arrow 
          title={!copyHash ? "Copy" : "Copied!"}
          classes={{fontSize: 24}}
        >
          <Chip 
            label={displayHash}
            variant="outlined" 
            onClick={handleCopyHash}
            style={{alignSelf: "center", color: "white", margin: "0px 8px 0px 8px"}}
          />
        </Tooltip>
      }
      <IconButton 
        size="large" 
        aria-label="Wallet" 
        color="inherit"
        onClick={setupSigner}
      >
        <WalletIcon style={isActive ? {color:"white"} : {color:"red"}}/>
      </IconButton>
    </>
  )
}
