module.exports = {
  aurora_testnet: {
    chainId: 1313161555,   
    chainName: 'Aurora TestNet',  
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls:  ['https://testnet.aurora.dev/'],
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
    rpcUrls:  ['https://aurora.dev/'],
    blockExplorerUrls: ['https://aurora.dev/'],
  }
}