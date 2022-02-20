import React, { useContext, useEffect, useState } from 'react'
import Web3Context from "../../context/Web3Context";
import CollectionCard from "../../components/CollectionCard"
import {v4 as uuidv4} from "uuid"
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import {Link} from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

export default function UserCollections() {
  const { getUserCollections, totalCollections, getCollections } = useContext(Web3Context);
  const [userCollections, setUserCollections] = useState(undefined);
  const [allCollections, setAllCollections] = useState(undefined);
  const [fetchedCollections, setFetchedCollections] = useState(0);
  const [totalCollectionsN, setTotalCollections] = useState(0);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    const getAllCollections = async () => {
      const result = parseInt((await totalCollections()).toString());
      setTotalCollections(result);
      setAllCollections((await getCollections(0, Math.min(5, result)))[0]);
      setFetchedCollections(Math.min(2, result));
    }
    getAllCollections();
    getUserCollections().then(data => setUserCollections(data));
  }, [])

  const getMoreCollections = async () => {
    setAllCollections([...allCollections, ...(await getCollections(fetchedCollections, Math.min(fetchedCollections + 5, totalCollectionsN)))]);
    setFetchedCollections(Math.min(fetchedCollections + 5, totalCollectionsN));
  }

  // console.log(totalCollectionsN);
  // console.log(allCollections);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const ListOfUserCollections = () => {
    // console.log("userCollections", userCollections)
    const _userCollections = [...userCollections]
    return (
      <Grid container xs={12} md={8}>
        {_userCollections.map((collection) => {
            return (<CollectionCard key={uuidv4()} metaDataHash={collection.metaDataHash} collection={collection} />);
        })}
      </Grid>
    );
  }

  const ListOfAllCollections = () => {
    // console.log("all collections: ", allCollections)
    return (
      <Grid container xs={12} md={10} sx={{justifyContent: "center"}}>
        <Grid container xs={12} md={10} sx={{justifyContent: "center"}}>
          {allCollections.map((collection) => {
            return (<CollectionCard key={uuidv4()} metaDataHash={collection.metaDataHash} collection={collection} />);
          })}
        </Grid>
        <Grid container xs={12} md={10} sx={{justifyContent: "center"}}>
          {fetchedCollections < totalCollectionsN && 
            <Button
              variant="contained"
              onClick={getMoreCollections}
              sx={{marginTop: 4}}
            >
              Fetch More
            </Button>
          }
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container sx={{display: "flex", flexDirection:"column", justifyContent: "center", paddingTop: 2, paddingBottom: 8}}>
      <Grid container sx={{display: "flex", justifyContent: "space-around", marginTop: 2, marginBottom: 2}}>
        <div style={{width: 180}}/>
        <div style={{fontSize: 32, fontWeight: 700}}>Collections</div>
        <Button variant="contained" component={Link} to="/createCollection">Create a collection</Button>
      </Grid>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="My collections" />
        <Tab label="All collections" />
      </Tabs>
      <Grid container sx={{display: "flex", justifyContent: "center", paddingTop: 2, overflowY:"scroll"}}>
        {tabValue == 0 && 
          (!userCollections ? 
            <CircularProgress />
            :
            // userCollections?.length === 0 ?
            //   <EmptySection item="collection" onClick={onClickCreateCollection} /> 
            //   :
              <ListOfUserCollections />
          )
        }
        {tabValue == 1 && 
          (!allCollections ?
            <CircularProgress />
            :
            <ListOfAllCollections />
          )
        }
      </Grid>
    </Grid>
  )
}
