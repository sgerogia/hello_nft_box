import React, { Component } from "react";
import { claimColor } from "../model/Blockchain"
import { hexToXtermName, tokenIdFromHex } from '../utils';

class ClaimFormView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: ""
        }
    }

    render() {  
        return (
            <div className="noteBox px-3 py-3 mt-3" id="claimForm">
              <h3 className="headline">Claim {this.props.selectedColor} ({hexToXtermName(this.props.selectedColor)})</h3>
              <p>This majestic color has not been claimed yet. If you want to mint it as NFT, now is your time.</p>
              <p>As an owner of this color you can set its title. It will be shown next to it here and on NFT marketplaces,
              like Opensea.</p>
              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.onSubmit()
                claimColor(tokenIdFromHex(this.props.selectedColor), hexToXtermName(this.props.selectedColor), this.state.title)
                  .on("error", async (error, receipt) => {
                    console.log("error")
                    await this.props.onError()
                  })
                  .on("receipt", async () => {                     
                    await this.props.onDone()
                   })  
              }}>
              <label className="mr-3">Color title: </label>
              <input 
                type="text"
                onChange={e => this.setState({ title: e.target.value })}
              />
              <p><i>(Claiming a COLOR TOKEN costs 0.01 ETH + gas costs)</i></p>
              <button 
                type="submit"
                disabled={this.state.title.length === 0}
              >
                  CLAIM COLOR
              </button>
              </form>
            </div>
            
          )
    }
}

export default ClaimFormView;