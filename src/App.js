import React, {useState, useEffect, useContext} from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import AppBar from "./components/AppBar"
import Home from "./containers/home/Home"
import CreateCollection from "./containers/createCollection/CreateCollection"
import ExploreCollections from "./containers/exploreCollections/ExploreCollections"
import UserCollections from "./containers/userCollections/UserCollections"
import MyCollections from "./containers/myCollections/MyCollections"
import CollectionDetails from "./containers/collectionDetail/CollectionDetails"
import CreateNFT from "./containers/nft/CreateNFT"
import NFT from "./containers/nft/NFT"
import BuyNFT from "./containers/nft/BuyNFT"
import Web3Context from "./context/Web3Context";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const {alert} = useContext(Web3Context)
  const [alertData, setAlertData] = useState(null)
  const [openAlert, setOpenAlert] = useState(false)

  useEffect(()=>{
    if(alert != null) {
      setAlertData(alert)
      setOpenAlert(true)
    }
  },[alert])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  return (
    <div className="App">
      <AppBar />
      <div style={{height: 56}}/>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/createCollection" element={<CreateCollection />} />
        <Route path="/userCollections" element={<UserCollections />} />
        <Route path="/myCollections" element={<MyCollections />} />
        <Route path="/CollectionDetails/:contractAddress/:metaDataHash/:ownerAddress" element={<CollectionDetails />} />
        <Route path="/createNFT" element={<CreateNFT />} />
        <Route path="/explore" element={<ExploreCollections />} />
        <Route path="/nft/:contractAddress/:tokenURI/:ownerAddress/:approved/:tokenId" element={<NFT />} />
        <Route path="/buyNFT" element={<BuyNFT />} />
      </Routes>
      <div style={{height: 56}}/>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alertData && alertData.type} sx={{ width: '100%' }}>
          {alertData && alertData.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
