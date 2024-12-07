import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageCropper = () => {
  const cropperRef = useRef(null);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      setCroppedImage(cropper.getCroppedCanvas().toDataURL());
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onImageChange} />
      {image && (
        <Cropper
          src={image}
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={1}
          aspectRatio={1}
          guides={false}
          ref={cropperRef}
        />
      )}
      <button onClick={getCroppedImage}>Crop</button>
      {croppedImage && (
        <div>
          <h3>Cropped Image:</h3>
          <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
