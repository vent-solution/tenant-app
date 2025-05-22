import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { fetchData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import PaginationButtons from "../../global/PaginationButtons";
import { FACILITY_CATEGORY_DATA } from "../../global/PreDefinedData/PreDefinedData";
import { setAlert } from "../../other/alertSlice";
import countriesList from "../../other/countriesList.json";
import Select from "react-select";
import { FacilitiesModel } from "../facilities/FacilityModel";
import {
  getFacilitiesForSale,
  resetFacilitiesForSale,
} from "./facilitiesForSaleSlice";
import FacilityDetails from "./FacilityDetails";
import FacilityForSale from "./FacilityForSale";

interface Props {}

const FacilitiesForSale: React.FC<Props> = () => {
  const [facilitiesFilter, setFacilitiesFilter] = useState<{
    facilityType: string;
    country: string;
    city: string;
  }>({ facilityType: "", country: "", city: "" });

  const [filteredFacilities, setFilteredFacilities] = useState<
    FacilitiesModel[]
  >([]);

  const [isShowFacilityDetails, setIsShowFacilityDetails] =
    useState<boolean>(false);

  const [selectedFacilityId, setSelectedFacilityId] = useState<Number | null>(
    null
  );

  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const facilitiesForSaleState = useSelector(getFacilitiesForSale);
  const { facilitiesForSale, page, totalPages, size } = facilitiesForSaleState;

  // Handle the change of selected country
  const handleCountryChange = (
    selectedOption: { label: string; value: string } | null
  ) => {
    setFacilitiesFilter((prev) => ({
      ...prev,
      country: String(selectedOption?.value),
    }));
    setSelectedCountry(selectedOption);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-facilities-for-sale/${page + 1}/${size}`
      );
      console.log(result.data);
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );

        return;
      }
      dispatch(resetFacilitiesForSale(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH FACILITIES FOR SALE CANCELLED ", error.message);
      }
      console.error("Error fetching facilities for sale: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-facilities-for-sale/${page - 1}/${size}`
      );

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );

        return;
      }
      dispatch(resetFacilitiesForSale(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH FACILITIES FOR SALE CANCELLED ", error.message);
      }
      console.error("Error fetching facilities for sale: ", error);
    }
  }, [dispatch, page, size]);

  //filter facilities for sale depending on type, country and city
  useEffect(() => {
    if (
      !facilitiesFilter.facilityType &&
      !facilitiesFilter.country &&
      !facilitiesFilter.city
    ) {
      setFilteredFacilities(facilitiesForSale);
    }

    if (
      facilitiesFilter.facilityType.trim().length > 0 &&
      facilitiesFilter.country.trim().length <= 0 &&
      facilitiesFilter.city.trim().length <= 0
    ) {
      setFilteredFacilities(
        facilitiesForSale.filter(
          (facility) =>
            facility.facilityCategory.trim().toLowerCase() ===
            facilitiesFilter.facilityType.trim().toLocaleLowerCase()
        )
      );
    }

    if (
      facilitiesFilter.country.trim().length > 0 &&
      facilitiesFilter.city.trim().length <= 0
    ) {
      setFilteredFacilities(
        facilitiesForSale.filter(
          (facility) =>
            facility.facilityCategory.toLowerCase() ===
              facilitiesFilter.facilityType.toLocaleLowerCase() &&
            facility.facilityLocation.country
              .toLowerCase()
              .includes(facilitiesFilter.country.toLocaleLowerCase())
        )
      );
    }

    if (facilitiesFilter.city.trim().length > 0) {
      setFilteredFacilities(
        facilitiesForSale.filter(
          (facility) =>
            facility.facilityCategory.toLowerCase() ===
              facilitiesFilter.facilityType.toLocaleLowerCase() &&
            facility.facilityLocation.country
              .toLowerCase()
              .includes(facilitiesFilter.country.toLocaleLowerCase()) &&
            facility.facilityLocation.city
              .toLowerCase()
              .includes(facilitiesFilter.city.toLocaleLowerCase())
        )
      );
    }
  }, [
    facilitiesForSale,
    facilitiesFilter.facilityType,
    facilitiesFilter.city,
    facilitiesFilter.country,
  ]);

  if (isShowFacilityDetails)
    return (
      <FacilityDetails
        selectedFacilityId={selectedFacilityId}
        setIsShowFacilityDetails={setIsShowFacilityDetails}
      />
    );

  return (
    <div className="list w-full relative">
      <div className="bg-white w-full pt-3 lg:pt-0">
        <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-1 bg-white shadow-lg mb-3">
          <div className="w-full lg:w-full flex flex-wrap justify-between items-center">
            <div
              className={` rounded-full  bg-white flex flex-wrap justify-around items-center  w-full lg:w-full h-3/4 mt-0 lg:mt-0 `}
            >
              <div className="w-full lg:w-1/4 text-lg capitalize px-5">
                <select
                  name=""
                  id="facilityType"
                  className={`rounded-lg border w-full p-2 outline-none transition-all ease-in-out delay-150`}
                  onChange={(e) =>
                    setFacilitiesFilter((prev) => ({
                      ...prev,
                      facilityType: String(e.target.value),
                    }))
                  }
                >
                  <option value={""}>CATEGORY</option>
                  {FACILITY_CATEGORY_DATA.map((type, index) => (
                    <option key={index} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full lg:w-1/4 text-lg capitalize px-5 py-2">
                <Select
                  isDisabled={!facilitiesFilter.facilityType}
                  value={selectedCountry} // Currently selected country
                  onChange={(e) => {
                    handleCountryChange(e);
                    setFacilitiesFilter((prev) => ({
                      ...prev,
                      country: String(e?.label),
                    }));
                  }} // Change handler
                  options={countriesList} // Array of country options
                  placeholder="Select a country"
                  isSearchable={true}
                />
              </div>

              <div className="w-full lg:w-1/4 text-lg capitalize px-5 py-2">
                <input
                  type="text"
                  name=""
                  disabled={!facilitiesFilter.country}
                  id="search-subscription"
                  placeholder="City/municipality/district"
                  className={`rounded-lg w-full p-2 outline-none border transition-all ease-in-out delay-150`}
                  onChange={(e) =>
                    setFacilitiesFilter((prev) => ({
                      ...prev,
                      city: String(e.target.value),
                    }))
                  }
                />
              </div>

              {/* <button className="bg-blue-800 hover:bg-blue-600 text-white p-2 rounded-full text-xl text-center border ">
                      {<FaSearch />}
                    </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:px-5 mb-12 overflow-auto pb-5 h-[calc(100svh-150px)] relative">
        {filteredFacilities.length > 0 ? (
          <div className="w-full lg:w-full p-2 bg-white m-auto flex flex-wrap">
            <div className="p-10 w-full overflow-auto flex flex-wrap">
              {filteredFacilities.map((facility, index) => (
                <FacilityForSale
                  key={index}
                  facility={facility}
                  setSelectedFacilityId={setSelectedFacilityId}
                  setIsShowFacilityDetails={setIsShowFacilityDetails}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-ull h-[calc(100vh-70px)] flex justify-center items-center">
            <div
              className="w-32 h-32"
              style={{
                background: "URL('/images/Ghost.gif')",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        )}
      </div>

      <PaginationButtons
        page={page}
        totalPages={totalPages}
        handleFetchNextPage={handleFetchNextPage}
        handleFetchPreviousPage={handleFetchPreviousPage}
      />
    </div>
  );
};

export default FacilitiesForSale;
