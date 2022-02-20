module.exports = {
  aurora_testnet: {
    chainId: 1313161555,   
    chainName: 'Aurora TestNet',  // Change it to 'Aurora MainNet' if change
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    // rpcUrls: chainInformation.urls,
    blockExplorerUrls: ['https://testnet.aurora.dev/'],  // change to https://aurora.dev/ for Aurora MainNet
  },
  aurora_mainnet: {
    chainId: 1313161554,   
    chainName: 'Aurora MainNet',  // Change it to 'Aurora MainNet' if change
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    // rpcUrls: chainInformation.urls,
    blockExplorerUrls: ['https://aurora.dev/'],  // change to https://aurora.dev/ for Aurora MainNet
  }
}