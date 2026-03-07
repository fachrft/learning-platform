import { useState } from "react";

export function useImageKitUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const authRes = await fetch("/api/imagekit/auth");
      if (!authRes.ok) {
        throw new Error("Gagal mendapatkan token otentikasi ImageKit");
      }
      const authData = await authRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      );
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire.toString());
      formData.append("token", authData.token);
      formData.append("fileName", file.name);
      formData.append("folder", "/courses"); 

      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          "https://upload.imagekit.io/api/v1/files/upload",
          true,
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100,
            );
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.url); 
          } else {
            console.error(xhr.responseText);
            const err = "Upload gagal : " + xhr.statusText;
            setError(err);
            reject(new Error(err));
          }
          setIsUploading(false);
        };

        xhr.onerror = () => {
          const err = "Terjadi masalah dengan koneksi internet lu bro.";
          setError(err);
          setIsUploading(false);
          reject(new Error(err));
        };

        xhr.send(formData);
      });
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan upload.");
      setIsUploading(false);
      throw err;
    }
  };

  return { uploadFile, isUploading, progress, error };
}
