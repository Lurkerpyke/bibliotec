'use client';

import config from '@/lib/config';
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from "sonner"

const { env: { imagekit: { publicKey, urlEndpoint } } } = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Request Failed, status: ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;

    return { signature, expire, token };

  } catch (error: any) {
    throw new  Error(`Failed to authenticate: ${error.message}`);
  }
}

const ImageUpload = ({ onFileChange }: { onFileChange: (file: { filePath: string }) => void }) => {

  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null)
  
  const onError = (error: any) => {
    console.log(error);
    // toast.error(error)
  }
  const onSuccess = (res: any) => {
    console.log('Upload OK:', res); // Verify the response structure
    setFile(res);
    onFileChange({ filePath: res.filePath }); // ✅ Pass an object

    // toast.success('Upload realizado com sucesso!')
  }

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className='hidden'
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName='test-upload.png'
      />

      <button
        className='flex min-h-14 w-full items-center justify-center gap-1.5 rounded-md bg-slate-700'
        onClick={(e) => {
          e.preventDefault();
          
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image src='/icons/upload.svg' alt='upload-icon' width={20} height={20} className='object-contain' />

        <p className='text-base text-primary-foreground'>Faça Upload</p>

        {file && <p className='mt-1 text-center text-xs'>{file.filePath}</p>}
      </button>

      {file &&
        (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={500}
        />
      )
      }
    </ImageKitProvider>
  )
};

export default ImageUpload;