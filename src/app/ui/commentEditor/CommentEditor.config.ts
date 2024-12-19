// src/config/editorConfig.ts
export const tinyMCEConfig = {
    height: 500,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount',
    ],
    toolbar:
      'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | image code',
    images_upload_url: '/api/upload-image', // Placeholder for your upload endpoint
    automatic_uploads: true,
    image_advtab: true,
  };