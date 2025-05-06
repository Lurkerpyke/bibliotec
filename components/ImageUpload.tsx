'use client';

import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import { useRef, useState } from 'react';
import Image from 'next/image';

const ImageUpload = ({ onFileChange }: { onFileChange: (file: { filePath: string }) => void }) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  // Updated authenticator with better error handling
  const authenticator = async () => {
    try {
      const response = await fetch('/api/auth/imagekit');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      return await response.json();
    } catch (error: any) {
      console.error("Auth Error:", error);
      throw new Error(`ImageKit authentication failed: ${error.message}`);
    }
  };

  const onError = (error: Error) => {
    console.error('Upload Error:', error);
    // toast.error(error.message);
  };

  const onSuccess = (res: any) => {
    console.log('Upload Success:', res);
    setFile(res);
    onFileChange({ filePath: res.filePath });
    // toast.success('Upload successful!');
  };

  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
      authenticator={authenticator}
    >
      <div className="my-auto max-w-[600px]">
        <IKUpload
          ref={ikUploadRef}
          className="hidden"
          onSuccess={onSuccess}
          // Optional parameters:
          folder="/user-uploads"
          useUniqueFileName={true}
          overwriteFile={false}
          isPrivateFile={false}
        />

        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-center gap-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors px-4 py-2"
          onClick={(e) => {
            e.preventDefault();
            (ikUploadRef.current as any)?.click();
          }}
        >
          <Image
            src="/icons/upload.svg"
            alt="Upload icon"
            width={20}
            height={20}
            className="icon"
          />
          <span className="label">Upload Image</span>
          {file && <span className="filename">{file.filePath}</span>}
        </button>

        {file && (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={500}
          />
        )}
      </div>
    </ImageKitProvider>
  );
};

export default ImageUpload;