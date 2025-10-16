import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [overlays, setOverlays] = useState([]);
  const [rtspUrl, setRtspUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showOverlayModal, setShowOverlayModal] = useState(false);
  const [editingOverlay, setEditingOverlay] = useState(null);
  const [draggedOverlay, setDraggedOverlay] = useState(null);
  const [resizingOverlay, setResizingOverlay] = useState(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Overlay form state
  const [overlayForm, setOverlayForm] = useState({
    name: '',
    type: 'text',
    content: '',
    position: { x: 50, y: 50 },
    size: { width: 200, height: 50 },
    style: {
      fontSize: '16px',
      color: '#FFFFFF',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      fontWeight: 'normal'
    },
    visible: true
  });

  // Fetch overlays on mount
  useEffect(() => {
    fetchOverlays();
    fetchSettings();
  }, []);

  const fetchOverlays = async () => {
    try {
      const response = await fetch(`${API_URL}/api/overlays`);
      const data = await response.json();
      if (data.success) {
        setOverlays(data.data);
      }
    } catch (error) {
      console.error('Error fetching overlays:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/settings`);
      const data = await response.json();
      if (data.success && data.data.rtsp_url) {
        setRtspUrl(data.data.rtsp_url);
        setVolume(data.data.volume || 100);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await fetch(`${API_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rtsp_url: rtspUrl, volume })
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  const openOverlayModal = (overlay = null) => {
    if (overlay) {
      setEditingOverlay(overlay);
      setOverlayForm(overlay);
    } else {
      setEditingOverlay(null);
      setOverlayForm({
        name: '',
        type: 'text',
        content: '',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 50 },
        style: {
          fontSize: '16px',
          color: '#FFFFFF',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          fontWeight: 'normal'
        },
        visible: true
      });
    }
    setShowOverlayModal(true);
  };

  const closeOverlayModal = () => {
    setShowOverlayModal(false);
    setEditingOverlay(null);
  };

  const handleOverlaySubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingOverlay
        ? `${API_URL}/api/overlays/${editingOverlay._id}`
        : `${API_URL}/api/overlays`;
      
      const method = editingOverlay ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overlayForm)
      });
      
      const data = await response.json();
      if (data.success) {
        fetchOverlays();
        closeOverlayModal();
      }
    } catch (error) {
      console.error('Error saving overlay:', error);
    }
  };

  const deleteOverlay = async (id) => {
    if (!window.confirm('Are you sure you want to delete this overlay?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/overlays/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        fetchOverlays();
      }
    } catch (error) {
      console.error('Error deleting overlay:', error);
    }
  };

  const toggleOverlayVisibility = async (overlay) => {
    try {
      await fetch(`${API_URL}/api/overlays/${overlay._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...overlay, visible: !overlay.visible })
      });
      fetchOverlays();
    } catch (error) {
      console.error('Error toggling overlay:', error);
    }
  };

  // Drag and drop handlers
  const handleOverlayMouseDown = (e, overlay) => {
    if (e.target.classList.contains('resize-handle')) return;
    e.stopPropagation();
    setDraggedOverlay({
      id: overlay._id,
      startX: e.clientX - overlay.position.x,
      startY: e.clientY - overlay.position.y
    });
  };

  const handleMouseMove = (e) => {
    if (draggedOverlay && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(rect.width - 50, e.clientX - rect.left - draggedOverlay.startX));
      const newY = Math.max(0, Math.min(rect.height - 50, e.clientY - rect.top - draggedOverlay.startY));
      
      updateOverlayPosition(draggedOverlay.id, { x: newX, y: newY });
    }
    
    if (resizingOverlay && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(50, e.clientX - rect.left - resizingOverlay.startX);
      const newHeight = Math.max(30, e.clientY - rect.top - resizingOverlay.startY);
      
      updateOverlaySize(resizingOverlay.id, { width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    if (draggedOverlay) {
      const overlay = overlays.find(o => o._id === draggedOverlay.id);
      if (overlay) {
        saveOverlayPosition(overlay);
      }
      setDraggedOverlay(null);
    }
    if (resizingOverlay) {
      const overlay = overlays.find(o => o._id === resizingOverlay.id);
      if (overlay) {
        saveOverlaySize(overlay);
      }
      setResizingOverlay(null);
    }
  };

  const updateOverlayPosition = (id, position) => {
    setOverlays(prev => prev.map(o => 
      o._id === id ? { ...o, position } : o
    ));
  };

  const updateOverlaySize = (id, size) => {
    setOverlays(prev => prev.map(o => 
      o._id === id ? { ...o, size } : o
    ));
  };

  const saveOverlayPosition = async (overlay) => {
    try {
      await fetch(`${API_URL}/api/overlays/${overlay._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: overlay.position })
      });
    } catch (error) {
      console.error('Error saving overlay position:', error);
    }
  };

  const saveOverlaySize = async (overlay) => {
    try {
      await fetch(`${API_URL}/api/overlays/${overlay._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: overlay.size })
      });
    } catch (error) {
      console.error('Error saving overlay size:', error);
    }
  };

  const handleResizeMouseDown = (e, overlay) => {
    e.stopPropagation();
    setResizingOverlay({
      id: overlay._id,
      startX: overlay.position.x,
      startY: overlay.position.y
    });
  };

  useEffect(() => {
    if (draggedOverlay || resizingOverlay) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedOverlay, resizingOverlay]);

  return (
    <div className="app" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="logo">LiveStream Pro</h1>
          <nav className="nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <button className="cta-button" onClick={() => window.scrollTo({ top: document.querySelector('.app-section').offsetTop, behavior: 'smooth' })}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">Professional RTSP Livestream with Custom Overlays</h2>
            <p className="hero-subtitle">
              Stream RTSP video feeds with powerful overlay customization. 
              Add logos, text, and branding in real-time.
            </p>
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => window.scrollTo({ top: document.querySelector('.app-section').offsetTop, behavior: 'smooth' })}>
                Launch App
              </button>
              <button className="secondary-button">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="video-preview">
              <div className="preview-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📹</div>
              <h3>RTSP Streaming</h3>
              <p>Connect to any RTSP stream and watch in real-time with full playback controls</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Custom Overlays</h3>
              <p>Add text and image overlays with full positioning and styling control</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Save Settings</h3>
              <p>Save and manage multiple overlay configurations for different streams</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Works seamlessly across all devices - desktop, tablet, and mobile</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Section */}
      <section className="app-section">
        <div className="container">
          <h2 className="section-title">Livestream Player</h2>
          
          {/* RTSP URL Input */}
          <div className="url-input-section">
            <input
              type="text"
              className="url-input"
              placeholder="Enter RTSP URL (e.g., rtsp://example.com/stream)"
              value={rtspUrl}
              onChange={(e) => setRtspUrl(e.target.value)}
            />
            <button className="primary-button" onClick={saveSettings}>
              Save URL
            </button>
          </div>

          {/* Video Player */}
          <div className="player-container" ref={containerRef}>
            {rtspUrl ? (
              <>
                <video
                  ref={videoRef}
                  className="video-player"
                  src={rtspUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  Your browser does not support the video tag.
                  For RTSP streams, you may need to use HLS.js or a transcoding service.
                </video>
                
                {/* Overlays */}
                {overlays.filter(o => o.visible).map((overlay) => (
                  <div
                    key={overlay._id}
                    className="overlay"
                    style={{
                      left: `${overlay.position.x}px`,
                      top: `${overlay.position.y}px`,
                      width: `${overlay.size.width}px`,
                      height: `${overlay.size.height}px`,
                      ...overlay.style,
                      cursor: draggedOverlay?.id === overlay._id ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={(e) => handleOverlayMouseDown(e, overlay)}
                  >
                    {overlay.type === 'text' && <span>{overlay.content}</span>}
                    {overlay.type === 'image' && <img src={overlay.content} alt={overlay.name} />}
                    <div
                      className="resize-handle"
                      onMouseDown={(e) => handleResizeMouseDown(e, overlay)}
                    ></div>
                  </div>
                ))}
              </>
            ) : (
              <div className="placeholder">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <p>Enter an RTSP URL to start streaming</p>
              </div>
            )}

            {/* Controls */}
            {rtspUrl && (
              <div className="controls">
                <button className="control-button" onClick={handlePlayPause}>
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>
                <div className="volume-control">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                  <span className="volume-value">{volume}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Overlay Management */}
          <div className="overlay-management">
            <div className="overlay-header">
              <h3>Manage Overlays</h3>
              <button className="primary-button" onClick={() => openOverlayModal()}>
                + Add Overlay
              </button>
            </div>
            
            <div className="overlay-list">
              {overlays.map((overlay) => (
                <div key={overlay._id} className="overlay-item">
                  <div className="overlay-info">
                    <h4>{overlay.name}</h4>
                    <span className="overlay-type">{overlay.type}</span>
                  </div>
                  <div className="overlay-actions">
                    <button
                      className={`toggle-button ${overlay.visible ? 'active' : ''}`}
                      onClick={() => toggleOverlayVisibility(overlay)}
                    >
                      {overlay.visible ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button className="edit-button" onClick={() => openOverlayModal(overlay)}>
                      ✏️
                    </button>
                    <button className="delete-button" onClick={() => deleteOverlay(overlay._id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {overlays.length === 0 && (
                <p className="empty-state">No overlays yet. Create your first overlay to get started!</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overlay Modal */}
      {showOverlayModal && (
        <div className="modal-overlay" onClick={closeOverlayModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingOverlay ? 'Edit Overlay' : 'Create Overlay'}</h3>
              <button className="close-button" onClick={closeOverlayModal}>×</button>
            </div>
            <form onSubmit={handleOverlaySubmit} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={overlayForm.name}
                  onChange={(e) => setOverlayForm({ ...overlayForm, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Type</label>
                <select
                  value={overlayForm.type}
                  onChange={(e) => setOverlayForm({ ...overlayForm, type: e.target.value })}
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>{overlayForm.type === 'text' ? 'Text Content' : 'Image URL'}</label>
                <input
                  type="text"
                  value={overlayForm.content}
                  onChange={(e) => setOverlayForm({ ...overlayForm, content: e.target.value })}
                  placeholder={overlayForm.type === 'text' ? 'Enter text...' : 'Enter image URL...'}
                  required
                />
              </div>
              
              {overlayForm.type === 'text' && (
                <>
                  <div className="form-group">
                    <label>Font Size</label>
                    <input
                      type="text"
                      value={overlayForm.style.fontSize}
                      onChange={(e) => setOverlayForm({
                        ...overlayForm,
                        style: { ...overlayForm.style, fontSize: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Text Color</label>
                    <input
                      type="color"
                      value={overlayForm.style.color}
                      onChange={(e) => setOverlayForm({
                        ...overlayForm,
                        style: { ...overlayForm.style, color: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Background Color</label>
                    <input
                      type="text"
                      value={overlayForm.style.backgroundColor}
                      onChange={(e) => setOverlayForm({
                        ...overlayForm,
                        style: { ...overlayForm.style, backgroundColor: e.target.value }
                      })}
                      placeholder="e.g., rgba(0, 0, 0, 0.5)"
                    />
                  </div>
                </>
              )}
              
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={closeOverlayModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingOverlay ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 LiveStream Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;