import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { fetchData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import PaginationButtons from "../../global/PaginationButtons";
import { ACCOMMODATION_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";
import { setAlert } from "../../other/alertSlice";
import Unit from "./Unit";
import { getAvailableUnits, resetAvailableUnits } from "./unitsSlice";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import UnitDetails from "./UnitDetails";
import countriesList from "../../other/countriesList.json";
import Select from "react-select";

interface Props {}

const Units: React.FC<Props> = () => {
  const [unitsFilter, setUnitsFilter] = useState<{
    accommodationType: string;
    country: string;
    city: string;
  }>({ accommodationType: "", country: "", city: "" });

  const [filteredUnits, setFilteredUnits] = useState<AccommodationModel[]>([]);

  const [isShowUnitDetails, setIsShowUnitDetails] = useState<boolean>(false);

  const [selectedAccommodationId, setSelectedAccommodationId] =
    useState<Number | null>(null);

  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const availableUnitsState = useSelector(getAvailableUnits);
  const { availableUnits, page, totalPages, size } = availableUnitsState;

  // Handle the change of selected country
  const handleCountryChange = (
    selectedOption: { label: string; value: string } | null
  ) => {
    setUnitsFilter((prev) => ({
      ...prev,
      country: String(selectedOption?.value),
    }));
    setSelectedCountry(selectedOption);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-available-units/${page + 1}/${size}`
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
      dispatch(resetAvailableUnits(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH AVAILABLE UNITS CANCELLED ", error.message);
      }
      console.error("Error fetching available units: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-available-units/${page - 1}/${size}`
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
      dispatch(resetAvailableUnits(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH AVAILABLE UNITS CANCELLED ", error.message);
      }
      console.error("Error fetching available units: ", error);
    }
  }, [dispatch, page, size]);

  //filter accommodations depending on type, country and city
  useEffect(() => {
    if (
      !unitsFilter.accommodationType &&
      !unitsFilter.country &&
      !unitsFilter.city
    ) {
      setFilteredUnits(availableUnits);
      return;
    }

    if (
      unitsFilter.accommodationType.trim().length > 0 &&
      unitsFilter.country.trim().length <= 0 &&
      unitsFilter.city.trim().length <= 0
    ) {
      setFilteredUnits(
        availableUnits.filter(
          (unit) =>
            unit.accommodationType.toLowerCase() ===
            unitsFilter.accommodationType.toLocaleLowerCase()
        )
      );
    }

    if (
      unitsFilter.country.trim().length > 0 &&
      unitsFilter.city.trim().length <= 0
    ) {
      setFilteredUnits(
        availableUnits.filter(
          (unit) =>
            unit.accommodationType.toLowerCase() ===
              unitsFilter.accommodationType.toLocaleLowerCase() &&
            unit.facility.facilityLocation.country
              .toLowerCase()
              .includes(unitsFilter.country.toLocaleLowerCase())
        )
      );
    }

    if (unitsFilter.city.trim().length > 0) {
      setFilteredUnits(
        availableUnits.filter(
          (unit) =>
            unit.accommodationType.toLowerCase() ===
              unitsFilter.accommodationType.toLocaleLowerCase() &&
            unit.facility.facilityLocation.country
              .toLowerCase()
              .includes(unitsFilter.country.toLocaleLowerCase()) &&
            unit.facility.facilityLocation.city
              .toLowerCase()
              .includes(unitsFilter.city.toLocaleLowerCase())
        )
      );
    }
  }, [
    availableUnits,
    unitsFilter.accommodationType,
    unitsFilter.city,
    unitsFilter.country,
  ]);

  if (isShowUnitDetails)
    return (
      <UnitDetails
        accommodationId={selectedAccommodationId}
        setIsShowUnitDetails={setIsShowUnitDetails}
      />
    );

  return (
    <div className="w-full relative">
      <div className="bg-white w-full pt-3 lg:pt-0">
        <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-1 bg-white shadow-lg mb-3">
          <div className="w-full lg:w-full flex flex-wrap justify-between items-center">
            <div
              className={` rounded-full  bg-white flex flex-wrap justify-around items-center  w-full lg:w-full h-3/4 mt-0 lg:mt-0 `}
            >
              <div className="w-full lg:w-1/4 text-lg capitalize px-5">
                <select
                  name=""
                  id="facilityCategory"
                  className={`rounded-lg border w-full p-2 outline-none transition-all ease-in-out delay-150`}
                  onChange={(e) =>
                    setUnitsFilter((prev) => ({
                      ...prev,
                      accommodationType: String(e.target.value),
                    }))
                  }
                >
                  <option value={""}>CATEGORY</option>
                  {ACCOMMODATION_TYPE_DATA.map((type, index) => (
                    <option key={index} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full lg:w-1/4 text-lg capitalize px-5 py-2">
                <Select
                  isDisabled={!unitsFilter.accommodationType}
                  value={selectedCountry} // Currently selected country
                  onChange={(e) => {
                    handleCountryChange(e);
                    setUnitsFilter((prev) => ({
                      ...prev,
                      country: String(e?.label),
                    }));
                  }} // Change handler
                  options={countriesList} // Array of country options
                  placeholder="country"
                  isSearchable={true}
                />
              </div>

              <div className="w-full lg:w-1/4 text-lg capitalize px-5 py-2">
                <input
                  type="text"
                  name=""
                  disabled={!unitsFilter.country}
                  id="search-subscription"
                  placeholder="City/municipality/district"
                  className={`rounded-lg w-full p-2 outline-none border transition-all ease-in-out delay-150`}
                  onChange={(e) =>
                    setUnitsFilter((prev) => ({
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

      <div className="lg:px-0 mb-12 overflow-auto pb-5 h-[calc(100svh-150px)] relative">
        {filteredUnits.length > 0 ? (
          <div className="w-full lg:w-full p-2 bg-white m-auto flex flex-wrap">
            <div className="p-10 w-full overflow-auto flex flex-wrap">
              {filteredUnits.map((unit, index) => (
                <Unit
                  key={index}
                  unit={unit}
                  setSelectedAccommodationId={setSelectedAccommodationId}
                  setIsShowUnitDetails={setIsShowUnitDetails}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-ull h-[calc(100vh-70px)] flex justify-center items-center">
            <div
              className="w-30 h-30"
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

export default Units;
