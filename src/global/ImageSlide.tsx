import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
interface Props {
  imageUrl: string;
  images?:
    | {
        imageName: string;
      }[]
    | undefined;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

let ImageSlider: React.FC<Props> = ({
  imageUrl,
  images,
  currentIndex,
  setCurrentIndex,
}) => {
  // scroll to the previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Number(images?.length) - 1 : prevIndex - 1
    );
  };

  // scroll to the next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === Number(images?.length) - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-full  z-0 p-2">
      {/* Carousel Images */}
      <div className="overflow-hidden relative h-full">
        {images && images.length > 0 ? (
          <div
            className="flex transition-transform duration-1000 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images?.map((image, index) => (
              <img
                key={index}
                src={`${imageUrl}/${image.imageName}`}
                alt={`Slide ${index + 1}`}
                className="w-full h-full flex-shrink-0 object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center">
            <h1 className="flex items-center  text-red-500">
              <FaExclamationCircle className="text-xl" />
              <span className="text-sm">NO IMAGE </span>
            </h1>
          </div>
        )}
      </div>

      {/* Prev/Next Buttons */}

      {images && images.length > 1 && currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
        >
          Prev
        </button>
      )}

      {images && images?.length > 1 && currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
        >
          Next
        </button>
      )}

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images &&
          images.length > 1 &&
          images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-gray-800" : "bg-gray-300"
              }`}
            ></button>
          ))}
      </div>
    </div>
  );
};

ImageSlider = React.memo(ImageSlider);

export default ImageSlider;
