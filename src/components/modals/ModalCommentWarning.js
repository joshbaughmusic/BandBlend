import React, { useState } from 'react';
import { Modal } from 'antd';
import "./ModalWarning.css"


export const ModalCommentWarning = ({ commentId, isModalOpen, setIsModalOpen, handleDeleteCommentClick }) => {


  const handleOk = (commentId) => {
    handleDeleteCommentClick(commentId)
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
          () => { handleOk(commentId) }} 
        onCancel={handleCancel}
        keyboard
        okText={'Delete'}
        className="modalStyle"
        closeIcon={false}
        >
        <p>Are you sure you want to delete this comment?</p>
      </Modal>
    </>
  );
};