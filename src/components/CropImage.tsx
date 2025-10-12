import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface CropImageProps {
  image: string;
  aspect?: number;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

function getCroppedImg(imageSrc: string, crop: Area, zoom: number, aspect: number): Promise<string> {
  // zoom y aspect están disponibles para futuras mejoras, pero no se usan actualmente
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No context');
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        cropWidth,
        cropHeight
      );
      resolve(canvas.toDataURL('image/jpeg'));
    };
    image.onerror = reject;
  });
}

const CropImage: React.FC<CropImageProps> = ({ image, aspect = 4 / 3, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteCb = useCallback((_: unknown, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    const croppedImg = await getCroppedImg(image, croppedAreaPixels, zoom, aspect);
    onCropComplete(croppedImg);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 350, background: '#222' }}>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteCb}
      />
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16 }}>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          style={{ width: 120 }}
        />
        <button onClick={handleDone} className="btn-ice px-4 py-2">Recortar</button>
  <button onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded">Cancelar</button>
      </div>
    </div>
  );
};

export default CropImage;
