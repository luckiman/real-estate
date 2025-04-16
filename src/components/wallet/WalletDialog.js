import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

function WalletDialog({ show, onHide }) {
  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      toast.success('Wallet connected successfully!');
      onHide();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="wallet-dialog">
      <Modal.Header closeButton>
        <Modal.Title>Connect Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-grid gap-2">
          <Button
            variant="outline-primary"
            className="d-flex align-items-center justify-content-center py-3"
            onClick={connectMetaMask}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              alt="MetaMask"
              width="24"
              height="24"
              className="me-2"
            />
            MetaMask
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default WalletDialog; 