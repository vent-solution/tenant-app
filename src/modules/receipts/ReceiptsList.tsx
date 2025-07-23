import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FaSearch } from "react-icons/fa";
import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";
import Preloader from "../../other/Preloader";
import { UserModel } from "../users/models/userModel";

import ReceiptRow from "./ReceiptRow";
import { fetchReceipts, getReceipts } from "./receiptsSlice";
import { ReceiptModel } from "./ReceiptModel";
import ReceiptDetails from "./ReceiptDetails";
import EmptyList from "../../global/EmptyList";

interface Props {}
const ReceiptsList: React.FC<Props> = () => {
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptModel[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const [currentReceipt, setCurrentReceipt] = useState<ReceiptModel>();

  const [showReceiptDetails, setShowReceiptDetails] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const receiptState = useSelector(getReceipts);
  const { receipts, page, size, totalElements, totalPages, status, error } =
    receiptState;

  // filter tenant history
  useEffect(() => {
    if (searchString.trim().length < 1) {
      setFilteredReceipts(receipts);
    } else {
      setFilteredReceipts(
        receipts.filter((receipt) => {
          const paymentDate = new Date(String(receipt.paymentDate)).getDate();
          const paymentMonth =
            new Date(String(receipt.paymentDate)).getMonth() + 1;
          const paymentYear = new Date(
            String(receipt.paymentDate)
          ).getFullYear();

          const receiptPaymentDate =
            paymentDate + "/" + paymentMonth + "/" + paymentYear;

          const receiptId = "RCT-" + receipt.receiptId;

          return (
            receiptPaymentDate
              .toLocaleLowerCase()
              .trim()
              .includes(searchString) ||
            receiptId.toLocaleLowerCase().trim().includes(searchString) ||
            (receipt.receiptNumber &&
              receipt.receiptNumber
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (receipt.transaction &&
              receipt.transaction
                ?.toLocaleLowerCase()
                .trim()
                .includes(searchString))
          );
        })
      );
    }
  }, [receipts, searchString]);

  // handle search receipt
  const handleSearchReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    dispatch(
      fetchReceipts({
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
      fetchReceipts({
        userId: Number(currentUser.userId),
        page: page - 1,
        size: size,
      })
    );
  }, [dispatch, page, size]);

  // show and hide receipt details
  const toggleShowReceiptDetails = () => {
    setShowReceiptDetails(!showReceiptDetails);
  };

  // conditional rendering depending on error or status
  if (status === "loading") return <Preloader />;
  if (error) return <h1>{error}</h1>;

  if (showReceiptDetails)
    return (
      <div className="h-[calc(100vh-0px)] lg:px-5 overflow-auto w-full">
        <ReceiptDetails
          receipt={currentReceipt}
          toggleShowReceiptDetails={toggleShowReceiptDetails}
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
                <h1 className="text-2xl text-blue-900">Receipts</h1>
                <h1 className="text-lg font-bold">
                  {filteredReceipts.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-800 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for receipt"
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchReceipt}
                />

                <button className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:px-5 mb-10 mt-3 overflow-auto pb-5"
          style={{ height: "calc(100vh - 150px)" }}
        >
          {filteredReceipts.length > 0 ? (
            <table className="border-2 w-full bg-white mt-2 lg:mt-0 shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-white text-ms">
                <tr>
                  <th className="p-2 text-start font-bold">Receipt Number</th>
                  <th className="p-2 text-start font-bold">Transaction</th>
                  <th className="p-2 text-start font-bold">Amount</th>
                  <th className="p-2 text-start font-bold">Payment method</th>
                  <th className="p-2 text-start font-bold">Transaction date</th>
                  <th className="p-2 text-start font-bold">Description</th>
                  <th className="p-2 text-start font-bold">Date created</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((receipt, index) => (
                  <ReceiptRow
                    key={index}
                    receipt={receipt}
                    onClick={() => {
                      setCurrentReceipt(receipt);
                      toggleShowReceiptDetails();
                    }}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyList itemName="receipt" />
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

export default ReceiptsList;
