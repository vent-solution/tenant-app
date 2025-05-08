import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import {
  ACCOMMODATION_CATEGORY,
  ACCOMMODATION_TYPE_DATA,
  PAYMENT_TYPE_DATA,
} from "../../global/PreDefinedData/PreDefinedData";
import { FormatMoney } from "../../global/actions/formatMoney";
import { TransactionStatusEnum } from "../../global/enums/transactionStatusEnum";
import { UserModel } from "../users/models/userModel";
import { PaymentTypeEnum } from "../../global/enums/paymentTypeEnum";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import axios from "axios";
import { postData } from "../../global/api";
import { setConfirm } from "../../other/ConfirmSlice";
import { setUserAction } from "../../global/actions/actionSlice";
import { useNavigate } from "react-router-dom";
import { BookingCreationModel } from "./BookingModel";
import { AccommodationModel } from "../accommodations/AccommodationModel";

interface Props {
  accommodation?: AccommodationModel;
  setIsShowBookingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

let BookingForm: React.FC<Props> = ({
  accommodation,
  setIsShowBookingForm,
}) => {
  const [bookingData, setBookingData] = useState<BookingCreationModel>({
    amount: 0,
    currency: "",
    paymentType: PaymentTypeEnum.others,
    checkIn: "",
    transactionDate: "",
    transactionStatus: TransactionStatusEnum.pending,
    accommodation: { accommodationId: Number(accommodation?.accommodationId) },
  });

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const bookingAmount =
    (Number(accommodation?.price) *
      Number(accommodation?.facility.bookingPercentage)) /
    100;

  // SET THE DEFAULT BOOKING DATA
  useEffect(() => {
    if (accommodation) {
      setBookingData((prev) => ({
        ...prev,
        amount:
          (Number(accommodation.price) *
            Number(accommodation.facility.bookingPercentage)) /
          100,
        currency: accommodation.facility.preferedCurrency,
        paymentType: PaymentTypeEnum.others,
        accommodationType: String(accommodation.accommodationType),
        accommodationCategory: accommodation.accommodationCategory
          ? String(accommodation.accommodationCategory)
          : null,
        transactionDate: String(new Date().toISOString()),
        transactionStatus: TransactionStatusEnum.pending,
        facility: {
          facilityId: Number(accommodation.facility?.facilityId || 0),
        },
      }));
    }
  }, [accommodation]);

  // submit the accommodation booking
  const submitBooking = async () => {
    const currentUSer: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    // check if checkIn date is provided
    if (String(bookingData.checkIn).trim().length < 1) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Please choose expected checkIn date.",
        })
      );

      return;
    }

    // check if payment method is selected
    if (
      String(bookingData.paymentType) === PaymentTypeEnum.others &&
      bookingAmount > 0
    ) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Please select a payment method.",
        })
      );

      return;
    }

    // check if correct checkIn date is provided
    if (
      new Date(String(bookingData.checkIn)).getTime() < new Date().getTime()
    ) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Please select a current or future checkIn date.",
        })
      );

      return;
    }

    try {
      const result = await postData(
        `/book-accommodation-by-tenant/${Number(currentUSer.userId)}`,
        bookingData
      );

      if (!result) {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            status: true,
            message: "ERROR OCCURRED PLEASE TRY AGAIN!!",
          })
        );
        return;
      }

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            status: true,
            message: result.data.message,
          })
        );

        return;
      }

      if (result.status !== 200) {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: "Error occurred please try again.",
          })
        );
        return;
      }

      dispatch(
        setAlert({
          type: AlertTypeEnum.success,
          status: true,
          message: result.data.message,
        })
      );

      navigate("/bookings");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("BOOKING CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ status: false, message: "" }));
    }
  };

  return (
    <div className="w-full h-100vh bg-gray-100 overflow-auto">
      <div className="p-5 bg-white flex justify-end w-full shadow-lg sticky top-0">
        <h1 className="text-2xl w-5/6 text-center text-gray-700">
          Book{" "}
          {
            ACCOMMODATION_TYPE_DATA.find(
              (type) => type.value === accommodation?.accommodationType
            )?.label
          }{" "}
          {accommodation?.accommodationNumber}
        </h1>
        <h1
          className="text-2xl text-bold p-2 lg:hover:bg-red-500 lg:hover:text-white cursor-pointer"
          onClick={() => setIsShowBookingForm(false)}
        >
          <RxCross1 />
        </h1>
      </div>

      <div className="py-10 flex flex-wrap justify-center w-full">
        <h1 className="text-3xl font-bold w-full text-center">
          {accommodation?.facility.facilityName},{" "}
          {accommodation?.facility.facilityLocation.city}{" "}
          {accommodation?.facility.facilityLocation.country}
        </h1>
        <h2 className="text-xl text-gray-700 w-full text-center">
          {
            ACCOMMODATION_TYPE_DATA.find(
              (type) => type.value === accommodation?.accommodationType
            )?.label
          }{" "}
          {accommodation?.accommodationCategory &&
            "(" +
              ACCOMMODATION_CATEGORY.find(
                (category) =>
                  category.value === accommodation?.accommodationCategory
              )?.label +
              ")"}
          {Number(accommodation?.capacity) > 1 &&
            "(" + accommodation?.capacity + " Seat(s))"}
        </h2>

        <h2 className="text-xl text-green-600 w-full text-center">
          {FormatMoney(
            Number(accommodation?.price),
            2,
            String(accommodation?.facility.preferedCurrency)
          )}
        </h2>

        <h2 className="text-xl text-gray-600 w-full text-center py-5">
          Booking amount ({accommodation?.facility.bookingPercentage}%):{" "}
          <span className="text-gray-900 font-mono">
            {FormatMoney(
              (Number(accommodation?.price) *
                Number(accommodation?.facility.bookingPercentage)) /
                100,
              2,
              String(accommodation?.facility.preferedCurrency)
            )}
          </span>
        </h2>

        <form
          className="w-full lg:w-1/2 m-auto p-5 border"
          onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <div className="form-group w-full py-5">
            <label htmlFor="checkIn" className="w-full">
              Expected checkIn <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="checkIn"
              name="CheckIn"
              className="w-full border outline-none py-2"
              value={bookingData.checkIn}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookingData((prev) => ({ ...prev, checkIn: e.target.value }))
              }
            />
            <small className="w-full"></small>
          </div>

          {bookingAmount > 0 && (
            <>
              <h3 className="pt-5 text-lg font-bold w-full underline">
                Select payment method
              </h3>

              <div className="flex flex-wrap justify-between items-center py-5">
                {/* MTN mobile money */}
                <div
                  className="form-group lg:w-1/2 p-2 flex items-center hover:bg-white hover:border rounded-lg cursor-pointer "
                  onClick={() =>
                    setBookingData((prev) => ({
                      ...prev,
                      paymentType:
                        bookingData.paymentType !== PaymentTypeEnum.onlineMomo
                          ? PaymentTypeEnum.onlineMomo
                          : "",
                    }))
                  }
                >
                  <input
                    type="radio"
                    className=" w-5 h-5"
                    checked={
                      bookingData.paymentType === PaymentTypeEnum.onlineMomo
                    }
                  />
                  <img
                    src="/FILES/IMAGES/payment-method-images/mtn-momo.png"
                    alt=""
                    height={50}
                    width={100}
                  />
                </div>

                {/* Airtel money */}
                <div
                  className="form-group lg:w-1/2  p-2 flex items-center hover:bg-white hover:border rounded-lg cursor-pointer"
                  onClick={() =>
                    setBookingData((prev) => ({
                      ...prev,
                      paymentType:
                        bookingData.paymentType !==
                        PaymentTypeEnum.onlineAirtelMoney
                          ? PaymentTypeEnum.onlineAirtelMoney
                          : "",
                    }))
                  }
                >
                  <input
                    type="radio"
                    className=" w-5 h-5"
                    checked={
                      bookingData.paymentType ===
                      PaymentTypeEnum.onlineAirtelMoney
                    }
                  />
                  <img
                    src="/FILES/IMAGES/payment-method-images/airtel-money.png"
                    alt=""
                    height={50}
                    width={100}
                  />
                </div>

                {/* Visa payment */}
                <div
                  className="form-group lg:w-1/2  p-2 flex items-center hover:bg-white hover:border rounded-lg cursor-pointer"
                  onClick={() =>
                    setBookingData((prev) => ({
                      ...prev,
                      paymentType:
                        bookingData.paymentType !== PaymentTypeEnum.onlineBank
                          ? PaymentTypeEnum.onlineBank
                          : "",
                    }))
                  }
                >
                  <input
                    type="radio"
                    className=" w-5 h-5"
                    checked={
                      bookingData.paymentType === PaymentTypeEnum.onlineBank
                    }
                  />
                  <img
                    src="/FILES/IMAGES/payment-method-images/visa-payment.png"
                    alt=""
                    height={50}
                    width={100}
                  />
                </div>

                {/* paypal payment  */}
                <div
                  className="form-group lg:w-1/2  p-2 flex items-center hover:bg-white hover:border rounded-lg cursor-pointer"
                  onClick={() =>
                    setBookingData((prev) => ({
                      ...prev,
                      paymentType:
                        bookingData.paymentType !== PaymentTypeEnum.onlinePaypal
                          ? PaymentTypeEnum.onlinePaypal
                          : "",
                    }))
                  }
                >
                  <input
                    type="radio"
                    className=" w-5 h-5"
                    checked={
                      bookingData.paymentType === PaymentTypeEnum.onlinePaypal
                    }
                  />
                  <img
                    src="/FILES/IMAGES/payment-method-images/paypal.jpeg"
                    alt=""
                    height={50}
                    width={100}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group w-full py-10 flex items-center justify-center">
            <button
              type="submit"
              className="w-full px-10 py-2 text-2xl bg-blue-500 lg:hover:bg-blue-300 text-white"
              onClick={() => {
                dispatch(
                  setConfirm({
                    status: true,
                    message: `Are you sure you want to book a ${
                      ACCOMMODATION_TYPE_DATA.find(
                        (type) =>
                          type.value === accommodation?.accommodationType
                      )?.label
                    } at ${accommodation?.facility.facilityName}, ${
                      accommodation?.facility.facilityLocation.city
                    } ${
                      accommodation?.facility.facilityLocation.country
                    } using ${
                      PAYMENT_TYPE_DATA.find(
                        (type) => type.value === bookingData.paymentType
                      )?.label
                    } ?`,
                  })
                );

                dispatch(setUserAction({ userAction: submitBooking }));
              }}
            >
              Submit booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BookingForm = React.memo(BookingForm);

export default BookingForm;
