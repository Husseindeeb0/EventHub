import ImageKit from "imagekit";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

let imagekit: ImageKit | null = null;

if (publicKey && privateKey && urlEndpoint) {
    imagekit = new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint,
    });
} else {
    console.warn("⚠️ ImageKit environment variables are missing. Image uploads will not work.");
}

export default imagekit;
