// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract Color is ERC721, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {

    // --- Contract variables ----

    // base URI for metadata JSON
    string _baseMetadataURI;

    // contents of the token
    struct Metadata {
        string colorName;
        string title;
    }

    // global map from token id to token metadata
    mapping(uint256 => Metadata) id_to_color;

    // --- Constructor ---

    // set base URI and mint a few tokens for the owner's address
    constructor() ERC721("Color", "COLOR") {
        _baseMetadataURI = "https://color-nft-rinkeby.herokuapp.com/token/";

        mint(0, "Black", "Blackest black");
        mint(15, "White", "Whitest white");
        mint(203, "IndianRed1", unicode"Straight from the depths of India 🇮🇳");
        mint(41, "SpringGreen3", unicode"Spring so green you can almost smell it! 🌱");
    }

    // --- Metadata URI ---

    // parent contract method override
    function _baseURI() internal view override returns (string memory) {
        return _baseMetadataURI;
    }

    // change the metadata base URI
    //    mainly to facilitate testing in different environments
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseMetadataURI = baseURI;
    }

    // --- Minting, claiming and ownership ---

    // private utility method
    function mint(uint8 color, string memory colorName, string memory title) internal {
        // use XTerm color as token id
        uint256 tokenId = uint256(color);

        id_to_color[tokenId] = Metadata(colorName, title);
        _safeMint(msg.sender, tokenId);
    }

    // public method to claim a token
    function claim(uint8 color, string calldata colorName, string calldata title) external whenNotPaused payable {
        require(msg.value == 10000000 gwei, "claiming a color costs 0.01 ETH");

        // TODO: Ensure that colorName matches the color according to https://jonasjacek.github.io/colors/

        mint(color, colorName, title);
        payable(owner()).transfer(10000000 gwei);
    }

    // get token metadata
    function getData(uint256 tokenId) external view returns (string memory colorName, string memory title) {
        require(_exists(tokenId), "token not minted");
        Metadata memory colorMetadata = id_to_color[tokenId];
        colorName = colorMetadata.colorName;
        title = colorMetadata.title;
    }

    // --- From ERC721Enumerable.sol ---

    // hook for additional actions before minting/transferring
    // just calls the parent method
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // --- From Pausable.sol ---
    // emergency switch off/on methods

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // --- Other ---

    // Ensures compatibility with marketplaces (e.g. OpenSea)
    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}