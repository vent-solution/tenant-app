import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BookingModel } from "./BookingModel";
import { FaSearch } from "react-icons/fa";
import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";
import AlertMessage from "../../other/alertMessage";
import Preloader from "../../other/Preloader";

import { fetchTenantBookings, getTenantBookings } from "./bookingsSlice";
import { UserModel } from "../users/models/userModel";
import BookingRow from "./BookingRow";
import EmptyList from "../../global/EnptyList";
interface Props {}

let BookingsList: React.FC<Props> = () => {
  const [filteredBookings, setFilteredBookings] = useState<BookingModel[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const bookingsState = useSelector(getTenantBookings);
  const {
    tenantBookings,
    page,
    size,
    totalElements,
    totalPages,
    status,
    error,
  } = bookingsState;

  // fetch tenant bookings
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    dispatch(
      fetchTenantBookings({
        userId: Number(currentUser.userId),
        page: 0,
        size: 25,
      })
    );
  }, [dispatch]);

  // filter tenant bookings
  useEffect(() => {
    const originalBookings: BookingModel[] = tenantBookings;
    if (searchString.trim().length < 1) {
      setFilteredBookings(originalBookings);
    } else {
      setFilteredBookings(
        originalBookings.filter((booking) => {
          const date = new Date(String(booking.dateCreated)).getDate();
          const month = new Date(String(booking.dateCreated)).getMonth() + 1;
          const year = new Date(String(booking.dateCreated)).getFullYear();

          const bookingDate = date + "/" + month + "/" + year;

          const { amount, paymentType, tenant, checkIn } = booking;

          return (
            bookingDate.toLocaleLowerCase().trim().includes(searchString) ||
            (tenant.user.firstName &&
              tenant.user.firstName
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (tenant.user.lastName &&
              tenant.user.lastName
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (tenant.user.userEmail &&
              tenant.user.userEmail
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (tenant.companyName &&
              tenant.companyName
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (checkIn &&
              checkIn.toLocaleLowerCase().trim().includes(searchString)) ||
            (paymentType &&
              paymentType.toLocaleLowerCase().trim().includes(searchString)) ||
            Number(amount) === Number(searchString)
          );
        })
      );
    }
  }, [tenantBookings, searchString]);

  // handle search for booking
  const handleSearchBooking = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    const currentUser = JSON.parse(localStorage.getItem("dnap-user") as string);
    dispatch(
      fetchTenantBookings({
        userId: Number(currentUser.userId),
        page: page + 1,
        size: size,
      })
    );
  }, [dispatch, page, size]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    dispatch(
      fetchTenantBookings({
        userId: Number(currentUser.userId),
        page: page - 1,
        size: size,
      })
    );
  }, [dispatch, page, size]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  return (
    <div className="users-list flex w-full py-2 h-svh lg:h-dvh mt-24 lg:mt-0 z-0">
      <div className="list w-full bg-gray-100 relative">
        <div className="bg-white w-full shadow-lg">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-2 lg:px-10 py-3">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center font-bold">
                <h1 className="text-lg text-blue-900">Bookings</h1>
                <h1 className="text-lg">
                  {tenantBookings.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for booking..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchBooking}
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 h-[calc(100vh-170px)] overflow-auto py-5 relative">
          {filteredBookings.length > 0 ? (
            <table className="border-2 w-full bg-white text-start">
              <thead className="sticky top-0 bg-blue-900 text-white">
                <tr>
                  {/* <th className="p-2 text-start font-bold">No.</th> */}
                  <th className="p-2 text-start font-bold">
                    Accommodation Category
                  </th>
                  <th className="p-2 text-start font-bold">Unit Number</th>
                  <th className="p-2 text-start font-bold">Facility Name</th>
                  <th className="p-2 text-start font-bold">
                    Facility Telephone
                  </th>
                  <th className="p-2 text-start font-bold">Facility Email</th>
                  <th className="p-2 text-start font-bold">Booking Amount</th>
                  <th className="p-2 text-start font-bold">Payment method</th>
                  <th className="p-2 text-start font-bold">Expected CheckIn</th>
                  <th className="p-2 text-start font-bold">Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <BookingRow key={index} booking={booking} />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyList itemName="booking" />
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

BookingsList = React.memo(BookingsList);

export default BookingsList;
