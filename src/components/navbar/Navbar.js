import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../images/logo/logo.png";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import WalletDialog from "../wallet/WalletDialog";
import { ethers } from 'ethers';

function NavBar() {
  const navigate = useNavigate();
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };

    checkIfWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
        } else {
          setAccount(accounts[0]);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConnectWallet = () => {
    setShowWalletDialog(true);
  };

  return (
    <>
      <Navbar expand="lg" className="py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="me-lg-5">
            <img className="logo" src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link onClick={() => scrollToSection('marketplace')}>Marketplace</Nav.Link>
              <Nav.Link onClick={() => scrollToSection('about')} className="px-lg-3">
                About Us
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('developers')}>Developers</Nav.Link>
              <Nav.Link as={Link} to="/admin/properties">
                Manage Properties
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div className="d-flex align-items-center order">
            <span className="line d-lg-inline-block d-none"></span>
            <i className="fa-regular fa-heart"></i>
            <Button
              variant="primary"
              className="btn-primary d-none d-lg-inline-block"
              onClick={handleConnectWallet}
            >
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </Button>
          </div>
        </Container>
      </Navbar>
      <WalletDialog 
        show={showWalletDialog} 
        onHide={() => setShowWalletDialog(false)} 
      />
    </>
  );
}

export default NavBar;
