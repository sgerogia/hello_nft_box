Hello NFT
--------------

A very simple 'Hello world' NFT smart contract, referenced by a [blog post in my personal blog](https://sgerogia.github.io/Hello-world-NFT).  
This is packaged as a [Truffle box](https://www.trufflesuite.com/docs/truffle/advanced/creating-a-truffle-box).  

# Installation
`truffle unbox sgerogia/hello_nft_box`

The generated project comes pre-configured with 2 networks  
* `ganache`: This points to a local instance of the [Ganache](https://www.trufflesuite.com/ganache) emulator.
* `rinkeby`: The Rinkeby Ethereum testnet, useful for testing with [OpenSea's test infrastructure](https://testnets.opensea.io/).

# Prerequisites

* CoinMarketCap [API key](https://testnets.opensea.io/) (optional)  
Allows automatic reporting during testing of USD/EUR/etc cost of various contract operations.
* Infura [Rinkeby API key](https://infura.io/pricing) (optional)  
Needed to test against OpenSea's test market.
* [Heroku account](https://signup.heroku.com/) (optional)  
Needed to test against OpenSea's test market.
  
# Usage

* [Building](https://sgerogia.github.io/Hello-world-NFT#building)
* [Manual interaction](https://sgerogia.github.io/Hello-world-NFT#interaction)
