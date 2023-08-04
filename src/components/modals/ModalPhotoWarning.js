import React, { useState } from 'react';
import { Modal } from 'antd';
import "./ModalWarning.css"


export const ModalPhotoWarning = ({ modalKey, mediaId, isModalOpen, setIsModalOpen, handleDeletePhotoClick }) => {


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
        key={modalKey}
        title="Confirm Deletion" 
        open={isModalOpen} 
        onOk={ 
          () => { handleOk(mediaId) }} 
        onCancel={handleCancel}
        keyboard
        okText={'Delete'}
        className="modalStyle"
        closeIcon={false}
        maskStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.400)"
        }}
        >
        <p>Are you sure you want to delete this photo?</p>
      </Modal>
    </>
  );
};