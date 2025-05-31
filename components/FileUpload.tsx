//components/FileUpload.tsx
"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import config from "@/lib/config";

// Original ImageUpload component (keep unchanged)
const ImageUpload = ({ onFileChange }: { onFileChange: (file: { filePath: string }) => void }) => {
    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<{ filePath: string } | null>(null);

    const authenticator = async () => {
        try {
            const response = await fetch('/api/imagekit');

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
    };

    const onSuccess = (res: any) => {
        setFile(res);
        onFileChange(res.filePath);
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
                        height={300}
                    />
                )}
            </div>
        </ImageKitProvider>
    );
};

// New FileUpload implementation (additional component)
interface FileUploadProps {
    type: "image" | "video";
    accept: string;
    placeholder: string;
    folder: string;
    variant: "dark" | "light";
    onFileChange: (filePath: string) => void;
    value?: string;
}

const FileUpload = ({
    type,
    accept,
    placeholder,
    folder,
    variant,
    onFileChange,
    value,
}: FileUploadProps) => {
    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: value ?? null,
    });
    const [progress, setProgress] = useState(0);

    const authenticator = async () => {
        try {
            const response = await fetch(`/api/imagekit`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            return { token: data.token, expire: data.expire, signature: data.signature };
        } catch (error: any) {
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    };

    const styles = {
        button: variant === "dark" ? "bg-dark-300" : "bg-light-600 border-gray-100 border",
        placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
        text: variant === "dark" ? "text-light-100" : "text-dark-400",
    };

    const onError = (error: any) => {
        console.error(error);
        toast.error(`Your ${type} could not be uploaded. Please try again.`);
    };

    const onSuccess = (res: any) => {
        setFile(res);
        onFileChange(res.filePath);
        toast.success(`${res.filePath} uploaded successfully!`);
    };

    const onValidate = (file: File) => {
        const maxSize = type === "image" ? 20 * 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(`Please upload a file less than ${maxSize / 1024 / 1024}MB`);
            return false;
        }
        return true;
    };

    return (
        <ImageKitProvider
            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
            authenticator={authenticator}
        >
            <div className="space-y-3">
                <IKUpload
                    ref={ikUploadRef}
                    onError={onError}
                    onSuccess={onSuccess}
                    validateFile={onValidate}
                    onUploadStart={() => setProgress(0)}
                    onUploadProgress={({ loaded, total }) =>
                        setProgress(Math.round((loaded / total) * 100))
                    }
                    folder={folder}
                    accept={accept}
                    className="hidden"
                    useUniqueFileName
                />

                <button
                    className={cn("flex items-center justify-center gap-2 p-3 rounded-md transition-colors", styles.button)}
                    onClick={(e) => {
                        e.preventDefault();
                        (ikUploadRef.current as any)?.click();
                    }}
                >
                    <Image
                        src="/icons/upload.svg"
                        alt="upload-icon"
                        width={20}
                        height={20}
                        className={cn("object-contain", variant === 'dark' ? 'invert' : '')}
                    />
                    <p className={cn("text-sm", styles.placeholder)}>{placeholder}</p>
                    {file?.filePath && (
                        <p className={cn("truncate text-sm", styles.text)}>
                            {file.filePath.split('/').pop()}
                        </p>
                    )}
                </button>

                {progress > 0 && progress < 100 && (
                    <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {file?.filePath && (
                    <div className="mt-4">
                        {type === "image" ? (
                            <IKImage
                                path={file.filePath}
                                alt="Upload preview"
                                className="rounded-lg border border-slate-100"
                                width={500}
                                height={300}
                            />
                        ) : (
                            <IKVideo
                                path={file.filePath}
                                controls
                                className="h-64 w-full rounded-lg object-cover"
                            />
                        )}
                    </div>
                )}
            </div>
        </ImageKitProvider>
    );
};

export { ImageUpload, FileUpload };