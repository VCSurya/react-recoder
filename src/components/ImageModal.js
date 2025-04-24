import React, { useState, useEffect, useCallback } from 'react';
import '../styles/ImageModal.css';

const ImageModal = () => {
  const [isActive, setIsActive] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [currentZoom, setCurrentZoom] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  // Function to open the modal
  const showModal = useCallback((src) => {
    setImageSrc(src);
    setIsActive(true);
    setCurrentZoom(1);
    setTranslateX(0);
    setTranslateY(0);
    document.body.style.overflow = 'hidden';
  }, []);

  // Function to close the modal
  const closeModal = useCallback(() => {
    setIsActive(false);
    document.body.style.overflow = 'auto';
  }, []);

  // Update zoom and position
  const updateZoom = useCallback(() => {
    const transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
    const zoomLevel = document.querySelector('.zoom-level');
    
    if (zoomLevel) {
      zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    }
    
    return transform;
  }, [currentZoom, translateX, translateY]);

  // Zoom in function
  const zoomIn = useCallback(() => {
    setCurrentZoom(prev => Math.min(prev + 0.25, 4));
  }, []);

  // Zoom out function
  const zoomOut = useCallback(() => {
    setCurrentZoom(prev => Math.max(prev - 0.25, 1));
    if (currentZoom <= 1.25) {
      setTranslateX(0);
      setTranslateY(0);
    }
  }, [currentZoom]);

  // Reset zoom function
  const resetZoom = useCallback(() => {
    setCurrentZoom(1);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e) => {
    if (currentZoom > 1) {
      setIsDragging(true);
      setStartX(e.clientX - translateX);
      setStartY(e.clientY - translateY);
    }
  }, [currentZoom, translateX, translateY]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      e.preventDefault();
      setTranslateX(e.clientX - startX);
      setTranslateY(e.clientY - startY);
    }
  }, [isDragging, startX, startY]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Set up global event listeners
  useEffect(() => {
    // Expose the showModal function globally
    window.showImageModal = showModal;
    
    // Setup event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Add click handlers for images
    const setupImageClickHandlers = () => {
      document.querySelectorAll('.icon-preview-large, .event-screenshot, .screenshot-preview, .icon-preview')
        .forEach(img => {
          img.addEventListener('click', () => showModal(img.src));
        });
    };
    
    // Initial setup
    setupImageClickHandlers();
    
    // Setup a mutation observer to handle dynamically added images
    const observer = new MutationObserver(setupImageClickHandlers);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Close modal on Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isActive) {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
      delete window.showImageModal;
    };
  }, [showModal, closeModal, handleMouseMove, handleMouseUp, isActive]);

  return (
    <div className={`image-modal ${isActive ? 'active' : ''}`} id="imageModal">
      <span className="close-modal" id="closeModal" onClick={closeModal}>&times;</span>
      <div className="modal-content">
        <img 
          className={`modal-image ${currentZoom > 1 ? 'zoomed' : ''}`} 
          id="modalImage" 
          src={imageSrc} 
          alt="Event Screenshot"
          style={{ transform: updateZoom() }}
          onMouseDown={handleMouseDown}
        />
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={zoomOut}>-</button>
          <span className="zoom-level">{Math.round(currentZoom * 100)}%</span>
          <button className="zoom-btn" onClick={zoomIn}>+</button>
          <button className="zoom-btn" onClick={resetZoom}>⟲</button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 