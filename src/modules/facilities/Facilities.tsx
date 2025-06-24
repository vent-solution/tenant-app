import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchData } from "../../global/api";

import { FacilitiesModel } from "./FacilityModel";
import { getFacilities, resetFacilities } from "./FacilitiesSlice";
import { FaSearch } from "react-icons/fa";
import FacilitiesTable from "./FacilitiesTable";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { UserModel } from "../users/models/userModel";

interface Props {}

const user: UserModel = JSON.parse(localStorage.getItem("dnap-user") as string);

const Facilities: React.FC<Props> = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [filteredFacilities, setFilteredFacilities] = useState<
    FacilitiesModel[]
  >([]);

  const [isAddFacility, setIsAddFacility] = useState<boolean>(false);
  const [currentUser] = useState<UserModel>(user);

  const dispatch = useDispatch<AppDispatch>();
  const facilitiesState = useSelector(getFacilities);
  const { facilities, status, error, page, size, totalElements, totalPages } =
    facilitiesState;

  // toggel Is Add Facility
  const toggelIsAddFacility = () => {
    return setIsAddFacility(!isAddFacility);
  };

  // // fetch facilities that belong to the current landlord
  // useEffect(() => {
  //   let userId: number;

  //   if (currentUser?.userRole !== UserRoleEnum.landlord) {
  //     userId = Number(currentUser?.linkedTo);
  //   } else {
  //     userId = Number(currentUser.userId);
  //   }

  //   dispatch(
  //     fetchFacilities({
  //       userId: Number(userId),
  //       page: 0,
  //       size: 25,
  //     })
  //   );
  // }, [
  //   currentUser?.linkedTo,
  //   currentUser?.userId,
  //   currentUser?.userRole,
  //   dispatch,
  // ]);

  // filter facilities basing on various parameters
  useEffect(() => {
    if (searchString.trim().length === 0) {
      setFilteredFacilities(facilities);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredFacilities(
        facilities.filter((facility) => {
          const {
            facilityId,
            facilityName,
            facilityCategory,
            dateCreated,
            contact: { telephone1, email },
            facilityLocation: { country, city },
          } = facility;

          const facilityNumber = "FAC-" + facilityId;

          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const facilityDateAdded = date + "/" + month + "/" + year;

          return (
            (facilityId && facilityNumber.toLowerCase().includes(searchTerm)) ||
            (facilityName && facilityName.toLowerCase().includes(searchTerm)) ||
            (facilityCategory &&
              facilityCategory.toLowerCase().includes(searchTerm)) ||
            (country && country.toLowerCase().includes(searchTerm)) ||
            (city && city.toLowerCase().includes(searchTerm)) ||
            (telephone1 && telephone1.toLowerCase().includes(searchTerm)) ||
            (email && email.toLowerCase().includes(searchTerm)) ||
            (facilityDateAdded &&
              facilityDateAdded.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, facilities]);

  // on change of the search field
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  }, []);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    let userId: number;

    if (currentUser?.userRole !== UserRoleEnum.landlord) {
      userId = Number(currentUser?.linkedTo);
    } else {
      userId = Number(currentUser.userId);
    }

    try {
      const result = await fetchData(
        `/fetch-facilities-by-landlord/${userId}/${page + 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [
    dispatch,
    page,
    size,
    currentUser?.linkedTo,
    currentUser.userId,
    currentUser?.userRole,
  ]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    let userId: number;

    if (currentUser?.userRole !== UserRoleEnum.landlord) {
      userId = Number(currentUser?.linkedTo);
    } else {
      userId = Number(currentUser.userId);
    }
    try {
      const result = await fetchData(
        `/fetch-facilities-by-landlord/${userId}/${page - 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ADMINS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [
    dispatch,
    page,
    size,
    currentUser?.linkedTo,
    currentUser.userId,
    currentUser?.userRole,
  ]);

  // if (status === "loading") return <Preloader />;

  if (status === "failed") return <p>Error loading facilities: {error}</p>;

  return (
    <div className="users-list flex w-full h-svh  mt-20 lg:mt-0 z-0 ">
      <div className="list w-full relative bg-gray-200">
        <div className=" w-full">
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3 bg-white sticky top-0 shadow-lg">
            {!isAddFacility && (
              <div className="w-full lg:w-3/4 flex flex-wrap justify-between items-center">
                <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                  <h1
                    className="text-lg py-1 p-5 bg-gray-600 text-white cursor-pointer lg:hover:bg-gray-400 rounded-lg"
                    onClick={() => {}}
                  >
                    Download facilities
                  </h1>
                  <h1
                    className="text-lg py-1 p-5 bg-blue-600 text-white cursor-pointer lg:hover:bg-blue-400 rounded-lg"
                    onClick={toggelIsAddFacility}
                  >
                    Add Facility
                  </h1>
                  <h1 className="text-lg font-bold">
                    {filteredFacilities.length + "/" + totalElements}
                  </h1>
                </div>
                <div
                  className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
                >
                  <input
                    type="text"
                    name=""
                    id="search-users"
                    placeholder="Search for user..."
                    className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                    onChange={handleChange}
                  />
                  <button className="bg-blue-900 hover:bg-blue-600 text-white p-2 rounded-full text-xl text-center border ">
                    {<FaSearch />}
                  </button>
                </div>
              </div>
            )}
          </div>
          <FacilitiesTable
            filteredFacilities={filteredFacilities}
            page={page}
            totalPages={totalPages}
            handleFetchNextPage={handleFetchNextPage}
            handleFetchPreviousPage={handleFetchPreviousPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Facilities;
