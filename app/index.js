const express = require('express')
const app = express()
const path = require('path');


const port = process.env.PORT || 8080;
const baseUri = process.env.BASE_URI || "http://localhost:8080";
const contractAddress = process.env.CONTRACT_ADDRESS;
const infuraToken = process.env.INFURA_TOKEN;
const network = process.env.NETWORK || "rinkeby";

const Web3 = require('web3');
const DateToken = require("./contracts/Color.json");
const web3 = new Web3(new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${infuraToken}`));

const contract = new web3.eth.Contract(DateToken.abi, contractAddress);

const { isNumeric, colorToMaterialName, isLeapYear, toDate } = require("./utils.js")
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
        let { color, title } = await contract.methods.get(tokenId).call()

        let result = {
            name: title,
            description: "COLOR TOKENs are ERC721 Non-Fungible-Tokens stored inside the Ethereum Blockchain.\n\nEach COLOR TOKEN is unique. There can only be one for each color in the 8-bit color palette.\n\nThe owner of a COLOR TOKEN can change its title and trade it like any other ERC721 NFT.",
            image: `${baseUri}/token/svg/${tokenId}`,
            attributes: [
                {
                    "color_hex": "Hex",
                    "value": colorToMaterialName(parseInt(color))
                },
                {
                    "trait_type": "Is Leap Year",
                    "value": isLeapYear(parseInt(year)) ? "yes" : "no"
                },
                {
                    "trait_type": "Is Leap Day",
                    "value": (day === "29" && month === "2") ? "yes" : "no"
                },
                {
                    "display_type": "date",
                    "trait_type": "Date",
                    "value": toDate(year, month, day).getTime()
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
    let year = req.params.year
    let month = req.params.month
    let day = req.params.day
    let color = req.params.color

    if (!isNumeric(tokenId) || !isNumeric(year) || !isNumeric(month) || !isNumeric(day)) {
        res.sendStatus(404)
        return
    }
    try {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(generateSVG(tokenId, year, month, day, color))
    }
    catch {
        res.sendStatus(404)
    }
})

app.listen(port, () => {
    console.log(`Date Chain API listening port ${port}`)
})