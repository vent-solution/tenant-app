import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTenantHistory, getTenantHistory } from "./HistorySlice";
import FacilityHistoryRow from "./HistoryRow";
import { FaSearch } from "react-icons/fa";
import { HistoryModel } from "./HistoryModel";
import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";
import Preloader from "../../other/Preloader";
import { UserModel } from "../users/models/userModel";
import HistoryDetails from "./HistoryDetails";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import EmptyList from "../../global/EnptyList";

interface Props {}
let HistoryList: React.FC<Props> = () => {
  const [filteredTenantHistory, setFilteredTenantHistory] = useState<
    HistoryModel[]
  >([]);
  const [searchString, setSearchString] = useState<string>("");

  const [currentAccommodation, setCurrentAccommodation] =
    useState<AccommodationModel>();

  const [showAccommodationDetails, setShowAccommodationDetails] =
    useState<boolean>(false);

  const [selectedHistory, setSelectedHistory] = useState<HistoryModel | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();
  const tenantHistoryState = useSelector(getTenantHistory);
  const {
    tenantHistory,
    status,
    error,
    totalElements,
    totalPages,
    page,
    size,
  } = tenantHistoryState;

  const currentUser: UserModel = JSON.parse(
    localStorage.getItem("dnap-user") as string
  );

  // fetch tenant history
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    dispatch(
      fetchTenantHistory({
        userId: Number(currentUser.userId),
        page: 0,
        size: 20,
      })
    );
  }, [dispatch]);

  // filter tenant history
  useEffect(() => {
    if (searchString.trim().length < 1) {
      setFilteredTenantHistory(tenantHistory);
    } else {
      setFilteredTenantHistory(
        tenantHistory.filter((history) => {
          const inDate = new Date(String(history.checkIn)).getDate();
          const inMonth = new Date(String(history.checkIn)).getMonth() + 1;
          const inYear = new Date(String(history.checkIn)).getFullYear();

          const inHistoryDate = inDate + "/" + inMonth + "/" + inYear;

          const tenantNumber = "TNT-" + history.tenant.tenantId;

          return (
            inHistoryDate.toLocaleLowerCase().trim().includes(searchString) ||
            tenantNumber.toLocaleLowerCase().trim().includes(searchString) ||
            (history.accommodation.accommodationNumber &&
              history.accommodation.accommodationNumber
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (history.tenant.user.firstName &&
              history.tenant.user.firstName
                ?.toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (history.tenant.user.lastName &&
              history.tenant.user.lastName
                ?.toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (history.tenant.user.userTelephone &&
              history.tenant.user.userTelephone
                ?.toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (history.tenant.user.userEmail &&
              history.tenant.user.userEmail
                ?.toLocaleLowerCase()
                .trim()
                .includes(searchString))
          );
        })
      );
    }
  }, [tenantHistory, searchString]);

  // handle search facility history
  const handleSearchFacilityHistory = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchString(e.target.value);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    dispatch(
      fetchTenantHistory({
        userId: Number(currentUser.userId),
        page: page + 1,
        size: size,
      })
    );
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    dispatch(
      fetchTenantHistory({
        userId: Number(currentUser.userId),
        page: page - 1,
        size: size,
      })
    );
  }, [dispatch, page, size]);

  // show and hide accommodation details
  const toggleShowAccommodationDetails = () => {
    setShowAccommodationDetails(!showAccommodationDetails);
  };

  // conditional rendering depending on error or status
  if (status === "loading") return <Preloader />;
  if (error) return <h1>{error}</h1>;

  if (showAccommodationDetails)
    return (
      <div className="h-[calc(100vh-0px)] lg:px-5 overflow-auto w-full">
        <HistoryDetails
          history={selectedHistory}
          toggleShowAccommodationDetails={toggleShowAccommodationDetails}
        />
      </div>
    );

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0 bg-gray-200">
      <div className="list w-full relative">
        <div className="bg-white w-full">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-2 lg:px-10 py-3 bg-white shadow-lg">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-2xl text-blue-900">History</h1>
                <h1 className="text-lg">
                  {filteredTenantHistory.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for history..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchFacilityHistory}
                />

                <button className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:px-5 mb-12 overflow-auto pb-5"
          style={{ height: "calc(100vh - 150px)" }}
        >
          {filteredTenantHistory.length > 0 ? (
            <table className="border-2 w-full bg-white mt-2 lg:mt-0 shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr>
                  <th className="p-2 text-start font-bold">Facility</th>
                  <th className="p-2 text-start font-bold">Unit</th>
                  <th className="p-2 text-start font-bold">Floor</th>
                  <th className="p-2 text-start font-bold">Unit Type</th>
                  <th className="p-2 text-start font-bold">Facility Tel</th>
                  <th className="p-2 text-start font-bold">Facility Email</th>
                  <th className="p-2 text-start font-bold">Check-In</th>
                  <th className="p-2 text-start font-bold">Check-Out</th>
                </tr>
              </thead>
              <tbody>
                {tenantHistory.map((history, index) => (
                  <FacilityHistoryRow
                    key={index}
                    history={history}
                    onClick={() => {
                      setCurrentAccommodation(history.accommodation);
                      setSelectedHistory(history);
                      toggleShowAccommodationDetails();
                    }}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyList itemName="history" />
          )}
        </div>
        <PaginationButtons
          page={page}
          totalPages={totalPages}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>
    </div>
  );
};

HistoryList = React.memo(HistoryList);

export default HistoryList;
