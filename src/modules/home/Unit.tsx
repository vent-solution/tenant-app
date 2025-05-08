import React, { useState } from "react";
import { FACILITY_IMAGES_URL } from "../../global/filesUrls";
import ImageSlider from "../../global/ImageSlide";
import {
  ACCOMMODATION_CATEGORY,
  ACCOMMODATION_TYPE_DATA,
  BUSINESS_TYPE_DATA,
  FACILITY_STATUS,
  PAYMENT_PARTERN,
} from "../../global/PreDefinedData/PreDefinedData";
import { FormatMoney } from "../../global/actions/formatMoney";
import { businessTypeEnum } from "../../global/enums/businessTypeEnum";
import { AccommodationModel } from "../accommodations/AccommodationModel";

interface Props {
  unit: AccommodationModel;
  setSelectedAccommodationId: React.Dispatch<
    React.SetStateAction<Number | null>
  >;
  setIsShowUnitDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

let Unit: React.FC<Props> = ({
  unit,
  setSelectedAccommodationId,
  setIsShowUnitDetails,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <div
      className="w-full px-2 p-10 flex flex-wrap items-center border-b-2 lg:border-b lg:hover:bg-gray-100 transition duration-1000 ease-in-out cursor-pointer hover:shadow-lg"
      onClick={() => {
        setSelectedAccommodationId(Number(unit.accommodationId));
        setIsShowUnitDetails(true);
      }}
    >
      <div className="w-full lg:w-1/4">
        {
          <ImageSlider
            imageUrl={`${FACILITY_IMAGES_URL}/${unit.facility.facilityId}`}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            images={unit.facility.facilityImages?.map((img, index) => ({
              imageId: index + 1,
              imageName: img.imageName,
            }))}
          />
        }
      </div>
      <div className="w-full lg:w-3/4 lg:px-5">
        <h1 className="text-gray-600 text-lg">
          For{" "}
          {
            BUSINESS_TYPE_DATA.find(
              (type) => type.value === unit.facility.businessType
            )?.label
          }{" "}
          |{" "}
          <span className="text-sm">
            {
              FACILITY_STATUS.find(
                (status) => status.value === unit.facility.facilityStatus
              )?.label
            }
          </span>
        </h1>

        <h1 className="w-full text-2xl font-bold">
          {
            ACCOMMODATION_TYPE_DATA.find(
              (type) => type.value === unit.accommodationType
            )?.label
          }{" "}
          {<span>in </span>}
          {unit.facility.facilityLocation.city}{" "}
          {unit.facility.facilityLocation.country}
        </h1>

        <h6 className="text-sm text-gray-500">
          {unit.accommodationType.includes("Space") &&
            Number(unit.capacity) > 1 && (
              <span className="px-4">
                <b className="font-bold text-3xl text-black">.</b>
                {unit.capacity} Seats
              </span>
            )}

          {unit.accommodationCategory && (
            <span className="px-4">
              <b className="font-bold text-3xl text-black">.</b>
              {
                ACCOMMODATION_CATEGORY.find(
                  (category) => category.value === unit.accommodationCategory
                )?.label
              }
            </span>
          )}

          {unit.fullyFurnished && (
            <span className="px-3">
              <b className="font-bold text-3xl text-black">.</b>
              Fully furnished
            </span>
          )}

          {unit.numberOfwashRooms && (
            <span className="px-3">
              <b className="font-bold text-3xl text-black">.</b>
              {unit.numberOfwashRooms} Washroom(s)
            </span>
          )}

          {unit.bedrooms && (
            <span className="px-3">
              <b className="font-bold text-3xl text-black">.</b>
              {unit.bedrooms} Bedroom(s)
            </span>
          )}

          {unit.roomLocation && (
            <span className="px-3">
              <b className="font-bold text-3xl text-black">.</b>
              Located {unit.roomLocation}
            </span>
          )}
        </h6>

        <h1 className="w-full text-lg font-bold text-green-600">
          <span className="font-mono">
            {FormatMoney(Number(unit.price), 2, unit.facility.preferedCurrency)}
          </span>
          <span className="text-gray-600 font-light text-sm tracking-wide ">
            {" "}
            {unit.facility.businessType !== businessTypeEnum.saleCondominium &&
              " | " +
                PAYMENT_PARTERN.find(
                  (partern) => partern.value === unit.paymentPartten
                )?.label}
          </span>
        </h1>

        <p className="w-full text-sm py-2 text-justify truncate">
          {unit.description}
        </p>
      </div>
    </div>
  );
};

Unit = React.memo(Unit);

export default Unit;
