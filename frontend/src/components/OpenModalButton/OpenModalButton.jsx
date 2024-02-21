import { useModal } from '../../context/Modal';
import './OpenModalButton.css'

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const buttonStyle = {
    border: "1px solid black",
    boxShadow: "3px 3px 2px black",
    backgroundColor: "#236db7",
    color: "white",
    borderRadius: "3px",
    cursor: "pointer",
    padding: "5px 10px",
  };


  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button style={buttonStyle} onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
