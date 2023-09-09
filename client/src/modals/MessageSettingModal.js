import React from 'react';
import Modal from 'react-modal';
import styles from '../components/ChatInterface/interface.module.css'; // Make sure to import your CSS styles if needed

const customStyles = {
  content: {
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#444654',
    color: '#FFFFFF',
    border: 'none'
  },
  overlay: {
    background: "rgb(19, 19, 19, 0.8)"
  }
};

const CreateRoomModal = ({ modalIsOpen, closeModal, handleRoomName, createNewRoom }) => {
  let subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#00A67E';
  }

  return (
    <Modal
      className={styles.createConversationModal}
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      animationDuration={1000}
    >
      <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Create conversation</h2>
      <form onSubmit={createNewRoom} className={styles.createNewRoomForm}>
        <input type="text" placeholder="Enter room name" onChange={handleRoomName} required />
        <button className={styles.createConversationButton}>Creating confirm</button>
      </form>
    </Modal>
  );
};

export default CreateRoomModal;
