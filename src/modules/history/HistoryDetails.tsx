import React, { useCallback, useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import { FaSearch } from "react-icons/fa";
import axios from "axios";

import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";
import {
  ACCOMMODATION_TYPE_DATA,
  ACCOMMODATION_CATEGORY,
  PAYMENT_PARTERN,
} from "../../global/PreDefinedData/PreDefinedData";
import { getCurrencyExchange } from "../../other/apis/CurrencyExchangeSlice";
import { UserModel } from "../users/models/userModel";
import { FormatMoney } from "../../global/actions/formatMoney";
import { fetchData } from "../../global/api";

import { RentModel } from "../rent/RentModel";
import RentForm from "../rent/RentForm";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import AccommodationRentRow from "../accommodations/AccommodationRentRow";
import {
  fetchAccommodationRent,
  getAccommodationRent,
  resetAccommodationRent,
} from "../accommodations/AccommodationRentSlice";
import { TenantModel } from "../auth/TenantModel";
import { HistoryModel } from "./HistoryModel";
import { parseISO } from "date-fns";

interface Props {
  history: HistoryModel | null;
  toggleShowAccommodationDetails: () => void;
}

const currentUser: UserModel = JSON.parse(
  localStorage.getItem("dnap-user") as string
);

let HistoryDetails: React.FC<Props> = ({
  history,
  toggleShowAccommodationDetails,
}) => {
  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const [desiredCurrency, setDesiredCurrency] = useState<string>("");
  const [convertedPrice, setConvertedPrice] = useState<number>(0);
  const [filteredAccommodationRent, setFilteredAccommodationRent] = useState<
    RentModel[]
  >([]);

  const [searchString, setSearchString] = useState<string>("");

  const [showRentForm, setShowRentForm] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const accommodationRentState = useSelector(getAccommodationRent);
  const { tenantRent, page, size, totalElements, totalPages } =
    accommodationRentState;

  const currencyState = useSelector(getCurrencyExchange);

  // set a list of currency names
  useEffect(() => {
    const currencyName = Object.keys(currencyState);
    setCurrencyNames(currencyName);
  }, [currencyState]);

  // set the converted money
  useEffect(() => {
    const fac = String(history?.accommodation.facility.preferedCurrency);
    setConvertedPrice(
      (Number(currencyState[desiredCurrency]) / Number(currencyState[fac])) *
        Number(history?.accommodation.price)
    );
  }, [
    currencyState,
    desiredCurrency,
    history?.accommodation.facility.preferedCurrency,
    history?.accommodation.price,
  ]);

  // fetch accommodation rent records
  useEffect(() => {
    dispatch(
      fetchAccommodationRent({
        tenantId: Number(history?.tenant.tenantId),
        accommodationId: Number(history?.accommodation.accommodationId),
        page: 0,
        size: 15,
      })
    );
  }, [history?.accommodation.accommodationId, dispatch]);

  // filter rent records
  useEffect(() => {
    const originalAccommodationRent =
      tenantRent.length > 0
        ? [...tenantRent]
            .filter(
              (rnt) =>
                Number(rnt.tenant.user.userId) === Number(currentUser.userId)
            )
            .sort((a, b) => {
              const aRentId = a.rentId ? parseInt(String(a.rentId), 10) : 0;
              const bRentId = b.rentId ? parseInt(String(b.rentId), 10) : 0;
              return bRentId - aRentId;
            })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredAccommodationRent(originalAccommodationRent);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredAccommodationRent(
        originalAccommodationRent.filter((rent) => {
          const {
            amount,
            tenant: {
              tenantId,
              user: { firstName, lastName },
            },
            paymentType,
            dateCreated,
          } = rent;

          const tenantNumber = "TNT-" + tenantId;

          const rentYear = new Date(`${dateCreated}`).getFullYear();
          const rentMonth = new Date(`${dateCreated}`).getMonth() + 1;
          const rentDay = new Date(`${dateCreated}`).getDate();
          const rentDate = rentDay + "/" + rentMonth + "/" + rentYear;
          return (
            (Number(
              rent.accommodation.tenants &&
                rent.accommodation.tenants.find(
                  (tnt: TenantModel) =>
                    Number(tnt.user.userId) === Number(currentUser.userId)
                )?.user.userId
            ) === Number(currentUser.userId) &&
              rentDate &&
              rentDate.toLowerCase().includes(searchTerm)) ||
            (firstName && firstName.toLowerCase().includes(searchTerm)) ||
            (lastName && lastName.toLowerCase().includes(searchTerm)) ||
            (tenantNumber && tenantNumber.toLowerCase().includes(searchTerm)) ||
            (paymentType && paymentType.toLowerCase().includes(searchTerm)) ||
            (amount && Number(amount) === Number(searchTerm))
          );
        })
      );
    }
  }, [searchString, tenantRent]);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-accommodation/${Number(
          history?.accommodation.accommodationId
        )}/${page + 1}/${size}`
      );
      dispatch(resetAccommodationRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, history?.accommodation.accommodationId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-accommodation/${Number(
          history?.accommodation.accommodationId
        )}/${page - 1}/${size}`
      );
      dispatch(resetAccommodationRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, history?.accommodation.accommodationId]);

  if (showRentForm) {
    return (
      <RentForm
        accommodationId={history?.accommodation.accommodationId}
        setIsShowRentForm={setShowRentForm}
      />
    );
  }

  return (
    <div className="w-full h-fit p-0 relative mt-24 lg:mt-0">
      <div className="w-full lg:w-full m-auto h-full shadow-xl">
        <div className="w-full p-2 flex justify-between items-center sticky top-0  shadow-lg z-10 bg-white">
          <h1 className="text-lg font-bold">
            {history?.accommodation.accommodationNumber}
          </h1>
          <div className="price flex">
            <select
              name="currency"
              id="currency"
              className="bg-gray-200 rounded-lg p-1 mx-1 uppercase border-none outline-none"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDesiredCurrency(e.target.value)
              }
            >
              <option
                value={history?.accommodation.facility.preferedCurrency}
                className="bg-gray-200"
              >
                {history?.accommodation.facility.preferedCurrency}
              </option>
              {currencyNames.map((crn) => (
                <option value={crn} className="bg-gray-200">
                  {crn}
                </option>
              ))}
            </select>
            <h1 className="text-lg font-bold font-mono text-black">
              {FormatMoney(
                !desiredCurrency
                  ? Number(history?.accommodation.price)
                  : Number(convertedPrice),
                2,
                !desiredCurrency
                  ? String(history?.accommodation.facility.preferedCurrency)
                  : desiredCurrency
              )}
            </h1>
          </div>
          <RxCross1
            title="close"
            className="p-1 lg:hover:bg-red-600 lg:hover:text-white text-3xl rounded-sm cursor-pointer"
            onClick={() => {
              toggleShowAccommodationDetails();
              // navigate(accommodation. `/accommodations`);
            }}
          />
        </div>
        <div className="w-full h-full flex flex-wrap justify-between items-start pt-10">
          <div className="w-full lg:w-1/3 px-3">
            {/* facility details */}
            <div className="p-4 w-full  shadow-lg">
              <h2 className="text-xl font-bold">Facility</h2>
              <div className="p-2 flex justify-start items-center w-full">
                <p className="text-sm flex flex-wrap">
                  <span className="w-full">
                    <b>ID/Number: </b>
                    <span>
                      {"FAC-" + history?.accommodation.facility.facilityId}
                    </span>
                  </span>
                  <span className="w-full">
                    <b>Name: </b>
                    <span>{history?.accommodation.facility.facilityName}</span>
                  </span>
                  <span className="w-full">
                    <b>Location: </b>
                    <span>
                      {history?.accommodation.facility.facilityLocation.city +
                        " " +
                        history?.accommodation.facility.facilityLocation
                          .country}
                    </span>
                  </span>
                  <span className="w-full">
                    <b>Primary address: </b>
                    <span>
                      {
                        history?.accommodation.facility.facilityLocation
                          .primaryAddress
                      }
                    </span>
                  </span>
                  <span className="w-full">
                    <b>Tel: </b>
                    <span>
                      {history?.accommodation.facility.contact.telephone1}
                    </span>
                  </span>

                  <span className="w-full">
                    <b>Email: </b>
                    <span>{history?.accommodation.facility.contact.email}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* accommodation section */}
            <div className="p-4 w-full  shadow-lg">
              <h2 className="text-xl font-bold">Unit details</h2>
              <div className="p-2 flex justify-start items-center w-full">
                <p className="text-sm flex flex-wrap">
                  <span className="w-full">
                    <b>Number: </b>
                    <span>{history?.accommodation.accommodationNumber}</span>
                  </span>
                  <span className="w-full">
                    <b>Floor: </b>
                    <span>{history?.accommodation.floor}</span>
                  </span>
                  <span className="w-full">
                    <b>Type: </b>
                    <span>
                      {
                        ACCOMMODATION_TYPE_DATA.find(
                          (type) =>
                            type.value ===
                            history?.accommodation.accommodationType
                        )?.label
                      }
                    </span>
                  </span>
                  {history?.accommodation.accommodationCategory && (
                    <span className="w-full">
                      <b>Category: </b>
                      <span>
                        {
                          ACCOMMODATION_CATEGORY.find(
                            (category) =>
                              category.value ===
                              history?.accommodation.accommodationCategory
                          )?.label
                        }
                      </span>
                    </span>
                  )}

                  {history?.accommodation.capacity && (
                    <span className="w-full">
                      <b>Capacity: </b>
                      <span>{history?.accommodation.capacity}</span>
                    </span>
                  )}

                  <span className="w-full">
                    <b>Price: </b>
                    <span className="font-mono">
                      {FormatMoney(
                        !desiredCurrency
                          ? Number(history?.accommodation.price)
                          : Number(convertedPrice),
                        2,
                        !desiredCurrency
                          ? String(
                              history?.accommodation.facility.preferedCurrency
                            )
                          : desiredCurrency
                      )}{" "}
                      /{" "}
                      {
                        PAYMENT_PARTERN.find(
                          (parttern) =>
                            parttern.value ===
                            history?.accommodation.paymentPartten
                        )?.label
                      }
                    </span>
                  </span>
                  <span className="w-full">
                    <b>Status: </b>
                    <span>{history?.accommodation.availability}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* time lines */}
            <div className="p-4 w-full  shadow-lg">
              <h2 className="text-xl font-bold">Timelines</h2>
              <div className="p-2 flex justify-start items-center w-full">
                <p className="text-sm flex flex-wrap">
                  <span className="w-full">
                    <b>CheckIn: </b>
                    <span>
                      {parseISO(String(history?.checkIn)).toDateString()}
                    </span>
                  </span>
                  <span className="w-full">
                    <b>CheckOut: </b>
                    <span>
                      {parseISO(String(history?.checkOut)).toDateString()}
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* accommodation rent records*/}
          <div className="w-full lg:w-2/3 pb-5 lg:pb-5 relative ">
            <div className="flex justify-around items-center w-full py-5 shadow-lg">
              <h2 className=" text-center font-bold text-xl">
                Payment records
              </h2>
            </div>
            <div className="flex w-full items-center justify-between lg:justify-end px-2 lg:px-10 py-2">
              <h3 className="px-2 lg:px-10 text-sm font-bold">
                {filteredAccommodationRent.length + "/" + totalElements}
              </h3>
              <div
                className={` rounded-full  bg-white flex justify-between border-gray-400 border-2 w-5/6 lg:w-1/2 h-3/4 mt-0 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-rent"
                  placeholder="Search for rent record..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchString(e.target.value)
                  }
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-sm text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
            <div className="lg:pb-12 mb-16 h-[calc(100vh-330px)] overflow-auto">
              <table className="w-full px-1 text-center text-sm bg-cyan-50">
                <thead className="bg-blue-900 text-white sticky top-0">
                  <tr className="border-y-blue-500">
                    <th className="text-white">No.</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Payment type</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody className="">
                  {filteredAccommodationRent.map((fr, index) => (
                    <AccommodationRentRow key={index} rent={fr} />
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationButtons
              handleFetchNextPage={handleFetchNextPage}
              handleFetchPreviousPage={handleFetchPreviousPage}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

HistoryDetails = React.memo(HistoryDetails);

export default HistoryDetails;
