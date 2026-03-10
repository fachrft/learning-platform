import Imagekit from "imagekit";

export const imagekit = new Imagekit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

interface FileResponse {
  type: string;
  url: string;
  fileId: string;
}

export async function deleteImageKitFileByUrl(url: string | null | undefined) {
  if (!url) return;
  try {
    const baseUrl = url.split("?")[0];
    const fileName = baseUrl.split("/").pop();
    if (!fileName) return;

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
    const authHeader = `Basic ${Buffer.from(privateKey + ":").toString("base64")}`;

    const searchResponse = await fetch(
      `https://api.imagekit.io/v1/files?searchQuery=${encodeURIComponent(`name="${fileName}"`)}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
      },
    );

    if (!searchResponse.ok) {
      console.error("Gagal mendapat info file dari ImageKit");
      return;
    }

    const files = (await searchResponse.json()) as FileResponse[];
    const file = files.find(
      (f) => f.type === "file" && f.url && f.url.split("?")[0] === baseUrl,
    );
    if (file && file.fileId) {
      const deleteResponse = await fetch(
        `https://api.imagekit.io/v1/files/${file.fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: authHeader,
          },
        },
      );

      if (deleteResponse.ok) {
        console.log(`Berhasil dihapus file ImageKit: ${file.fileId}`);
      } else {
        console.error(
          `Gagal menghapus file ImageKit API: ${deleteResponse.statusText}`,
        );
      }
    }
  } catch (error) {
    console.error("Error saat menghapus image dari ImageKit:", error);
  }
}
