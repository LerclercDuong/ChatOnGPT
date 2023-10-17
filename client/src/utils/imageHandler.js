// const onPaste = (event) => {
//     const clipboardData = event.clipboardData || window.clipboardData;
//     const items = clipboardData.items;
//
//     for (let i = 0; i < items.length; i++) {
//         if (items[i].type.indexOf('image') !== -1) {
//             const imageFile = items[i].getAsFile();
//             processImage(imageFile);
//         }
//     }
// };
//
// const processImage = (imageFile) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//         setImageDataURL(event.target.result);
//     };
//     reader.readAsDataURL(imageFile);
// };
//
// export default {
//     onPaste,
//     processImage
// }