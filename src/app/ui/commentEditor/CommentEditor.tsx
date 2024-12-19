// src/components/SmartEditor.tsx
'use client';
import React, { useRef } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react'; // Import the Editor component
import { Editor } from 'tinymce'; // Import the Editor type from tinymce
import { tinyMCEConfig } from './CommentEditor.config';

interface CommentEditorProps {
  initialValue?: string;
  onContentChange: (content: string) => void;
}

const CommentEditor: React.FC<CommentEditorProps> = ({ initialValue = '', onContentChange }) => {
  const editorRef = useRef<Editor | null>(null); // Use the correct type for the editor instance

  const handleEditorChange = (content: string) => {
    onContentChange(content);
  };

  console.log("^^^^^^^^^^^^^^^^^",process.env.NEXT_PUBLIC_TINYMCE_API_KEY);

  return (
    <TinyMCEEditor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // Replace with your TinyMCE API key
      onInit={(evt, editor) => (editorRef.current = editor)} // Assign the editor instance
      initialValue={initialValue}
      init={{
        ...tinyMCEConfig,
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default CommentEditor;