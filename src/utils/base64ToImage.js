export default async function base64ToImage(base64Image) {
  return await new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);

    image.src = base64Image;
  });
}
