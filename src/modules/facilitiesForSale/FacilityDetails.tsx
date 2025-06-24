import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import ImageSlider from "../../global/ImageSlide";
import {
  BUSINESS_TYPE_DATA,
  FACILITY_RATING,
} from "../../global/PreDefinedData/PreDefinedData";
import { FormatMoney, FormatMoneyExt } from "../../global/actions/formatMoney";
import { businessTypeEnum } from "../../global/enums/businessTypeEnum";
import { AmenityEnum } from "../../global/enums/amenityEnum";
import { genderRestrictionEnum } from "../../global/enums/genderRestrictionEnum";
import Amenity from "../facilities/Amenity";
import { getCurrencyExchange } from "../../other/apis/CurrencyExchangeSlice";
import { getFacilitiesForSaleById } from "./facilitiesForSaleSlice";

import countriesList from "../../global/data/countriesList.json";

interface Props {
  selectedFacilityId: Number | null;
  setIsShowFacilityDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

let FacilityDetails: React.FC<Props> = ({
  selectedFacilityId,
  setIsShowFacilityDetails,
}) => {
  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const [convertedPrice, setConvertedPrice] = useState<number>(0);
  const [desiredCurrency, setDesiredCurrency] = useState<string>("");

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const facility = useSelector(
    getFacilitiesForSaleById(Number(selectedFacilityId))
  );

  const currencyExchange = useSelector(getCurrencyExchange);

  // set the currency names into an array
  useEffect(() => {
    const currencyNames = Object.keys(currencyExchange);
    setCurrencyNames(currencyNames);
  }, [currencyExchange]);

  // set the converted money
  useEffect(() => {
    setConvertedPrice(
      (Number(currencyExchange[desiredCurrency]) /
        Number(currencyExchange[String(facility?.preferedCurrency)])) *
        Number(facility?.price)
    );
  }, [
    currencyExchange,
    desiredCurrency,
    facility?.preferedCurrency,
    facility?.price,
  ]);

  return (
    <div className="w-full overflow-auto bg-white">
      <div className="w-full p-5 flex justify-end items-center bg-white shadow-lg sticky top-0 z-20">
        <h1
          className="text-lg p-2 lg:hover:bg-red-500 lg:hover:text-white font-bold cursor-pointer"
          onClick={() => setIsShowFacilityDetails(false)}
        >
          <RxCross1 />
        </h1>
      </div>

      <div className="w-full lg:w-5/6  m-auto p-5">
        <div className="w-full h-1/2 flex flex-wrap items-center">
          <div className="w-full h-full">
            <ImageSlider
              imageUrl={`${process.env.REACT_APP_FACILITY_IMAGES_URL}/${facility?.facilityId}`}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              images={facility?.facilityImages}
            />
          </div>
          {/* <div className="w-full lg:w-1/3 p-5">
            <div className="py-5">
              <h1 className="text-gray-600 text-lg">
                For{" "}
                {
                  BUSINESS_TYPE_DATA.find(
                    (type) => type.value === facility?.businessType
                  )?.label
                }{" "}
                |{" "}
                <span className="text-sm">
                  {
                    FACILITY_STATUS.find(
                      (status) => status.value === facility?.facilityStatus
                    )?.label
                  }
                </span>
              </h1>
              <h1 className="text-2xl font-bold w-full">
                {facility?.facilityName}
              </h1>
              <h1 className="w-full text-sm  font-extralight">
                {
                  FACILITY_CATEGORY_DATA.find(
                    (type) => type.value === facility?.facilityCategory
                  )?.label
                }{" "}
                {<span>in </span>}
                {facility?.facilityLocation.city}{" "}
                {facility?.facilityLocation.country}
              </h1>

              <h1 className="w-full text-lg font-bold text-green-600">
                <span className="font-mono">
                  {FormatMoney(
                    Number(facility?.price),
                    2,
                    String(facility?.preferedCurrency)
                  )}
                </span>
              </h1>

              <p className="w-full text-sm py-2 text-justify truncate">
                {facility?.description}
              </p>
            </div>
          </div> */}
        </div>
        <div className="p-1 lg:p-y lg:pt-0 max-w-4xl mx-auto">
          {/* facility rating  */}
          {facility?.facilityRating && (
            <h3 className="pb-1 text-xl uppercase italic">
              <span>
                {
                  FACILITY_RATING.find(
                    (rating) => rating.value === facility?.facilityRating
                  )?.label
                }
                {" Hotel"}
              </span>
            </h3>
          )}

          {/* facility name  */}
          <h1 className="w-full pt-5 text-5xl font-semi-bold">
            <span>{facility?.facilityName}</span>
          </h1>
          <h3 className="pb-3 text-xl uppercase italic">
            <span>
              {
                BUSINESS_TYPE_DATA.find(
                  (type) => type.value === facility?.businessType
                )?.label
              }{" "}
            </span>
            {facility?.businessType === businessTypeEnum.rent && (
              <span>
                {facility?.genderRestriction === genderRestrictionEnum.both
                  ? " (All gender)"
                  : " (" + facility?.genderRestriction + ")"}
              </span>
            )}

            {Number(facility?.price) > 0 && (
              <span className="font-bold text-green-500">
                {" "}
                {FormatMoney(
                  Number(facility?.price),
                  2,
                  String(facility?.preferedCurrency)
                )}
              </span>
            )}
          </h3>

          {/* facility description */}
          <div className="w-full py-5">
            <p className="text-sm">{facility?.description}</p>
          </div>
          <div className="flex flex-wrap justify-between items-start">
            <div className="w-full lg:w-1/3">
              {/*facility location*/}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Location
                </h2>
                {facility?.facilityLocation.country && (
                  <p className="text-sm text-black">
                    <b>Country: </b>
                    <i>
                      {
                        countriesList.find(
                          (country) =>
                            country.value === facility?.facilityLocation.country
                        )?.label
                      }
                    </i>
                  </p>
                )}
                {facility?.facilityLocation.city && (
                  <p className="text-sm text-black">
                    <b>City: </b>
                    <i>{facility?.facilityLocation.city}</i>
                  </p>
                )}
              </div>

              {/* contact */}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Contact
                </h2>
                {facility?.contact.telephone1 && (
                  <p className="text-sm text-black">
                    <b>Telephone: </b>
                    <i>{facility?.contact.telephone1}</i>
                  </p>
                )}
                {facility?.contact.email && (
                  <p className="text-sm text-black">
                    <b>Email: </b>
                    <i>{facility?.contact.email}</i>
                  </p>
                )}
              </div>

              {/* finance */}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Finance
                </h2>
                {facility?.preferedCurrency && (
                  <p className="text-sm text-black">
                    <b>Prefered currency: </b>
                    <i>{facility?.preferedCurrency}</i>
                  </p>
                )}

                {facility?.price &&
                  facility?.businessType !== businessTypeEnum.rent && (
                    <div className="text-sm text-black">
                      <b>Price: </b>
                      <select
                        name="currency"
                        id="currency"
                        className="uppercase py-0 bg-gray-300 rounded-md"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setDesiredCurrency(e.target.value)
                        }
                      >
                        <option value={facility?.preferedCurrency}>
                          {facility?.preferedCurrency}
                        </option>

                        {currencyNames.map((ex, index) => (
                          <option key={index} value={ex}>
                            {ex}
                          </option>
                        ))}
                      </select>{" "}
                      <i className="font-mono text-lg">
                        {FormatMoneyExt(
                          !desiredCurrency
                            ? Number(facility?.price)
                            : Number(convertedPrice),
                          2,
                          !desiredCurrency
                            ? facility?.preferedCurrency
                            : desiredCurrency
                        )}
                      </i>
                    </div>
                  )}
              </div>

              {/* manager */}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Manager
                </h2>
                {facility?.manager?.firstName && (
                  <p className="text-sm text-black">
                    <b>Name: </b>
                    <i>
                      {facility?.manager?.firstName +
                        " " +
                        facility?.manager?.lastName}
                    </i>
                  </p>
                )}

                {facility?.manager?.userTelephone && (
                  <p className="text-sm text-black">
                    <b>Telephone: </b>
                    <i>{facility?.manager?.userTelephone}</i>
                  </p>
                )}

                {facility?.manager?.userEmail && (
                  <p className="text-sm text-black">
                    <b>Email: </b>
                    <i>{facility?.manager?.userEmail}</i>
                  </p>
                )}
              </div>
            </div>

            {/* facility amenities */}
            <div className="w-full lg:w-2/3">
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500">
                  Facility amenities
                </h2>
                <p className="flex justify-between text-center text-sm bg-black px-5 border-b-2 border-gray-300 text-blue-200 sticky top-0">
                  <b className="w-fit"></b>
                  <span className="w-1/2 flex justify-between text-center text-sm text-cyan-100 py-5">
                    <span className="text-center w-1/3">Availble</span>
                    <span className="text-center w-1/3">Free</span>
                    <span className="text-center w-1/3">Paid</span>
                  </span>
                </p>
                {facility?.facilityAmenities && (
                  <Amenity
                    name="Parking"
                    availability={
                      !facility?.facilityAmenities.parking
                        ? false
                        : facility?.facilityAmenities.parking === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.parking}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="Water"
                    availability={
                      !facility?.facilityAmenities.water
                        ? false
                        : facility?.facilityAmenities.water === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.water}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="Electricity"
                    availability={
                      !facility?.facilityAmenities.electricity
                        ? false
                        : facility?.facilityAmenities.electricity ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.electricity}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="wifi"
                    availability={
                      !facility?.facilityAmenities.wifi
                        ? false
                        : facility?.facilityAmenities.wifi === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.wifi}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="cabel Internet"
                    availability={
                      !facility?.facilityAmenities.cabelInternet
                        ? false
                        : facility?.facilityAmenities.cabelInternet ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.cabelInternet}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="elevator"
                    availability={
                      !facility?.facilityAmenities.elevator ? false : true
                    }
                    amenity={facility?.facilityAmenities.elevator}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="surveillance Cameras"
                    availability={
                      !facility?.facilityAmenities.surveillanceCameras
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.surveillanceCameras}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="Security guard"
                    availability={
                      !facility?.facilityAmenities.securityGuard ? false : true
                    }
                    amenity={facility?.facilityAmenities.securityGuard}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="Fenced"
                    availability={
                      !facility?.facilityAmenities.fenced ? false : true
                    }
                    amenity={facility?.facilityAmenities.fenced}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="Wash Room"
                    availability={
                      !facility?.facilityAmenities.washRoom
                        ? false
                        : facility?.facilityAmenities.washRoom ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.washRoom}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="Airport Transport"
                    availability={
                      !facility?.facilityAmenities.airportTransport
                        ? false
                        : facility?.facilityAmenities.airportTransport ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.airportTransport}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="gym"
                    availability={
                      !facility?.facilityAmenities.gym
                        ? false
                        : facility?.facilityAmenities.gym === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.gym}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="breakfast"
                    availability={
                      !facility?.facilityAmenities.breakFast
                        ? false
                        : facility?.facilityAmenities.breakFast ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.breakFast}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="swimmingpool"
                    availability={
                      !facility?.facilityAmenities.swimmingPool
                        ? false
                        : facility?.facilityAmenities.swimmingPool ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.swimmingPool}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="hostel Shuttle"
                    availability={
                      !facility?.facilityAmenities.hostelShuttle
                        ? false
                        : facility?.facilityAmenities.hostelShuttle ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.hostelShuttle}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="conference Space"
                    availability={
                      !facility?.facilityAmenities.conferenceSpace
                        ? false
                        : facility?.facilityAmenities.conferenceSpace ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.conferenceSpace}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="canteen"
                    availability={
                      !facility?.facilityAmenities.canteen
                        ? false
                        : facility?.facilityAmenities.canteen === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.canteen}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="clinic"
                    availability={
                      !facility?.facilityAmenities.clinic
                        ? false
                        : facility?.facilityAmenities.clinic === AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.clinic}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="study Room"
                    availability={
                      !facility?.facilityAmenities.studyRoom
                        ? false
                        : facility?.facilityAmenities.studyRoom ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.studyRoom}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="community Room"
                    availability={
                      !facility?.facilityAmenities.communityRoom
                        ? false
                        : facility?.facilityAmenities.communityRoom ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.communityRoom}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="meeting Space"
                    availability={
                      !facility?.facilityAmenities.meetingSpace
                        ? false
                        : facility?.facilityAmenities.meetingSpace ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.meetingSpace}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="events Space"
                    availability={
                      !facility?.facilityAmenities.eventsSpace
                        ? false
                        : facility?.facilityAmenities.eventsSpace ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.eventsSpace}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="restaurant"
                    availability={
                      !facility?.facilityAmenities.restaurant
                        ? false
                        : facility?.facilityAmenities.restaurant ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.restaurant}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="bar And Lounge"
                    availability={
                      !facility?.facilityAmenities.barAndLounge
                        ? false
                        : facility?.facilityAmenities.barAndLounge ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.barAndLounge}
                  />
                )}
                {facility?.facilityAmenities && (
                  <Amenity
                    name="standby Generator"
                    availability={
                      !facility?.facilityAmenities.standByGenerator
                        ? false
                        : true
                    }
                    amenity={facility?.facilityAmenities.standByGenerator}
                  />
                )}

                {facility?.facilityAmenities && (
                  <Amenity
                    name="Air conditioner"
                    availability={
                      !facility?.facilityAmenities.airConditioner ? false : true
                    }
                    amenity={facility?.facilityAmenities.airConditioner}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FacilityDetails = React.memo(FacilityDetails);

export default FacilityDetails;
