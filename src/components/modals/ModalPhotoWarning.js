import React, { useState } from 'react';
import { Modal } from 'antd';
import "./ModalWarning.css"


export const ModalPhotoWarning = ({ mediaId, isModalOpen, setIsModalOpen, handleDeletePhotoClick }) => {


  const handleOk = (mediaId) => {
    handleDeletePhotoClick(mediaId)
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
          () => { handleOk(mediaId) }} 
        onCancel={handleCancel}
        keyboard
        okText={'Delete'}
        className="modalStyle"
        closeIcon={false}
        >
        <p>Are you sure you want to delete this photo?</p>
      </Modal>
    </>
  );
};