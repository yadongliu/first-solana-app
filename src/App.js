import { useState, useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import ild from "./idl.json"

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
]

const App = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [formData, setFormData] = useState({"gif": ""})
  const [gifList, setGifList] = useState([])

  useEffect(() => {
    const onLoad = () => {
      checkIfWalletIsConnected();
    }

    window.addEventListener('load', onLoad);

    return () => window.removeEventListener('load', onLoad);
  }, [])

  useEffect(()=>{
    setGifList(TEST_GIFS)
  }, [walletAddress])

  async function checkIfWalletIsConnected() {
    try {
      const {solana} = window
      if(solana) {
        if(solana.isPhantom) {
          console.log("Solana Phantom wallet detected! ")
          const response = await solana.connect({ onlyIfTrusted: true })
          console.log('Connected with Public Key:', response.publicKey.toString())

          setWalletAddress(response.publicKey.toString())
        }
      } else {
        console.log("There is no Solana wallet extension!")
      }  
    } catch (e) {
      console.log(e)
    }
  }

  async function connectWallet() { 
    try {
      const {solana} = window
      if(solana) {
        if(solana.isPhantom) {
          const response = await solana.connect()
          console.log('Connected with Wallet Public Key:', response.publicKey.toString())

          setWalletAddress(response.publicKey.toString())
        }
      } else {
        console.log("There is no Solana wallet extension!")
      }  
    } catch (e) {
      console.log(e)
    }
  }

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );
  
  async function addGif() {
    if(formData.gif.length > 0) {
      console.log("gif url ", formData.gif)
      setGifList( prevList => {
        const newGifList = [...prevList, formData.gif]
        return newGifList
      })
      setFormData(prevFormData => {
        return {
          ...prevFormData,
          gif: ''
        }  
      })
    } else {
      console.log("gif url empty")
    }
  }

  function handleInput(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    })
  }

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          addGif();
        }}
      >
        <input type="text" value={formData.gif} placeholder="Enter gif link!" 
          onChange={handleInput} name="gif" />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
        {!walletAddress && renderNotConnectedContainer()}
        {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
