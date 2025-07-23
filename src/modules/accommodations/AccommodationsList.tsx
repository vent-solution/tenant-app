import React, { useCallback, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AccommodationModel } from "./AccommodationModel";
import {
  fetchAccommodationsByTenant,
  getTenantAccommodations,
} from "./tenantAccommodationsSlice";
import Accommodation from "./Accommodation";
import AccommodationDetails from "./AccommodationDetails";
import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";
import { HistoryModel } from "../facilities/history/HistoryModel";
import { UserModel } from "../users/models/userModel";
import Preloader from "../../other/Preloader";
import EmptyList from "../../global/EmptyList";

interface Props {}

let Accommodations: React.FC<Props> = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [filteredTenantAccommodations, setFilteredTenantAccommodations] =
    useState<HistoryModel[]>([]);

  const [showAccommodationDetails, setShowAccommodationDetails] =
    useState<boolean>(false);
  const [currentAccommodation, setCurrentAccommodation] =
    useState<HistoryModel>();

  const dispatch = useDispatch<AppDispatch>();
  const accommodationState = useSelector(getTenantAccommodations);

  const {
    tenantAccommodations,
    totalElements,
    totalPages,
    page,
    size,
    status,
  } = accommodationState;

  // fetch accommodations by tenant
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    dispatch(
      fetchAccommodationsByTenant({
        userId: Number(currentUser.userId),
        page: 0,
        size: 25,
      })
    );
  }, [dispatch]);

  // filter facility accommodation
  useEffect(() => {
    const originalTenantAccommodations =
      tenantAccommodations.length > 0
        ? [...tenantAccommodations].sort((a, b) => {
            const aAccommodationId = a.accommodation.accommodationId
              ? parseInt(String(a.accommodation.accommodationId), 10)
              : 0;
            const bBidId = b.accommodation.accommodationId
              ? parseInt(String(b.accommodation.accommodationId), 10)
              : 0;
            return bBidId - aAccommodationId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredTenantAccommodations(originalTenantAccommodations);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredTenantAccommodations(
        originalTenantAccommodations.filter((tenantAccommodation) => {
          const {
            price,
            accommodationNumber,
            floor,
            dateCreated,
            accommodationType,
            availability,
          } = tenantAccommodation.accommodation;

          const accommodationYear = new Date(`${dateCreated}`).getFullYear();
          const accommodationMonth = new Date(`${dateCreated}`).getMonth() + 1;
          const accommodationDay = new Date(`${dateCreated}`).getDate();
          const accommodationDate =
            accommodationDay +
            "/" +
            accommodationMonth +
            "/" +
            accommodationYear;
          return (
            (accommodationDate &&
              accommodationDate.toLowerCase().includes(searchTerm)) ||
            (accommodationNumber &&
              accommodationNumber.toLowerCase().includes(searchTerm)) ||
            (floor && floor.toLowerCase().includes(searchTerm)) ||
            (accommodationType &&
              accommodationType.toLowerCase().includes(searchTerm)) ||
            (availability && availability.toLowerCase().includes(searchTerm)) ||
            (price && Number(price) === Number(searchTerm))
          );
        })
      );
    }
  }, [searchString, tenantAccommodations]);

  // handle search event
  const handleSearchAccommodation = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    dispatch(
      fetchAccommodationsByTenant({
        userId: Number(currentUser.userId),
        page: page + 1,
        size: 25,
      })
    );
  }, [dispatch, page, size]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    dispatch(
      fetchAccommodationsByTenant({
        userId: Number(currentUser.userId),
        page: page - 1,
        size: 25,
      })
    );
  }, [dispatch, page, size]);

  // show and hide accommodation details
  const toggleShowAccommodationDetails = () => {
    setShowAccommodationDetails(!showAccommodationDetails);
  };

  if (status === "loading") return <Preloader />;

  if (showAccommodationDetails)
    return (
      <div className="h-[calc(100vh-0px)] lg:px-5 overflow-auto w-full">
        <AccommodationDetails
          history={currentAccommodation}
          toggleShowAccommodationDetails={toggleShowAccommodationDetails}
        />
      </div>
    );

  return (
    <div className="users-list flex w-full py-2 h-svh lg:h-dvh mt-0 lg:mt-0 z-0">
      {!showAccommodationDetails && (
        <div className="w-full bg-gray-200 relative h-full">
          <div className="w-full">
            <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-3 lg:px-10 py-3 bg-white mb-5 mt-16 lg:mt-0">
              <div className="w-full lg:w-3/4 flex flex-wrap justify-between items-center">
                <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center font-bold">
                  <h1 className="text-lg">My accommodations</h1>
                  <h1 className="text-lg">
                    {tenantAccommodations.length + "/" + totalElements}
                  </h1>
                </div>
                <div
                  className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
                >
                  <input
                    type="text"
                    name=""
                    id="search-subscription"
                    placeholder="Search for bid..."
                    className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                    onChange={handleSearchAccommodation}
                  />

                  <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                    {<FaSearch />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="lg:px-5 mb-12 overflow-auto pb-5 relative"
            style={{ height: "calc(100vh - 170px)" }}
          >
            {filteredTenantAccommodations.length > 0 ? (
              <table className="border-2 w-full bg-white shadow-lg">
                <thead className="sticky top-0 bg-blue-900 text-white">
                  <tr>
                    {/* <th className="p-2 text-start font-bold">#</th> */}
                    <th className="p-2 text-start font-bold">Facility</th>
                    <th className="p-2 text-start font-bold">
                      Accommodation Number
                    </th>
                    <th className="p-2 text-start font-bold">
                      Accommodation Type
                    </th>
                    <th className="p-2 text-start font-bold">Floor</th>
                    <th className="p-2 text-start font-bold">Price</th>
                    <th className="p-2 text-start font-bold">Check-In</th>
                    <th className="p-2 text-start font-bold">Payment expiry</th>
                  </tr>
                </thead>
                <tbody className="text-black font-light">
                  {filteredTenantAccommodations.map(
                    (accommodation: HistoryModel, index: number) => (
                      <Accommodation
                        key={index}
                        checkIn={accommodation.checkIn}
                        accommodation={accommodation.accommodation}
                        onClick={() => {
                          setCurrentAccommodation(accommodation);
                          toggleShowAccommodationDetails();
                        }}
                      />
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <EmptyList itemName="accommodation" />
            )}
          </div>
          <PaginationButtons
            page={page}
            totalPages={totalPages}
            handleFetchNextPage={handleFetchNextPage}
            handleFetchPreviousPage={handleFetchPreviousPage}
          />
        </div>
      )}
    </div>
  );
};

Accommodations = React.memo(Accommodations);

export default Accommodations;
