import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAvailableCondominiumById } from "./condominiumsSlice";
import { RxCross1 } from "react-icons/rx";
import ImageSlider from "../../global/ImageSlide";
import {
  ACCOMMODATION_CATEGORY,
  ACCOMMODATION_TYPE_DATA,
  BUSINESS_TYPE_DATA,
  FACILITY_RATING,
  PAYMENT_PARTERN,
} from "../../global/PreDefinedData/PreDefinedData";
import { FormatMoney, FormatMoneyExt } from "../../global/actions/formatMoney";
import { businessTypeEnum } from "../../global/enums/businessTypeEnum";
import { AmenityEnum } from "../../global/enums/amenityEnum";
import { genderRestrictionEnum } from "../../global/enums/genderRestrictionEnum";
import Amenity from "../facilities/Amenity";
import { getCurrencyExchange } from "../../other/apis/CurrencyExchangeSlice";
import BookingForm from "../bookings/BookingForm";
import Maps from "../../global/Maps";
import { FaMap } from "react-icons/fa6";
import countriesList from "../../global/data/countriesList.json";
import { useNavigate } from "react-router-dom";

interface Props {
  accommodationId: Number | null;
  setIsShowUnitDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAccommodationId: React.Dispatch<
    React.SetStateAction<Number | null>
  >;
  isShowUnitDetails: true;
}

let UnitDetails: React.FC<Props> = ({
  accommodationId,
  setIsShowUnitDetails,
}) => {
  const unit = useSelector(
    getAvailableCondominiumById(Number(accommodationId))
  );

  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const [convertedPrice, setConvertedPrice] = useState<number>(0);
  const [desiredCurrency, setDesiredCurrency] = useState<string>("");
  const [isShowBookingForm, setIsShowBookingForm] = useState<boolean>(false);

  const [openMap, setOpenMap] = useState(false);
  const [coords] = useState<{ lat: number; lng: number }>({
    lat: unit?.facility.facilityLocation.latitude
      ? Number(unit?.facility.facilityLocation.latitude)
      : 0,
    lng: unit?.facility.facilityLocation.longitude
      ? Number(unit?.facility.facilityLocation.longitude)
      : 0,
  });

  const [distance] = useState(
    unit?.facility.facilityLocation.distance
      ? Number(unit?.facility.facilityLocation.distance)
      : 0
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const navigate = useNavigate();

  const currencyExchange = useSelector(getCurrencyExchange);

  // toggle open and close map
  const toggleOpenAndCloseMap = () => {
    setOpenMap(!openMap);
  };

  // set the currency names into an array
  useEffect(() => {
    const currencyNames = Object.keys(currencyExchange);
    setCurrencyNames(currencyNames);
  }, [currencyExchange]);

  // set the converted money
  useEffect(() => {
    setConvertedPrice(
      (Number(currencyExchange[desiredCurrency]) /
        Number(currencyExchange[String(unit?.facility.preferedCurrency)])) *
        Number(unit?.facility.price)
    );
  }, [
    currencyExchange,
    desiredCurrency,
    unit?.facility.preferedCurrency,
    unit?.facility.price,
  ]);

  if (isShowBookingForm)
    return (
      <BookingForm
        accommodation={unit}
        setIsShowBookingForm={setIsShowBookingForm}
      />
    );

  return (
    <div className="w-full overflow-auto bg-white">
      <div className="w-full py-5 px-2 lg:px-10 flex justify-between items-center bg-white shadow-lg sticky top-0 z-20">
        <h1 className="text-lg lg:text-xl font-bold">
          {unit?.facility.facilityName} {unit?.facility.facilityLocation.city}{" "}
          {
            countriesList.find(
              (country) =>
                country.value === unit?.facility.facilityLocation.country
            )?.label
          }
        </h1>
        <h1
          className="text-lg p-2 lg:hover:bg-red-500 lg:hover:text-white font-bold cursor-pointer"
          onClick={() => setIsShowUnitDetails(false)}
        >
          <RxCross1 />
        </h1>
      </div>

      <div className="w-full  py-5">
        <div className="w-full h-1/2 lg:h-3/4 flex justify-around flex-wrap items-center">
          <div className="w-full lg:w-2/3 h-full">
            <ImageSlider
              imageUrl={`${process.env.REACT_APP_FACILITY_IMAGES_URL}/${unit?.facility.facilityId}`}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              images={unit?.facility.facilityImages}
            />
          </div>

          <div className="w-full lg:w-1/3 p-5">
            <div className="py-5">
              <h1 className="text-gray-600 text-lg font-bold">
                <span>{unit?.accommodationNumber} </span>
                {
                  ACCOMMODATION_TYPE_DATA.find(
                    (type) => type.value === unit?.accommodationType
                  )?.label
                }{" "}
                For{" "}
                {
                  BUSINESS_TYPE_DATA.find(
                    (type) => type.value === unit?.facility.businessType
                  )?.label
                }{" "}
              </h1>
              {/* <h1 className="text-2xl font-bold w-full">
                {unit?.facility.facilityName}
              </h1> */}
              {/* <h1 className="w-full   font-extralight">
                <span>{unit?.accommodationNumber} </span>
                {
                  ACCOMMODATION_TYPE_DATA.find(
                    (type) => type.value === unit?.accommodationType
                  )?.label
                }{" "}
                {<span>in </span>}
                {unit?.facility.facilityLocation.city}{" "}
                {
                  countriesList.find(
                    (country) =>
                      country.value === unit?.facility.facilityLocation.country
                  )?.label
                }
              </h1> */}
              <h3 className=" text-gray-500 flex flex-wrap">
                {unit?.accommodationCategory && (
                  <span className="pr-4">
                    <b className="font-bold text-3xl text-black">.</b>
                    {
                      ACCOMMODATION_CATEGORY.find(
                        (category) =>
                          category.value === unit?.accommodationCategory
                      )?.label
                    }
                  </span>
                )}

                {unit?.fullyFurnished && (
                  <span className="px-3">
                    <b className="font-bold text-3xl text-black">.</b>
                    Fully furnished
                  </span>
                )}

                {unit?.numberOfwashRooms && (
                  <span className="px-3">
                    <b className="font-bold text-3xl text-black">.</b>
                    {unit?.numberOfwashRooms} Washroom(s)
                  </span>
                )}

                {unit?.bedrooms && (
                  <span className="px-3">
                    <b className="font-bold text-3xl text-black">.</b>
                    {unit?.bedrooms} Bedroom(s)
                  </span>
                )}

                {unit?.roomLocation && (
                  <span className="px-3">
                    <b className="font-bold text-3xl text-black">.</b>
                    Located {unit?.roomLocation}
                  </span>
                )}
              </h3>

              <h1 className="w-full text-lg font-bold text-green-600">
                <span className="font-mono">
                  {FormatMoney(
                    Number(unit?.price),
                    2,
                    String(unit?.facility.preferedCurrency)
                  )}
                </span>
                <span className="text-gray-600 font-light  tracking-wide ">
                  {" "}
                  {unit?.facility.businessType !==
                    businessTypeEnum.saleCondominium &&
                    " | " +
                      PAYMENT_PARTERN.find(
                        (partern) => partern.value === unit?.paymentPartten
                      )?.label}
                </span>
              </h1>

              <h1 className="w-full  font-bold text-gray-600 py-5">
                <span className="">
                  Minimum booking amount ({unit?.facility.bookingPercentage}%):{" "}
                </span>
                <span className="text-gray-800 tracking-wide font-mono">
                  {FormatMoney(
                    (Number(unit?.price) *
                      Number(unit?.facility.bookingPercentage)) /
                      100,
                    2,
                    String(unit?.facility.preferedCurrency)
                  )}
                </span>
              </h1>

              <p className="w-full  py-2 text-left">{unit?.description}</p>

              <div className="p-5 w-full flex justify-between items-center">
                <button
                  className="text-xl font-bold text-blue-700 bg-gray-100 border py-2 px-5 lg:hover:bg-gray-200 active:scale-95"
                  onClick={() => setIsShowBookingForm(true)}
                >
                  Book
                </button>

                <button
                  className="text-sm font-bold text-blue-700 bg-gray-100 border py-2 px-5 lg:hover:bg-gray-200 active:scale-95"
                  onClick={() =>
                    navigate(`/facility/${unit?.facility.facilityId}`)
                  }
                >
                  All units
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-1 lg:p-y lg:pt-0 max-w-4xl mx-auto px-5 lg:px-0">
          {/* facility rating  */}
          {unit?.facility.facilityRating && (
            <h3 className="pb-1 text-xl uppercase italic">
              <span>
                {
                  FACILITY_RATING.find(
                    (rating) => rating.value === unit?.facility.facilityRating
                  )?.label
                }
                {" Hotel"}
              </span>
            </h3>
          )}

          {/* facility name  */}
          <h1 className="w-full pt-5 text-2xl lg:text-3xl font-extrabold lg:font-semi-bold">
            <span>{unit?.facility.facilityName}</span>
          </h1>
          <h3 className="pb-5 text-lg lg:text-xl uppercase italic">
            <span>
              {
                BUSINESS_TYPE_DATA.find(
                  (type) => type.value === unit?.facility.businessType
                )?.label
              }{" "}
            </span>
            {unit?.facility.businessType === businessTypeEnum.rent && (
              <span>
                {unit?.facility.genderRestriction === genderRestrictionEnum.both
                  ? " (All gender)"
                  : " (" + unit?.facility.genderRestriction + ")"}
              </span>
            )}

            {Number(unit?.facility.price) > 0 && (
              <span className="font-bold text-green-500">
                {" "}
                {FormatMoney(
                  Number(unit?.facility.price),
                  2,
                  String(unit?.facility.preferedCurrency)
                )}
              </span>
            )}
          </h3>

          {/* facility description */}
          {unit?.facility.description &&
            unit?.facility.description !== "null" && (
              <div className="w-full py-5">
                <p className="">{unit?.facility.description}</p>
              </div>
            )}

          {openMap && (
            <Maps
              toggleOpenAndCloseMap={toggleOpenAndCloseMap}
              coords={coords}
              distance={distance}
            />
          )}

          {/* facility action button  */}
          <div className="w-full text-lg flex">
            <button
              type="submit"
              className="py-1 px-5 border-2 border-blue-500 text-blue-500 lg:hover:bg-blue-400 lg:hover:text-white mx-3  rounded-lg flex justify-around items-center"
              onClick={toggleOpenAndCloseMap}
            >
              <span className="mr-5">
                <FaMap />
              </span>
              <span>Show on map</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-between items-start">
            <div className="w-full lg:w-1/2 px-5">
              {/*facility location*/}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Location
                </h2>

                {unit?.facility.facilityLocation.country && (
                  <p className=" text-black">
                    <b>Country: </b>
                    <i>
                      {
                        countriesList.find(
                          (country) =>
                            country.value ===
                            unit?.facility.facilityLocation.country
                        )?.label
                      }
                    </i>
                  </p>
                )}
                {unit?.facility.facilityLocation.city && (
                  <p className=" text-black">
                    <b>City: </b>
                    <i>{unit?.facility.facilityLocation.city}</i>
                  </p>
                )}

                {unit?.facility.facilityLocation.primaryAddress && (
                  <p className=" text-black">
                    <b>Primary address: </b>
                    <i>{unit?.facility.facilityLocation.primaryAddress}</i>
                  </p>
                )}
              </div>

              {/* contact */}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Contact
                </h2>
                {unit?.facility.contact.telephone1 && (
                  <p className=" text-black">
                    <b>Telephone: </b>
                    <i>{unit?.facility.contact.telephone1}</i>
                  </p>
                )}
                {unit?.facility.contact.email && (
                  <p className=" text-black">
                    <b>Email: </b>
                    <i>{unit?.facility.contact.email}</i>
                  </p>
                )}
              </div>

              {/* finance */}
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500 py-1">
                  Finance
                </h2>
                {unit?.facility.preferedCurrency && (
                  <p className=" text-black">
                    <b>Prefered currency: </b>
                    <i>{unit?.facility.preferedCurrency}</i>
                  </p>
                )}

                {Number(unit?.facility.price) > 0 && (
                  <div className=" text-black">
                    <b>Price: </b>
                    <select
                      name="currency"
                      id="currency"
                      className="uppercase py-0 bg-gray-300 rounded-md"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setDesiredCurrency(e.target.value)
                      }
                    >
                      <option value={unit?.facility.preferedCurrency}>
                        {unit?.facility.preferedCurrency}
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
                          ? Number(unit?.facility.price)
                          : Number(convertedPrice),
                        2,
                        !desiredCurrency
                          ? String(unit?.facility.preferedCurrency)
                          : desiredCurrency
                      )}
                    </i>
                  </div>
                )}
              </div>

              {/* manager */}
              <div className="location py-4 w-full">
                {unit?.facility.manager && (
                  <h2 className="text-xl font-bold text-gray-500 py-1">
                    Manager
                  </h2>
                )}
                {unit?.facility.manager?.firstName && (
                  <p className=" text-black">
                    <b>Name: </b>
                    <i>
                      {unit?.facility.manager?.firstName +
                        " " +
                        unit?.facility.manager?.lastName}
                    </i>
                  </p>
                )}

                {unit?.facility.manager?.userTelephone && (
                  <p className=" text-black">
                    <b>Telephone: </b>
                    <i>{unit?.facility.manager?.userTelephone}</i>
                  </p>
                )}

                {unit?.facility.manager?.userEmail && (
                  <p className=" text-black">
                    <b>Email: </b>
                    <i>{unit?.facility.manager?.userEmail}</i>
                  </p>
                )}
              </div>
            </div>

            {/* facility amenities */}
            <div className="w-full lg:w-1/2">
              <div className="location py-4 w-full">
                <h2 className="text-xl font-bold text-gray-500">
                  Facility amenities
                </h2>
                <p className="flex justify-between text-center  bg-black px-5 border-b-2 border-gray-300 text-blue-200 sticky top-0">
                  <b className="w-fit"></b>
                  <span className="w-1/2 flex justify-between text-center  text-cyan-100 py-5">
                    {/* <span className="text-center w-1/3">Available</span> */}
                    <span className="text-center w-1/3">Free</span>
                    <span className="text-center w-1/3">Paid</span>
                  </span>
                </p>
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="Parking"
                    availability={
                      !unit?.facility.facilityAmenities.parking
                        ? false
                        : unit?.facility.facilityAmenities.parking ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.parking}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="Water"
                    availability={
                      !unit?.facility.facilityAmenities.water
                        ? false
                        : unit?.facility.facilityAmenities.water ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.water}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="Electricity"
                    availability={
                      !unit?.facility.facilityAmenities.electricity
                        ? false
                        : unit?.facility.facilityAmenities.electricity ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.electricity}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="wifi"
                    availability={
                      !unit?.facility.facilityAmenities.wifi
                        ? false
                        : unit?.facility.facilityAmenities.wifi ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.wifi}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="cabel Internet"
                    availability={
                      !unit?.facility.facilityAmenities.cabelInternet
                        ? false
                        : unit?.facility.facilityAmenities.cabelInternet ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.cabelInternet}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="elevator"
                    availability={
                      !unit?.facility.facilityAmenities.elevator ? false : true
                    }
                    amenity={unit?.facility.facilityAmenities.elevator}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="surveillance Cameras"
                    availability={
                      !unit?.facility.facilityAmenities.surveillanceCameras
                        ? false
                        : true
                    }
                    amenity={
                      unit?.facility.facilityAmenities.surveillanceCameras
                    }
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="Security guard"
                    availability={
                      !unit?.facility.facilityAmenities.securityGuard
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.securityGuard}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="Fenced"
                    availability={
                      !unit?.facility.facilityAmenities.fenced ? false : true
                    }
                    amenity={unit?.facility.facilityAmenities.fenced}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="Wash Room"
                    availability={
                      !unit?.facility.facilityAmenities.washRoom
                        ? false
                        : unit?.facility.facilityAmenities.washRoom ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.washRoom}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="Airport Transport"
                    availability={
                      !unit?.facility.facilityAmenities.airportTransport
                        ? false
                        : unit?.facility.facilityAmenities.airportTransport ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.airportTransport}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="gym"
                    availability={
                      !unit?.facility.facilityAmenities.gym
                        ? false
                        : unit?.facility.facilityAmenities.gym ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.gym}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="breakfast"
                    availability={
                      !unit?.facility.facilityAmenities.breakFast
                        ? false
                        : unit?.facility.facilityAmenities.breakFast ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.breakFast}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="swimmingpool"
                    availability={
                      !unit?.facility.facilityAmenities.swimmingPool
                        ? false
                        : unit?.facility.facilityAmenities.swimmingPool ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.swimmingPool}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="hostel Shuttle"
                    availability={
                      !unit?.facility.facilityAmenities.hostelShuttle
                        ? false
                        : unit?.facility.facilityAmenities.hostelShuttle ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.hostelShuttle}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="conference Space"
                    availability={
                      !unit?.facility.facilityAmenities.conferenceSpace
                        ? false
                        : unit?.facility.facilityAmenities.conferenceSpace ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.conferenceSpace}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="canteen"
                    availability={
                      !unit?.facility.facilityAmenities.canteen
                        ? false
                        : unit?.facility.facilityAmenities.canteen ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.canteen}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="clinic"
                    availability={
                      !unit?.facility.facilityAmenities.clinic
                        ? false
                        : unit?.facility.facilityAmenities.clinic ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.clinic}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="study Room"
                    availability={
                      !unit?.facility.facilityAmenities.studyRoom
                        ? false
                        : unit?.facility.facilityAmenities.studyRoom ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.studyRoom}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="community Room"
                    availability={
                      !unit?.facility.facilityAmenities.communityRoom
                        ? false
                        : unit?.facility.facilityAmenities.communityRoom ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.communityRoom}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="meeting Space"
                    availability={
                      !unit?.facility.facilityAmenities.meetingSpace
                        ? false
                        : unit?.facility.facilityAmenities.meetingSpace ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.meetingSpace}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="events Space"
                    availability={
                      !unit?.facility.facilityAmenities.eventsSpace
                        ? false
                        : unit?.facility.facilityAmenities.eventsSpace ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.eventsSpace}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="restaurant"
                    availability={
                      !unit?.facility.facilityAmenities.restaurant
                        ? false
                        : unit?.facility.facilityAmenities.restaurant ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.restaurant}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="bar And Lounge"
                    availability={
                      !unit?.facility.facilityAmenities.barAndLounge
                        ? false
                        : unit?.facility.facilityAmenities.barAndLounge ===
                          AmenityEnum.no
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.barAndLounge}
                  />
                )}
                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="standby Generator"
                    availability={
                      !unit?.facility.facilityAmenities.standByGenerator
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.standByGenerator}
                  />
                )}

                {unit?.facility.facilityAmenities && (
                  <Amenity
                    name="Air conditioner"
                    availability={
                      !unit?.facility.facilityAmenities.airConditioner
                        ? false
                        : true
                    }
                    amenity={unit?.facility.facilityAmenities.airConditioner}
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

export default UnitDetails;
