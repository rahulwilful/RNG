import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const DeleteModal = ({ show, message, onHide, handleClearHistory, closeModal }) => {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const jokerValueRef = useRef(null);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        jokerValueRef.current?.focus();
      }, 0);
    }
  }, [show]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!jokerValue) return;

    addManualEntry(message === 'Andar Wins' ? 'A' : 'B', jokerValue);
    closeModal();
  };

  return (
    <Modal size="lg" centered show={show} onHide={handleClose} contentClassName=" ">
      <Modal.Body
        className="d-flex flex-column justify-content-between align-items-center"
        style={{
          height: '50vh',
          borderRadius: 10,
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          overflow: 'visible'
        }}>
        <div className="h-100  d-flex flex-column justify-content-center align-items-center gap-4 d-flex">
          <h4 className="fw-bold text-dark">{message}</h4>
          <div className="d-flex gap-2">
            <button className={`btn btn-sm d-flex btn-danger   mb-3`} onClick={handleClearHistory}>
              Clear
            </button>

            {/*
            <button className={`btn btn-sm d-flex btn-danger   mb-3`} onClick={reduceCountsBy1AndSave }>
              -1
            </button>
            */}
            <button className={`btn btn-sm d-flex btn-success mb-3`} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
