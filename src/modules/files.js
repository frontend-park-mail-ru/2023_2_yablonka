const readFileAsByteArray = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result;
            const byteArray = new Uint8Array(arrayBuffer);
            resolve(byteArray);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });

export default readFileAsByteArray;
