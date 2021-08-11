const { colorIdToHex } = require("./client/src/utils.js")

function generateSVG(tokenId) {
    let color = colorIdToHex(tokenId);

    return `
        <svg viewBox="0 0 250 250" width="250px" height="250px" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" rx="20" ry="20" width="243" height="243" style="fill:${color};stroke:gold;stroke-width:5" />
        </svg>
    `
}

module.exports = { generateSVG }