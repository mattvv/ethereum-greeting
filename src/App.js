import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = "0x2f136612293341690baC8b06D29d627f48a082B4"

const App = () => {
  const [greeting, setGreetingValue] = useState();

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const fetchGreeting = async () => {
    if (typeof window.ethereum === 'undefined') {
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
   
    try {
      const data = await contract.greet();
      console.log('data: ', data);
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const setGreeting = async () => {
    if (!greeting) {
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      return;
    }

    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
    const transaction = await contract.setGreeting(greeting);
    await transaction.wait();
    fetchGreeting();
  }

  return (
    <div className="App">
      <header className="App-header">
       <button onClick={fetchGreeting}>Fetch Greeting</button>
       <button onClick={setGreeting}>Set Greeting</button>
       <input onChange={e => setGreetingValue(e.target.value)} placehodler="Set greeting" />
      </header>
    </div>
  );
}

export default App;
