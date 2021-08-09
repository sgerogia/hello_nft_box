import React, { Component } from "react";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "."

class ColorTokenView extends Component {
    render() {
        let tokenId = this.props.tokenId
        let color = this.props.color

        return (

            <img 
                key={tokenId}
                alt={`Color Token ${tokenId}`}
                src={`${apiBaseUrl}/token/svg/${tokenId}`}
                style={{
                    width: "100%",
                    marginBottom: "-1.5em",
                    marginTop: "-1.5em",
                    marginLeft: "-1.5em",
                    marginRight: "-1.5em",
                    maxWidth: "20em"
                }}
            />
        )
    }
}

export default DateTokenView;