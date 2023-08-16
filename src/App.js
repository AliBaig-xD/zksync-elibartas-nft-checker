import React, { useState } from "react";
import "./App.css";

function App() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState("");
  const [eligibleAddresses, setEligibleAddresses] = useState([]);
  const [results, setResults] = useState({
    total: 0,
    eligible: 0,
    ineligible: 0,
  });

  const checkEligibility = async () => {
    setLoading(true);
    const allAddresses = addresses.split("\n");
    let eligibleCount = 0;

    for (let address of allAddresses) {
      const response = await fetch(
        `https://qr-mint.g7p.io/api/checkWhitelist?wallet=${address}`
      );
      const data = await response.json();

      if (data.success) {
        eligibleCount++;
        setEligibleAddresses((prev) => [...prev, address]);
      }

      setResults((prev) => ({
        total: allAddresses.length,
        eligible: eligibleCount,
        ineligible: allAddresses.length - eligibleCount,
      }));
    }

    setLoading(false);
  };

  const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showSnackbar();
    } catch (error) {
        console.error("Failed to copy text: ", error);
    }
};

const showSnackbar = () => {
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000);  // hide after 3 seconds
};


  return (
    <div className="App">
      <h1>ELIBERTAS OMNIBUS ZKSYNC NFT ELIGIBILITY CHECKER</h1>
      <textarea
        value={addresses}
        onChange={(e) => setAddresses(e.target.value)}
        placeholder="Paste your ETH addresses here, one per line."
      />
      <button onClick={checkEligibility}>
        {loading ? <div className="loader"></div> : "Check Eligibility"}
      </button>
      <div className="results">
        <p>
          Total Wallets Entered: <span>{results.total}</span>
        </p>
        <p>
          Eligible Wallets: <span>{results.eligible}</span>
        </p>
        <p>
          Ineligible Wallets: <span>{results.ineligible}</span>
        </p>
      </div>
      {eligibleAddresses.length > 0 && (
        <div className="eligible-addresses">
          <h2>Eligible Addresses</h2>
          <div className="addresses">
            {eligibleAddresses.map((address, index) => (
              <div className="address-card" key={index} onClick={() => copyToClipboard(address)}>
                {address}
              </div>
            ))}
          </div>
        </div>
      )}
      {snackbarVisible && <div className="snackbar">Copied to clipboard!</div>}
    </div>
  );
}

export default App;
