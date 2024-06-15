import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles

const QuillEditor = ({ content, setContent }) => {
  const quillRef = useRef([]);

  useEffect(() => {
    if (quillRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: 'snow', // Specify theme
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
          ]
        }
      });

      quill.on('text-change', () => {
        setContent(quill.root.innerHTML);
      });
    }
  }, [setContent]);

  return <div ref={quillRef} />;
};

export default QuillEditor;