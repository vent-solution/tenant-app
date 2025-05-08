import React, { useState } from "react";
import { FACILITY_IMAGES_URL } from "../../global/filesUrls";
import ImageSlider from "../../global/ImageSlide";
import {
  BUSINESS_TYPE_DATA,
  FACILITY_CATEGORY_DATA,
  FACILITY_STATUS,
} from "../../global/PreDefinedData/PreDefinedData";
import { FormatMoney } from "../../global/actions/formatMoney";
import { FacilitiesModel } from "../facilities/FacilityModel";

interface Props {
  facility: FacilitiesModel;
  setSelectedFacilityId: React.Dispatch<React.SetStateAction<Number | null>>;
  setIsShowFacilityDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

let FacilityForSale: React.FC<Props> = ({
  facility,
  setSelectedFacilityId,
  setIsShowFacilityDetails,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <div
      className="w-full px-2 p-10 flex flex-wrap items-center border-b-2 lg:border-b lg:hover:bg-gray-100 transition duration-1000 ease-in-out cursor-pointer hover:shadow-lg"
      onClick={() => {
        setSelectedFacilityId(Number(facility.facilityId));
        setIsShowFacilityDetails(true);
      }}
    >
      <div className="w-full lg:w-1/4">
        {
          <ImageSlider
            imageUrl={`${FACILITY_IMAGES_URL}/${facility.facilityId}`}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            images={facility.facilityImages?.map((img, index) => ({
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
              (type) => type.value === facility.businessType
            )?.label
          }{" "}
          |{" "}
          <span className="text-sm">
            {
              FACILITY_STATUS.find(
                (status) => status.value === facility.facilityStatus
              )?.label
            }
          </span>
        </h1>

        <h1 className="w-full text-2xl font-bold">
          {
            FACILITY_CATEGORY_DATA.find(
              (type) => type.value === facility.facilityCategory
            )?.label
          }{" "}
          {<span>for sale in </span>}
          {facility.facilityLocation.city} {facility.facilityLocation.country}
        </h1>

        <h6 className="text-sm text-gray-500">
          {facility.facilityCategory && (
            <span className="px-4">
              <b className="font-bold text-3xl text-black">.</b>
              {
                FACILITY_CATEGORY_DATA.find(
                  (category) => category.value === facility.facilityCategory
                )?.label
              }
            </span>
          )}
        </h6>

        <h1 className="w-full text-lg font-bold text-green-600">
          <span className="font-mono">
            {FormatMoney(Number(facility.price), 2, facility.preferedCurrency)}
          </span>
        </h1>

        <p className="w-full text-sm py-2 text-justify truncate">
          {facility.description}
        </p>
      </div>
    </div>
  );
};

FacilityForSale = React.memo(FacilityForSale);

export default FacilityForSale;
