import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";
import { ACCOMMODATION_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";
import Unit from "./Unit";
import { fetchAvailableUnits, getAvailableUnits } from "./unitsSlice";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import UnitDetails from "./UnitDetails";
import countriesList from "../../global/data/countriesList.json";
import Select from "react-select";
import EmptyList from "../../global/EmptyList";
import Preloader from "../../other/Preloader";

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
  const { availableUnits, page, totalPages, size, status } =
    availableUnitsState;

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
    dispatch(fetchAvailableUnits({ page: page + 1, size: size }));
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    dispatch(fetchAvailableUnits({ page: page - 1, size: size }));
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

  if (status === "loading") return <Preloader />;

  if (isShowUnitDetails)
    return (
      <UnitDetails
        accommodationId={selectedAccommodationId}
        setIsShowUnitDetails={setIsShowUnitDetails}
        setSelectedAccommodationId={setSelectedAccommodationId}
        isShowUnitDetails={isShowUnitDetails}
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
            <div className="py-10 px-2 lg:px-10 w-full overflow-auto flex flex-wrap">
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
          <EmptyList itemName="unit" />
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
