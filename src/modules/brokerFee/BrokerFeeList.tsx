import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { FaExclamationCircle, FaSearch } from "react-icons/fa";
import AlertMessage from "../../other/alertMessage";
import Preloader from "../../other/Preloader";
import {
  fetchBrokerFees,
  getBrokerFees,
  resetBrokerFees,
} from "./BrokerFeesSlice";
import { BrokerFeeModel } from "./BrokerFeeModel";
import BrokerFeeRow from "./BrokerFeeRow";
import axios from "axios";
import { fetchData } from "../../global/api";
import PaginationButtons from "../../global/PaginationButtons";
import { AppDispatch } from "../../app/store";
import { UserModel } from "../users/models/userModel";
import BrokerFeesForm from "./BrokerFeesForm";
import { FaExclamation } from "react-icons/fa6";

interface Props {}
const BrokerFeeList: React.FC<Props> = () => {
  // local state variabes
  const [searchString, setSearchString] = useState<string>("");
  const [filteredBrokerFees, setFilteredBrokerFees] = useState<
    BrokerFeeModel[]
  >([]);

  const [showBrokerFeesForm, setShowBrokerFeesForm] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const brokerFeesState = useSelector(getBrokerFees);
  const { brokerFees, status, error, page, size, totalElements, totalPages } =
    brokerFeesState;

  // fetch broker fees
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    dispatch(
      fetchBrokerFees({ userId: Number(currentUser.userId), page: 0, size: 25 })
    );
  }, [dispatch]);

  // filter broker fees
  useEffect(() => {
    const originalBrokerFees =
      brokerFees.length > 0
        ? [...brokerFees].sort((a, b) => {
            const aBrokerFeeId = a.brokerFeeId
              ? parseInt(a.brokerFeeId, 10)
              : 0;
            const bBrokerFeeId = b.brokerFeeId
              ? parseInt(b.brokerFeeId, 10)
              : 0;
            return bBrokerFeeId - aBrokerFeeId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredBrokerFees(originalBrokerFees);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredBrokerFees(
        originalBrokerFees.filter((brokerFee) => {
          const { tenant, dateCreated } = brokerFee;

          const tenantNumber = "TNT-" + tenant.tenantId;

          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const brokerFeeDate = date + "/" + month + "/" + year;

          return (
            (tenant?.user?.firstName &&
              tenant?.user?.firstName.toLowerCase().includes(searchTerm)) ||
            (tenant?.user?.lastName &&
              tenant?.user?.lastName.toLowerCase().includes(searchTerm)) ||
            (brokerFee.paymentType &&
              brokerFee.paymentType.toLowerCase().includes(searchTerm)) ||
            (tenantNumber && tenantNumber.toLowerCase().includes(searchTerm)) ||
            (brokerFeeDate && brokerFeeDate.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, brokerFees]);

  // handle search event
  const handleSerchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetch-broker-fees/${page + 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetBrokerFees(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetch-broker-fees/${page - 1}/${size}`);
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetBrokerFees(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  if (showBrokerFeesForm)
    return <BrokerFeesForm setShowBrokerFeesForm={setShowBrokerFeesForm} />;

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0">
      <div className="list w-full relative bg-gray-100">
        <div className="bg-white w-full">
          {/* <div className="upper bg-yellow-400 w-full h-2/3"></div> */}
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3 bg-white shadow-lg">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <button
                  className="text-sm bg-blue-600 lg:hover:bg-blue-400 px-5 py-1 text-white"
                  onClick={() => setShowBrokerFeesForm(true)}
                >
                  Pay broker fees
                </button>
                <h1 className="text-lg font-bold">
                  {filteredBrokerFees.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for subscription..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSerchUser}
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 h-[calc(100vh-170px)] overflow-auto pb-5 relative mt-2">
          {filteredBrokerFees.length > 0 ? (
            <table className="border-2 w-full bg-white bordered">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr>
                  <th className="px-2">#</th>
                  <th className="px-2">Fee number</th>
                  <th className="px-2">Tenant number</th>
                  <th className="px-2">First name</th>
                  <th className="px-2">Last name</th>
                  <th className="px-2">Amount</th>
                  <th className="px-2">Payment type</th>
                  <th className="px-2">Payment date</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredBrokerFees.map(
                  (brokerFee: BrokerFeeModel, index: number) => (
                    <BrokerFeeRow
                      key={index}
                      brokerFee={brokerFee}
                      brokerFeeIndex={index}
                    />
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-full flex flex-wrap justify-center items-center">
              <h1 className="text-xl w-full px-10 flex justify-center items-center">
                <FaExclamationCircle className="text-red-500" />{" "}
                <span>NO RESULT FOUND</span>
              </h1>
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
      <AlertMessage />
    </div>
  );
};

export default BrokerFeeList;
