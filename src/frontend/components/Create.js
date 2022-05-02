import { useState , useRef } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import React, { useContext } from 'react';

 
//import Bids from 'Bids';
 
//import Bids from './Bid'
//import  AddAuction from './AddAuction'
//import {  } from 'src/frontend/components/Bid.js'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


const Create = ({ marketplace, nft }) => {
  
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [Duration, setDuration] = useState('')
  const [description, setDescription] = useState('')

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      const result = await client.add(JSON.stringify({image, price, name, description}))
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()}
    
    const Auction  = async(result) => {
    
        

    }
     
      
   
  

  
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
                
              </div>
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Lazy Mint
                </Button>
                
              </div>
              <div className="d-grid px-0">

                </div>
                <div className="d-grid px-0">
                <div>
      <label>Time Duration Of Auction:</label>
      <div class="input-icons">
        <i class="fa fa-calendar icon"></i>
        <input
          class="input-field"
          type="text"
          placeholder="Select date"
          id="selectedDateField"
          readonly
        />
      </div>
      <div id="dateDropdownDiv">
        <select
          id="yearDropdownField"
          onchange="onChangeYearAndMonth(this)"
        ></select>
        <select
          id="monthDropdownField"
          onchange="onChangeYearAndMonth(this)"
        ></select>
        <select id="dateDropdownField"></select>
        <button onclick="onOkClick()">Ok</button>
         
      </div>
    </div>
                
                <Button onClick={setTimeout( Auction,Duration)} variant="primary" size="lg">
                  Timed Auction
                </Button>
                
               
                
              </div>
              <div className="d-grid px-0">

                </div>
                <Row>
             
                 
               
            </Row>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create