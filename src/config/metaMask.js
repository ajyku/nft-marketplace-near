module.exports = {
  aurora_testnet: {
    chainId: 1313161555,   
    chainName: 'Aurora TestNet',  
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    // rpcUrls: chainInformation.urls,
    blockExplorerUrls: ['https://testnet.aurora.dev/'],
  },
  aurora_mainnet: {
    chainId: 1313161554,   
    chainName: 'Aurora MainNet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    // rpcUrls: chainInformation.urls,
    blockExplorerUrls: ['https://aurora.dev/'],
  }
}