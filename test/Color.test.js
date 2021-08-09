const { assert, expect } = require("chai");
const {expectRevert} = require('@openzeppelin/test-helpers');

const ColorToken = artifacts.require("Color");

require("chai")
    .use(require("chai-as-promised"))
    .should()

contract("Color", (accounts) => {

    let color
    before(async () => {
        color = await ColorToken.new()
    })

    describe("Deployed Color", async () => {
        it("has an owner", async () => {
            let owner = await color.owner()
            expect(owner).to.equal(accounts[0])
        })

        it("has a name", async () => {
            let name = await color.name()
            expect(name).to.equal("Color")
        })

        it("has a symbol", async () => {
            let symbol = await color.symbol()
            expect(symbol).to.equal("COLOR")
        })

        it("has correct default tokenURI", async () => {
            let tokenURI = await color.tokenURI(0)
            expect(tokenURI).to.equal("https://color-nft-sgerogia.herokuapp.com/token/0")
        })

        it("gifts the owner color Black", async () => {
            let owner = await color.ownerOf(0)
            expect(owner).to.equal(accounts[0])

            let meta = await color.getData(0)
            expect(meta[0].toString()).to.equal("Black")
            expect(meta[1].toString()).to.equal("Blackest black")
        })

        it("gifts the owner color White", async () => {
            let owner = await color.ownerOf(15)
            expect(owner).to.equal(accounts[0])

            let meta = await color.getData(15)
            expect(meta[0].toString()).to.equal("White")
            expect(meta[1].toString()).to.equal("Whitest white")
        })

        it("gifts the owner color IndianRed1", async () => {
            let owner = await color.ownerOf(203)
            expect(owner).to.equal(accounts[0])

            let meta = await color.getData(203)
            expect(meta[0].toString()).to.equal("IndianRed1")
            expect(meta[1].toString()).to.equal("Straight from the depths of India 🇮🇳")
        })

        it("gifts the owner color SpringGreen3", async () => {
            let owner = await color.ownerOf(41)
            expect(owner).to.equal(accounts[0])

            let meta = await color.getData(41)
            expect(meta[0].toString()).to.equal("SpringGreen3")
            expect(meta[1].toString()).to.equal("Spring so green you can almost smell it! 🌱")
        })
    })

    let price = web3.utils.toBN(web3.utils.toWei('0.01', 'ether'))

    describe("Minting a color", async () => {
        let ownerBalanceBefore
        let buyerBalanceBefore

        before(async ()=> {
            ownerBalanceBefore = await web3.eth.getBalance(accounts[0]);
            ownerBalanceBefore = web3.utils.toBN(ownerBalanceBefore)

            buyerBalanceBefore = await web3.eth.getBalance(accounts[1]);
            buyerBalanceBefore = web3.utils.toBN(buyerBalanceBefore)
        })

        let receipt
        let transaction

        it("creates a token", async () => {
            receipt = await color.claim(45, "Turquoise2", "Turquoise gemstone explosion", { from: accounts[1], value: price })
            transaction = await web3.eth.getTransaction(receipt.tx);
        })

        it("transfers ownership to the caller", async () => {
            let owner = await color.ownerOf(45)
            expect(owner).to.equal(accounts[1])
        })

        it("sets the note", async () => {
            let meta = await color.getData(45)
            expect(meta[1]).to.equal("Turquoise gemstone explosion")
        })

        it("costs 0.01 ETH plus gas to mint", async () => {
            let buyerBalanceAfter = await web3.eth.getBalance(accounts[1])
            buyerBalanceAfter = web3.utils.toBN(buyerBalanceAfter)
            let gasCost = web3.utils.toBN(transaction.gasPrice * receipt.receipt.gasUsed)
            let expectedBuyerBalance = buyerBalanceBefore.sub(price).sub(gasCost)
            expect(buyerBalanceAfter.toString()).to.equal(expectedBuyerBalance.toString())
        })

        it("0.01 ETH are transferred to the owners account", async () => {
            let ownerBalanceAfter = await web3.eth.getBalance(accounts[0])
            ownerBalanceAfter = web3.utils.toBN(ownerBalanceAfter)
            let expectedOwnerBalance = ownerBalanceBefore.add(price)
            expect(ownerBalanceAfter.toString()).to.equal(expectedOwnerBalance.toString())
        })

        it("prevents it from being minted again", async() => {
            await expectRevert(
                color.claim(45, "Turquoise2", "Trying to snatch it!", { from: accounts[2], value: price }),
                "Reason given: ERC721: token already minted."
            )
        })
    })

    describe("Trying to mint a color without paying", async () => {
        it("fails", async () => {
            await expectRevert(
                color.claim(46, "Green1", "The true green!"),
                "claiming a color costs 0.01 ETH"
            )
        })
    })

    describe("Trying to get data for an unminted token", async () => {
        it("fails", async () => {
            await expectRevert(
                color.getData(255),
                "token not minted"
            )
        })
    })

    describe("Pausing and unpausing operations", async () => {
        it("only the contract owner can pause", async () => {
            await expectRevert(
                color.pause({from: accounts[1]}),
                "Ownable: caller is not the owner"
            )
        })

        it("only the contract owner can unpause", async () => {
            await expectRevert(
                color.unpause({from: accounts[1]}),
                "Ownable: caller is not the owner"
            )
        })

        it("when paused noone can claim", async () => {
            await color.pause()
            await expectRevert(
                color.claim(255, "Grey93", "this will fail", {from: accounts[0]}),
                "Pausable: paused"
            )
        })

        it("when unpaused we can claim again", async () => {
            await color.unpause()
            receipt = await color.claim(254, "Grey89", "The best grey", { from: accounts[2], value: price })
            await web3.eth.getTransaction(receipt.tx);
        })
    })

    describe("Changing the BaseURI", async () => {
        it("works if you are the owner of the contract", async () => {
            await color.setBaseURI("https://www.test.io/")
            let tokenURI = await color.tokenURI(0)
            expect(tokenURI).to.equal("https://www.test.io/0")
        })

        it("reverts if you are not the owner of the contract", async () => {
            await expectRevert(
                color.setBaseURI("https://www.test.io/", { from: accounts[1] }),
                "caller is not the owner"
            )
        })
    })
})
