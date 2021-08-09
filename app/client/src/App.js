import React, { Component } from "react";
import { CompactPicker } from 'react-color';
import ColorTokenView from "./views/ColorTokenView"
import ClaimFormView from "./views/ClaimFormView"
import { loadTokenForColor, connectToBlockchain, isConnectedToBlockchain, initWeb3, isWeb3Ready, loadAllMintedColors, tokenIdFromColor } from "./model/Blockchain"
import { Col, Container, Row } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loadingBlockchainData: true,
      selectedColor: '#ffffff',
      allMintedColors: {}
    }
  }

  handleColorChange = (color) => {
    this.setState({ selectedColor: color.hex });
  };

  loadBlockchainData = async () => {
    if (!isWeb3Ready() || !isConnectedToBlockchain()) {
      return
    }

    this.setState({ loadingBlockchainData: true })

    let allMintedColors = await loadAllMintedColors()
    this.setState({ allMintedColors })

    this.setState({ loadingBlockchainData: false })
  }

  getTokenForColor = (color) => {
    return this.state.allMintedColors[tokenIdFromColor(color)]
  }

  componentDidMount = async () => {
    let result = await initWeb3()
    if (!result) {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        return
    }

    await connectToBlockchain()
    
    await this.loadBlockchainData()
  };

  renderClaimFormOrAlreadyClaimed = () => {
    if (this.state.loadingBlockchainData) {
      return (<p>loading …</p>)
    }

    let token = this.getTokenForColor(this.state.selectedColor)
    if (token !== undefined) {
      return this.renderColorAlreadyClaimed(token)
    } else {
      return (
        <ClaimFormView
          selectedColor={this.state.selectedColor}
          onSubmit={ () => {
            this.setState({ loadingBlockchainData: true })
          }}
          onDone={ async () => {
            let newColorToken = await loadTokenForColor(this.state.selectedColor)
            console.log(newDateColor)
            let allMintedColors = this.state.allMintedColors
            allMintedColors[tokenIdFromColor(this.state.selectedColor)] = newColorToken
            this.setState({ allMintedColors })

            this.setState({ loadingBlockchainData: false })
          }}
          onError={ ()=> {
            this.setState({ loadingBlockchainData: false })
          }}
        />
      )
    }
  }

  renderColorAlreadyClaimed = (token) => {
    return (
      <div>
        <ColorTokenView tokenId={token.tokenId} color={token.color} />
        <p className="mt-3">
          <span className="tokenTitle noteBox py-2 px-2">
            {token.title}
          </span>
        </p>
        <p className="ownerAdress mt-3">
          <b>Owner:</b>
          <a href={`https://opensea.io/accounts/${token.owner}`}>
            {token.owner.substring(0,16)}...
          </a>
        </p>
      </div>
    )
  }

  render() {
    let white = '#ffffff'

    return (
      <Container fluid>
        <Row className="justify-content-center dark headline">
          <div className="text-center mt-3 mb-1">
            <h1>Color Token</h1>
            <p className="lead">Every color is unique</p>
          </div>
        </Row>
        <Row id="explanation" className="justify-content-center bg-light pt-4 pb-3">
          <Col lg="3" md="6" sm="12" className="text-center">
            <div>
              <ColorTokenView tokenId={tokenIdFromColor(white)} color="#ffffff"/>
              <p className="mt-2">White color</p>
            </div>
          </Col>
          <Col lg="3" md="6" sm="12" className="mt-10">
          <p>COLOR TOKEN are ERC721 Non-Fungible-Tokens stored inside the Ethereum Blockchain.</p>
          <p>Each COLOR TOKEN is unique. There can only be 256, one for each color on the standard 8-bit palette. The
          color is fully encoded in each element of the token.</p>
          <p>The owner of a COLOR TOKEN can change its title and trade it like any other ERC721 NFT.</p>
          </Col>
        </Row>
        <Row className="medium text-center pt-4">
          <Col>
          <h2 className="headline">Claim your color</h2>
          </Col>
        </Row>
        <Row className="medium text-center pt-4">
          <Col>
            <p id="explanation">You can own any unclaimed color.</p>
          </Col>
        </Row>
        <Row className="justify-content-center medium pt-4 pb-4">
          <Col lg="3" md="6" sm="12">
            <CompactPicker
                    color={ this.state.selectedColor }
                    onChangeComplete={ this.handleColorChange }
                    colors = [
                    "#000000", "#800000", "#008000", "#808000", "#000080", "#800080", "#008080", "#c0c0c0", "#808080",
                    "#ff0000", "#00ff00", "#ffff00", "#0000ff", "#ff00ff", "#00ffff", "#ffffff", "#000000", "#00005f",
                    "#000087", "#0000af", "#0000d7", "#0000ff", "#005f00", "#005f5f", "#005f87", "#005faf", "#005fd7",
                    "#005fff", "#008700", "#00875f", "#008787", "#0087af", "#0087d7", "#0087ff", "#00af00", "#00af5f",
                    "#00af87", "#00afaf", "#00afd7", "#00afff", "#00d700", "#00d75f", "#00d787", "#00d7af", "#00d7d7",
                    "#00d7ff", "#00ff00", "#00ff5f", "#00ff87", "#00ffaf", "#00ffd7", "#00ffff", "#5f0000", "#5f005f",
                    "#5f0087", "#5f00af", "#5f00d7", "#5f00ff", "#5f5f00", "#5f5f5f", "#5f5f87", "#5f5faf", "#5f5fd7",
                    "#5f5fff", "#5f8700", "#5f875f", "#5f8787", "#5f87af", "#5f87d7", "#5f87ff", "#5faf00", "#5faf5f",
                    "#5faf87", "#5fafaf", "#5fafd7", "#5fafff", "#5fd700", "#5fd75f", "#5fd787", "#5fd7af", "#5fd7d7",
                    "#5fd7ff", "#5fff00", "#5fff5f", "#5fff87", "#5fffaf", "#5fffd7", "#5fffff", "#870000", "#87005f",
                    "#870087", "#8700af", "#8700d7", "#8700ff", "#875f00", "#875f5f", "#875f87", "#875faf", "#875fd7",
                    "#875fff", "#878700", "#87875f", "#878787", "#8787af", "#8787d7", "#8787ff", "#87af00", "#87af5f",
                    "#87af87", "#87afaf", "#87afd7", "#87afff", "#87d700", "#87d75f", "#87d787", "#87d7af", "#87d7d7",
                    "#87d7ff", "#87ff00", "#87ff5f", "#87ff87", "#87ffaf", "#87ffd7", "#87ffff", "#af0000", "#af005f",
                    "#af0087", "#af00af", "#af00d7", "#af00ff", "#af5f00", "#af5f5f", "#af5f87", "#af5faf", "#af5fd7",
                    "#af5fff", "#af8700", "#af875f", "#af8787", "#af87af", "#af87d7", "#af87ff", "#afaf00", "#afaf5f",
                    "#afaf87", "#afafaf", "#afafd7", "#afafff", "#afd700", "#afd75f", "#afd787", "#afd7af", "#afd7d7",
                    "#afd7ff", "#afff00", "#afff5f", "#afff87", "#afffaf", "#afffd7", "#afffff", "#d70000", "#d7005f",
                    "#d70087", "#d700af", "#d700d7", "#d700ff", "#d75f00", "#d75f5f", "#d75f87", "#d75faf", "#d75fd7",
                    "#d75fff", "#d78700", "#d7875f", "#d78787", "#d787af", "#d787d7", "#d787ff", "#d7af00", "#d7af5f",
                    "#d7af87", "#d7afaf", "#d7afd7", "#d7afff", "#d7d700", "#d7d75f", "#d7d787", "#d7d7af", "#d7d7d7",
                    "#d7d7ff", "#d7ff00", "#d7ff5f", "#d7ff87", "#d7ffaf", "#d7ffd7", "#d7ffff", "#ff0000", "#ff005f",
                    "#ff0087", "#ff00af", "#ff00d7", "#ff00ff", "#ff5f00", "#ff5f5f", "#ff5f87", "#ff5faf", "#ff5fd7",
                    "#ff5fff", "#ff8700", "#ff875f", "#ff8787", "#ff87af", "#ff87d7", "#ff87ff", "#ffaf00", "#ffaf5f",
                    "#ffaf87", "#ffafaf", "#ffafd7", "#ffafff", "#ffd700", "#ffd75f", "#ffd787", "#ffd7af", "#ffd7d7",
                    "#ffd7ff", "#ffff00", "#ffff5f", "#ffff87", "#ffffaf", "#ffffd7", "#ffffff", "#080808", "#121212",
                    "#1c1c1c", "#262626", "#303030", "#3a3a3a", "#444444", "#4e4e4e", "#585858", "#626262", "#6c6c6c",
                    "#767676", "#808080", "#8a8a8a", "#949494", "#9e9e9e", "#a8a8a8", "#b2b2b2", "#bcbcbc", "#c6c6c6",
                    "#d0d0d0", "#dadada", "#e4e4e4", "#eeeeee"
                    ]
                  />
          </Col>
          <Col lg="3" md="6" sm="12" className="mt-3">
            {this.renderClaimFormOrAlreadyClaimed()}
          </Col>
        </Row>
        <Row id="rarity" className="justify-content-center pt-4 bg-light">
          <Col lg="6" md="8" sm="12" className="text-center">
          < h2 className="headline">Rarity</h2>
            <p>Each date is unique, but in order to increase the fun while minting, there are also some materials a DATE TOKEN can be minted with. The material is randomly choosen during the process and stored for eternity in the blockchain.</p>
          </Col>
        </Row>
        <RarityView />
        <Row className="medium justify-content-center pt-4"> 
          <h2 className="headline">Date inventory</h2>
        </Row>
        <Row className="medium justify-content-center pt-4"> 
          <h2>coming soon …</h2>
        </Row>
      </Container>
    );
  }
}

export default App;