import Web3 from 'web3';
import HelloNftToken from "../contracts/HelloNft.json";

let contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

let web3 = undefined
let account = undefined
let contract = undefined

export function tokenIdFromDate(date) {
    return (date.getFullYear()-1)*372 + date.getMonth()*31 + date.getDate()-1 
}

export async function initWeb3() {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
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

    contract = new web3.eth.Contract(HelloNftToken.abi, contractAddress)
    account = accounts[0]
}

export function isConnectedToBlockchain() {
    return contract !== undefined && account !== undefined
}

export async function loadAllMintedColors() {
    if (!isConnectedToBlockchain) {
        return {}
    }

    let allMintedColors = {}
    const totalSupply = await contract.methods.totalSupply().call()
    for (let i=0; i<totalSupply; i++) {
        const tokenId = await contract.methods.tokenByIndex(i).call()
        const token = await loadToken(tokenId)
        allMintedColors[tokenId.toString()] = token
    }
    return allMintedDates
}

export function claimColor(color, note) {
    return contract.methods.claim(
        color,
        note,
    ).send({
        from: account, 
        value: Web3.utils.toWei('10', 'finney')
    })
}

export async function loadToken(tokenId) {
    const tokenData = await contract.methods.get(tokenId).call()
    const owner = await contract.methods.ownerOf(tokenId).call()

    return {
        tokenId: tokenId,
        color: tokenData[0],
        title: tokenData[1].toString(),
        owner: owner
    }
}

export async function loadTokenForColor(color) {
    let token = await loadToken(tokenIdFromColor(color))
    return token
}