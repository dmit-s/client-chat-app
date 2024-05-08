export default async function imageToBase64(img) {
  return await new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });
}
