"use client";

import { useState, useRef } from "react";
import AWS from "aws-sdk";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    setMessage(null);
    setProgress("0%");

    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string;
    const region = process.env.NEXT_PUBLIC_AWS_REGION as string;
    const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string;
    const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string;
    const accelerateEndpoint = process.env.NEXT_PUBLIC_AWS_ACCELERATE_ENDPOINT as string;

    AWS.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });

    const s3 = new AWS.S3({
      endpoint: accelerateEndpoint,
      s3BucketEndpoint: true,
    });

    const params = {
      Bucket: bucketName,
      Key: `uploads/${selectedFile.name}`,
      Body: selectedFile,
      ACL: "public-read",
    };

    const upload = new AWS.S3.ManagedUpload({ params });

    upload.on("httpUploadProgress", (progress) => {
      const percentage = Math.round((progress.loaded / progress.total) * 100);
      setProgress(`${percentage}%`);
    });

    try {
      await upload.promise();
      setMessage("File uploaded successfully!");

      setTimeout(() => {
        setSelectedFile(null);
        setProgress(null);
        setMessage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    } catch (error) {
      setMessage(`Upload failed: ${error}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Upload Photo to S3</h1>

        {/* File input allows only images (JPG, PNG) and PDFs */}
        <input
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
          className="block w-full text-gray-700 border border-gray-300 rounded-lg p-2 mb-4"
          ref={fileInputRef}
        />
        
        <button
          onClick={uploadPhoto}
          disabled={!selectedFile}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 mb-4"
        >
          Upload Photo
        </button>

        {/* Progress display */}
        {progress && <p className="text-center text-gray-700">{progress}</p>}

        {/* Success or error message */}
        {message && <p className={`text-center mt-2 ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
      </div>
    </main>
  );
}
