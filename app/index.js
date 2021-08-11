const express = require('express')
const app = express()
const path = require('path');

const port = process.env.PORT || 8080;
const baseUri = process.env.BASE_URI || "http://localhost:8080";
const contractAddress = process.env.CONTRACT_ADDRESS;
const infuraToken = process.env.INFURA_TOKEN;
const network = function () {
    let net = process.env.NETWORK || "rinkeby";

    switch(net) {
        case "ganache":
            return "http://localhost:7545";
        case "rinkeby":
           return `https://${network}.infura.io/v3/${infuraToken}`;
        default:
            throw `${network} is not supported. Only 'ganache' and 'rinkeby' are supported.`
    }
};


const Web3 = require('web3');
const ColorToken = require("./contracts/Color.json");
const web3 = new Web3(new Web3.providers.HttpProvider(network()));

const contract = new web3.eth.Contract(ColorToken.abi, contractAddress);

const { isNumeric, colorIdToXtermName } = require("./client/src/utils.js")
const { generateSVG } = require("./svg.js")

const NodeCache = require( "node-cache" );
const cache = new NodeCache({
    stdTTL: 600,
    checkperiod: 0,
    useClones: false,

});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/token/:tokenId', async (req, res) => {
    let tokenId = req.params.tokenId

    if (!isNumeric(tokenId)) {
        res.sendStatus(404)
        return
    }

    res.setHeader('Content-Type', 'application/json');

    let value = cache.get(tokenId);
    if (value !== undefined){
        res.json(value)
        return
    }

    try {
        let { colorName, title } = await contract.methods.getData(parseInt(tokenId)).call();
        debugger;
        let result = {
            name: title,
            description: "COLOR TOKENs are ERC721 Non-Fungible-Tokens stored inside the Ethereum Blockchain.\n\nEach COLOR TOKEN is unique. There can only be one for each color in the 8-bit color palette.\n\nThe owner of a COLOR TOKEN can trade it like any other ERC721 NFT.",
            image: `${baseUri}/token/svg/${tokenId}`,
            attributes: [
                {
                    "color_name": "Color Name",
                    "value": colorName
                },
                {
                    "xterm_color": "Xterm color",
                    "value": colorIdToXtermName(tokenId)
                }
            ]
        }
        cache.set(tokenId, result)
        res.json(result)
    }
    catch(error) {
        console.log(error)
        res.sendStatus(404)
    }
})

app.get('/token/svg/:tokenId', async (req, res) => {
    let tokenId = req.params.tokenId

    if (!isNumeric(tokenId)) {
        res.sendStatus(404)
        return
    }
    try {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(generateSVG(tokenId))
    }
    catch {
        res.sendStatus(404)
    }
})

app.listen(port, () => {
    console.log(`COLOR Token API port: ${port}`)
})