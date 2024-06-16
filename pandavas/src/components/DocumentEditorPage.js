import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles
import './DocumentEditorPage.css'; // Import CSS for styling

function DocumentEditorPage() {
  const [document, setDocument] = useState({ title: '', content: '' });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocument({ ...document, content: e.target.result });
      };
      reader.readAsText(file);
    }
  };

  const handleContentChange = (content) => {
    setDocument({ ...document, content });
  };

  const handleNewDocument = () => {
    setDocument({ title: '', content: '' });
  };

  return (
    <div className="document-editor-page">
      <h2>Document Editor</h2>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleNewDocument}>New Document</button>
      <ReactQuill value={document.content} onChange={handleContentChange} />
    </div>
  );
}

export default DocumentEditorPage;
