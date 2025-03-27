import React from 'react';

interface GeneratedImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({
  imageUrl,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="generated-image-container loading">
        <div className="loading-spinner" style={{ textAlign: 'center', padding: '20px' }}>
          <div
            style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 2s linear infinite',
              margin: '0 auto',
            }}
          />
          <p>Generating your art...</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="generated-image-container empty">
        <p className="empty-message" style={{ textAlign: 'center', color: '#666' }}>
          Your generated art will appear here. Draw something and click "Generate Art"!
        </p>
      </div>
    );
  }

  return (
    <div className="generated-image-container" style={{ textAlign: 'center' }}>
      <img
        src={imageUrl}
        alt="Generated art"
        className="generated-image"
        style={{
          maxWidth: '100%',
          maxHeight: '500px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      />
      <div className="download-container" style={{ marginTop: '15px' }}>
        <a
          href={imageUrl}
          download="draw-with-me-art.png"
          target="_blank"
          rel="noopener noreferrer"
          className="download-button"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block',
            fontWeight: 'bold',
          }}
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default GeneratedImageDisplay; 