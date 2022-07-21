import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";

function CommonModal({
  madalTitle,
  showModal,
  handleClose,
  children
}) {

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{madalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
        {/* <Button variant="primary" onClick={handleClose}>
          Forvard
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default CommonModal;
