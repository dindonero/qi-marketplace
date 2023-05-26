import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import type {AppProps} from "next/app";
import {MoralisProvider} from "react-moralis";
import {AppContextProvider} from "./contexts/AppConfig";
import {NotificationProvider} from "web3uikit";
import NetworkBanner from "./components/NetworkBanner";
import Header from "./components/Header";
import MintButton from "./components/MintButton";
// import Home from './pages/Home';
// import NoMatch from './components/NoMatch';

function App() {
  return (
    <>
    <MoralisProvider initializeOnMount={false}>
          <AppContextProvider>
              <NotificationProvider>
                  <NavBar />
                  {/* <Component {...pageProps} /> */}
              </NotificationProvider>
          </AppContextProvider>
      </MoralisProvider>
      <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="*" element={<NoMatch />} /> */}
          {/* <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} /> */}
      </Routes>
    </>
  );
}

export default App;
