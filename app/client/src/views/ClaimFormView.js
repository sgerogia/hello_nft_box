import React, { Component } from "react";
import { claimDate } from "../model/Blockchain"

class ClaimFormView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            note: ""
        }
    }

    render() {  
        return (
            <div className="noteBox px-3 py-3 mt-3" id="claimForm">
              <h3 className="headline">Claim {this.props.selectedColor}</h3>
              <p>This majestic color has not been claimed yet. If you want to mint it as NFT, now is your time.</p>
              <p>As an owner of this color you can set its title which is shown next to it here and on NFT marketplaces,
              like Opensea.</p>
              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.onSubmit()
                claimColor(this.props.selectedColor, this.state.note)
                  .on("error", async (error, receipt) => {
                    console.log("error")
                    await this.props.onError()
                  })
                  .on("receipt", async () => {                     
                    await this.props.onDone()
                   })  
              }}>
              <label className="mr-3">Note: </label>
              <input 
                type="text"
                onChange={e => this.setState({ note: e.target.value })}
              />
              <p><i>(Claiming a COLOR TOKEN costs 0.01 ETH + gas costs)</i></p>
              <button 
                type="submit"
                disabled={this.state.note.length === 0}
              >
                  CLAIM COLOR
              </button>
              </form>
            </div>
            
          )
    }
}

export default ClaimFormView;