import { InitOptions } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor";

interface BlobInfo {
    blob: () => Blob;
    filename: () => string;
    id: () => string;
  }

  export const createTinyMCEConfig = (onImageUpload: (url: string) => void): InitOptions => ({
    height: 500,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount',
    ],
    toolbar:
      'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | image code',
    automatic_uploads: true,
    image_advtab: true,
    images_upload_handler: (
      blobInfo: BlobInfo, // BlobInfo object
      progress: (percent: number) => void, // Progress callback
    ): Promise<string> => { // Return type must be Promise<string>
      return new Promise((resolve, reject) => {
        // Simulate progress reporting for upload
        const simulateProgress = (percent: number) => {
          progress(percent); // Reports progress
        };
  
        try {
          const formData = new FormData();
          formData.append('file', blobInfo.blob());
  
          fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.success && result.data?.secure_url) {
                onImageUpload(result.data.secure_url); // Pass image URL to parent component
                resolve(result.data.secure_url); // Return the image URL as the resolved promise value
              } else {
                reject('Failed to upload image'); // Reject if upload fails
              }
            })
            .catch((error) => {
              reject('Image upload error: ' + error); // Reject on fetch error
            });
  
          // Simulate upload progress (just an example)
          let percent = 0;
          const interval = setInterval(() => {
            if (percent < 100) {
              percent += 10;
              simulateProgress(percent); // Update progress
            } else {
              clearInterval(interval);
            }
          }, 500);
        } catch (error) {
          reject('Error uploading image: ' + error); // Reject on general error
        }
      });
    },
  });
  
  
  
  