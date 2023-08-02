import React, { useState } from 'react';
import { Modal } from 'antd';
import "./ModalWarning.css"


export const ModalPostWarning = ({ postId, isModalOpen, setIsModalOpen, handleDeletePostClick }) => {


  const handleOk = (postId) => {
    handleDeletePostClick(postId)
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
          () => { handleOk(postId) }} 
        onCancel={handleCancel}
        keyboard
        okText={'Delete'}
        className="modalStyle"
        closeIcon={false}
        >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
    </>
  );
};