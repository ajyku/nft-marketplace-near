// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IRRoyalty.sol";

contract MarketPlace is ReentrancyGuard{
    
    
    bytes4 public constant ERC721INTERFACE = type(IERC721).interfaceId;
    bytes4 public constant ERC2981INTERFACE = type(IERC2981).interfaceId;

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;


    struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable creator;
    address payable seller;
    address payable owner;
    uint256 price;
    uint256 royalty;
    bool isAuction;
    bool sold;
  }

    struct AuctionInfo {
        uint256 highestBid;
        address highestBidder;
        uint256 timeEnding;
    }
    
    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => AuctionInfo) private auctionData;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );

    event MarketItemSold(
        uint256 itemId,
        address indexed nftContract,
        address indexed seller,
        address indexed newOwner
        );
    
    event MarketItemUnlisted(
        uint256 itemId
        );
        
    event MarketItemBid(
        uint256 indexed itemId,
        address indexed bidder,
        uint256 amount
        );

    /* Places an item for sale on the marketplace */
    function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
    ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(ERC165Checker.supportsInterface(nftContract,ERC721INTERFACE),"Contract needs to be ERC721");
    require(IERC721(nftContract).ownerOf(tokenId) == msg.sender,"Only owner can create listing");
    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    
    if (ERC165Checker.supportsInterface(nftContract,ERC2981INTERFACE)){
        (address creator,uint256 royaltyAmount) = IERC2981(nftContract).royaltyInfo(tokenId,price);
        idToMarketItem[itemId] =  MarketItem(
                                      itemId,
                                      nftContract,
                                      tokenId,
                                      payable(creator),
                                      payable(msg.sender),
                                      payable(address(0)),
                                      price,
                                      royaltyAmount,
                                      false,
                                      false
                                    );
    }
    else{
        address creator = msg.sender;
        uint royaltyAmount = 0;
        idToMarketItem[itemId] =  MarketItem(
                                      itemId,
                                      nftContract,
                                      tokenId,
                                      payable(creator),
                                      payable(msg.sender),
                                      payable(address(0)),
                                      price,
                                      royaltyAmount,
                                      false,
                                      false
                                    );
    }
    
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    
    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price
    );
    }


    function createMarketAuction(
    address nftContract,
    uint256 tokenId,
    uint256 floorPrice,
    uint auctionDays
    ) external payable nonReentrant{
    require(floorPrice > 0, "Price must be at least 1 wei");
    require(auctionDays > 0, "Auction time can't be 0 days");
    require(ERC165Checker.supportsInterface(nftContract,ERC721INTERFACE),"Contract needs to be ERC721");
    require(IERC721(nftContract).ownerOf(tokenId) == msg.sender,"Only owner can create listing");
    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    
    if (ERC165Checker.supportsInterface(nftContract,ERC2981INTERFACE)){
        (address creator,uint256 royaltyAmount) = IERC2981(nftContract).royaltyInfo(tokenId,floorPrice);
        idToMarketItem[itemId] =  MarketItem(
                                      itemId,
                                      nftContract,
                                      tokenId,
                                      payable(creator),
                                      payable(msg.sender),
                                      payable(address(0)),
                                      floorPrice,
                                      royaltyAmount,
                                      true,
                                      false
                                    );
    }
    else{
        address creator = msg.sender;
        uint royaltyAmount = 0;
        idToMarketItem[itemId] =  MarketItem(
                                      itemId,
                                      nftContract,
                                      tokenId,
                                      payable(creator),
                                      payable(msg.sender),
                                      payable(address(0)),
                                      floorPrice,
                                      royaltyAmount,
                                      true,
                                      false
                                    );
    }
    
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    
    auctionData[itemId] = AuctionInfo(0,
                                      address(0),
                                      (block.timestamp + auctionDays*1 days)
                                     );
    
    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      floorPrice
    );
    }
    
  function createAuctionBid(
      uint256 itemId
    ) external payable nonReentrant{
        MarketItem storage currentItem = idToMarketItem[itemId];
        AuctionInfo storage currentInfo = auctionData[itemId];
        require(!currentItem.sold,"Item has already been sold");
        require(currentItem.isAuction,"Item is not for auction");
        require(currentInfo.timeEnding > block.timestamp,"Auction has already ended");
        require(msg.value > currentItem.price,"You need to pay more than floor price");
        require(msg.value > currentInfo.highestBid,"You need to pay more than current highest bid");
        payable(currentInfo.highestBidder).transfer(currentInfo.highestBid);
        currentInfo.highestBidder = msg.sender;
        currentInfo.highestBid = msg.value;
        emit MarketItemBid(itemId,msg.sender,msg.value);
    }
    
  function createAuctionSale(
        address nftContract,
        uint itemId
      ) external payable nonReentrant{
        MarketItem storage currentItem = idToMarketItem[itemId];
        AuctionInfo storage currentInfo = auctionData[itemId];
        require(!currentItem.sold,"Item has already been sold");
        require(currentItem.isAuction,"Item is not for auction");
        require(currentInfo.timeEnding < block.timestamp,"Auction has not yet ended");
        require(msg.sender == currentInfo.highestBidder,"Sender is not the highest bidder");
        if(currentItem.creator == currentItem.seller ){
        payable(currentItem.nftContract).transfer(msg.value);
        }
        else{
        payable(currentItem.seller).transfer(currentItem.royalty);
        currentItem.seller.transfer(msg.value-currentItem.royalty);
        }
        IERC721(nftContract).transferFrom(address(this), msg.sender, currentItem.tokenId);
        currentItem.owner = payable(msg.sender);
        currentItem.sold = true;
        _itemsSold.increment();
        emit MarketItemSold(itemId,nftContract,currentItem.seller,currentItem.owner);
        }

      
  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    MarketItem storage currentItem = idToMarketItem[itemId];
    require(!currentItem.isAuction,"This item is on auction");
    require(msg.value == currentItem.price, "Please submit the asking price in order to complete the purchase");
    require(!currentItem.sold,"Item already sold");
    if(currentItem.creator == currentItem.seller ){
        payable(currentItem.nftContract).transfer(msg.value);
    }
    else{
        payable(currentItem.seller).transfer(currentItem.royalty);
        currentItem.seller.transfer(msg.value-currentItem.royalty);
    }
    IERC721(nftContract).transferFrom(address(this), msg.sender, currentItem.tokenId);
    currentItem.owner = payable(msg.sender);
    currentItem.sold = true;
    _itemsSold.increment();
    emit MarketItemSold(itemId,nftContract,currentItem.seller,currentItem.owner);
  }
  
  /* Returns all of user bids */
  function fetchUserBids() external view returns (MarketItem[] memory,AuctionInfo[] memory){
      uint totalItemCount = _itemIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (auctionData[i + 1].highestBidder == msg.sender) {
        itemCount += 1;
      }
    }
    
    MarketItem[] memory items = new MarketItem[](itemCount);
    AuctionInfo[] memory info = new AuctionInfo[](itemCount);
    
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        AuctionInfo storage currentInfo = auctionData[currentId];
        items[currentIndex] = currentItem;
        info[currentIndex] = currentInfo;
        currentIndex += 1;
      }
    }
    return (items,info);
  }

  /* Returns all unsold market items */
  function fetchMarketItems() public view returns (MarketItem[] memory,AuctionInfo[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    AuctionInfo[] memory info = new AuctionInfo[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (!idToMarketItem[i + 1].sold) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        AuctionInfo storage currentInfo = auctionData[currentId];
        items[currentIndex] = currentItem;
        info[currentIndex] = currentInfo;
        currentIndex += 1;
      }
    }
    return (items,info);
  }

  /* Returns only items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
    }

    function unlistItem(uint itemId) external nonReentrant{
        require(!idToMarketItem[itemId].sold,"Sold items can't be unlisted");
        require(idToMarketItem[itemId].seller == msg.sender,"Sender is not lister");
        if(idToMarketItem[itemId].isAuction){
            AuctionInfo storage info = auctionData[itemId];
            if(info.highestBid > 0){
                payable(info.highestBidder).transfer(info.highestBid);
            }
            delete auctionData[itemId];
        }
        IERC721(idToMarketItem[itemId].nftContract).transferFrom(address(this),msg.sender,idToMarketItem[itemId].tokenId);
        delete idToMarketItem[itemId];
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        emit MarketItemUnlisted(
        itemId
        );
    }
}