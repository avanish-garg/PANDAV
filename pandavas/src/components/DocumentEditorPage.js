import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles

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

  return (
    <div>
      <h2>Document Editor</h2>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={() => setDocument({ title: '', content: '' })}>New Document</button>
      <ReactQuill value={document.content} onChange={handleContentChange} />
    </div>
  );
}

export default DocumentEditorPage;