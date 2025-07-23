import React, { useCallback, useState } from "react";
import EmptyList from "../../global/EmptyList";
import Unit from "./Condominium";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCondominiumsByFacility,
  getMoreUnits,
} from "./moreFacilityCondominiumsSlice";
import Preloader from "../../other/Preloader";
import MoreUnitDetails from "./MoreCondominiumDetails";
import PaginationButtons from "../../global/PaginationButtons";
import { AppDispatch } from "../../app/store";
import { useParams } from "react-router";

interface Props {}

let MoreUnitsList: React.FC<Props> = () => {
  const { facilityId } = useParams();

  const [isShowUnitDetails, setIsShowUnitDetails] = useState<boolean>(false);

  const [selectedAccommodation, setSelectedAccommodation] =
    useState<Number | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const facilityUnits = useSelector(getMoreUnits);

  const {
    facilityCondominiums,
    status,
    page,
    totalPages,
    size,
    totalElements,
  } = facilityUnits;

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    dispatch(
      fetchCondominiumsByFacility({
        page: page + 1,
        size: size,
        facilityId: Number(facilityId),
      })
    );
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    dispatch(
      fetchCondominiumsByFacility({
        page: page - 1,
        size: size,
        facilityId: Number(facilityId),
      })
    );
  }, [dispatch, page, size]);

  if (status === "loading") return <Preloader />;

  if (isShowUnitDetails)
    return (
      <MoreUnitDetails
        accommodationId={selectedAccommodation}
        setIsShowUnitDetails={setIsShowUnitDetails}
        setSelectedAccommodationId={setSelectedAccommodation}
        isShowUnitDetails={isShowUnitDetails}
      />
    );

  return (
    <div className="w-full relative">
      <div className="py-3 px-10 text-lg lg:text-xl font-bold">
        {facilityCondominiums && facilityCondominiums.length > 0 && (
          <div className="flex flex-wrap">
            <h1>
              {facilityCondominiums[0].facility.facilityName},{" "}
              {facilityCondominiums[0].facility.facilityLocation.city}{" "}
              {facilityCondominiums[0].facility.facilityLocation.country}
            </h1>

            <h1 className="px-10">{totalElements}</h1>
          </div>
        )}
      </div>
      <div className="bg-white w-full pt-3 lg:pt-0 h-[calc(100vh-150px)] overflow-auto">
        <div className="w-full lg:w-full flex flex-wrap justify-center items-center h-full">
          {facilityCondominiums.length > 0 ? (
            <div className="w-full lg:w-full p-2 bg-white m-auto flex flex-wrap">
              <div className="pb-10 px-2 lg:px-10 w-full overflow-auto flex flex-wrap">
                {facilityCondominiums.map((unit, index) => (
                  <Unit
                    key={index}
                    unit={unit}
                    setSelectedAccommodationId={setSelectedAccommodation}
                    setIsShowUnitDetails={setIsShowUnitDetails}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyList itemName="unit" />
          )}
        </div>
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

MoreUnitsList = React.memo(MoreUnitsList);

export default MoreUnitsList;
