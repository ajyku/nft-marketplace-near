import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import {Link} from "react-router-dom";
import Wallet from "./Wallet"
import { ReactComponent as AuroraLogo } from "../assets/aurora.svg";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const [walletHash, setWalletHash] = React.useState()

  return (
    <Box sx={{ flexGrow: 1, width:"100%", display:"flex", position: "fixed", top: 0 , marginBottom: 12, zIndex: 9999}}>
      <AppBar position="static">
        <Toolbar>
          <AuroraLogo />
          <Button 
            variant="text"
            color="inherit"
            component={Link}
            to="/"
            style={{fontWeight: 500, fontSize: 22, textTransform: "none", marginLeft: 8}}
          >NFT Marketplace</Button>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button 
              variant="text"
              color="inherit"
              component={Link}
              to="/explore"
              style={{fontWeight: 700, margin: "0px 8px", textTransform: "none", fontSize: 16}}
            >Explore</Button>
            <Button 
              variant="text"
              color="inherit"
              component={Link}
              to="/myCollections"
              style={{fontWeight: 700, margin: "0px 8px", textTransform: "none", fontSize: 16}}
            >My Collections</Button>
            {/* <Button 
              variant="text"
              color="inherit"
              component={Link}
              to="/createNFT"
              style={{fontWeight: 700, margin: "0px 8px", textTransform: "none", fontSize: 16}}
            >Create</Button> */}
            <Wallet setHash={hash => setWalletHash(hash)} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}