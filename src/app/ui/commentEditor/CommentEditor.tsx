import React, { useRef } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { Editor } from 'tinymce';
import { createTinyMCEConfig } from './CommentEditor.config';

interface CommentEditorProps {
  initialValue?: string;
  onContentChange: (content: string) => void;
  onImageUpload: (url: string) => void;
}

const CommentEditor: React.FC<CommentEditorProps> = ({
  initialValue = '',
  onContentChange,
  onImageUpload,
}) => {
  // Type the ref as Editor or null
  const editorRef = useRef<Editor | null>(null); // Correct type here

  const handleEditorChange = (content: string) => {
    onContentChange(content);
  };

  console.log("comment editor", process.env.NEXT_PUBLIC_TINYMCE_API_KEY);
  console.log("env", process.env);

  return (
    <TinyMCEEditor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => (editorRef.current = editor)} // Set the editorRef correctly
      initialValue={initialValue}
      init={createTinyMCEConfig(onImageUpload)}
      onEditorChange={handleEditorChange}
    />
  );
};

export default CommentEditor;
