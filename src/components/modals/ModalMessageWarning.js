import React, { useState } from 'react';
import { Modal } from 'antd';
import "./ModalWarning.css"


export const ModalMessageWarning = ({ messageId, isModalOpen, setIsModalOpen, handleDeleteMessageClick }) => {


  const handleOk = (messageId) => {
    handleDeleteMessageClick(messageId)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      
      <Modal 
        title="Confirm Deletion" 
        open={isModalOpen} 
        onOk={ 
          () => { handleOk(messageId) }} 
        onCancel={handleCancel}
        keyboard
        okText={'Delete'}
        className="modalStyle"
        closeIcon={false}
        >
        <p>Are you sure you want to delete this message?</p>
      </Modal>
    </>
  );
};