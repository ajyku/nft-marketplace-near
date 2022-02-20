//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./IRRoyalty.sol";

contract NFTRoyalty is Ownable,ReentrancyGuard,ERC721Enumerable,ERC721URIStorage{
    
    address creator;
    
    using Counters for Counters.Counter;
    Counters.Counter private tokenId_;
  
    
     mapping(uint=>uint) royalty;

     modifier onlyCreator() {
         require(msg.sender == creator,"Royalty Contract : Caller is not creator");
         _;
     }
     
    constructor(string memory name_,string memory symbol_,address creator_) ERC721(name_,symbol_) {
        creator = creator_;
    }
    
    
    function mint(string calldata metaHash,uint256 royalty_) external onlyCreator() {
        tokenId_.increment();
        uint256 tokenId = tokenId_.current();
        _mint(msg.sender,tokenId);
        _setTokenURI(tokenId,metaHash);
        royalty[tokenId] = royalty_;
    }
    
    function getTokenRoyalty(uint256 _tokenId) external view returns(uint256){
        return royalty[_tokenId];
    }
    
    function royaltyInfo(uint256 _tokenId,uint256 _salePrice) external view returns (
        address receiver,
        uint256 royaltyAmount
    ){
        receiver = creator;
        royaltyAmount = (_salePrice*royalty[_tokenId])/100;
    }
    
    receive() external payable{
        
    }
    
    function withdraw() external onlyCreator{
        payable(creator).transfer(address(this).balance);
    }
    
    function getCreator() external view returns(address){
        return creator;
    }
    
     function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721,ERC721Enumerable) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Enumerable).interfaceId ||
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

}