import Web3 from 'web3';
import ColorToken from "../contracts/Color.json";
import { tokenIdFromHex } from '../utils';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

let web3 = undefined
let account = undefined
let contract = undefined

export async function initWeb3() {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum)
      await window.ethereum.enable()

      // update the account used for transactions based on Metamask selection
      window.ethereum.on('accountsChanged', function (accounts) {
        account = accounts[0];
      });
      return true
    }
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider)
      return true
    }

    return false
}

export function isWeb3Ready() {
    return web3 !== undefined
}

export async function connectToBlockchain() {
    const accounts = await web3.eth.getAccounts()

    contract = new web3.eth.Contract(ColorToken.abi, contractAddress)
    account = accounts[0]
}

export function isConnectedToBlockchain() {
    return contract !== undefined && account !== undefined
}

export async function loadAllMintedColors() {
    if (!isConnectedToBlockchain()) {
        return {}
    }

    let allMintedColors = {}
    const totalSupply = await contract.methods.totalSupply().call()
    for (let i=0; i<totalSupply; i++) {
        const tokenId = await contract.methods.tokenByIndex(i).call()
        const token = await loadToken(tokenId)
        allMintedColors[tokenId.toString()] = token
    }
    return allMintedColors
}

export function claimColor(color, colorName, title) {
    return contract.methods.claim(
        color,
        colorName,
        title,
    ).send({
        from: account,
        value: Web3.utils.toWei('0.01', 'ether')
    })
}

export async function loadToken(tokenId) {
    const tokenData = await contract.methods.getData(tokenId).call()
    const owner = await contract.methods.ownerOf(tokenId).call()

    return {
        tokenId: tokenId,
        colorName: tokenData[0],
        title: tokenData[1],
        owner: owner
    }
}

export async function loadTokenForColor(color) {
    let token = await loadToken(tokenIdFromHex(color))
    return token
}