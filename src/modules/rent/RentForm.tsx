import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import {
  ACCOMMODATION_CATEGORY,
  ACCOMMODATION_TYPE_DATA,
} from "../../global/PreDefinedData/PreDefinedData";
import { FormatMoney } from "../../global/actions/formatMoney";
import { UserModel } from "../users/models/userModel";
import { PaymentTypeEnum } from "../../global/enums/paymentTypeEnum";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import axios from "axios";
import { postData } from "../../global/api";
import { setConfirm } from "../../other/ConfirmSlice";
import { setUserAction } from "../../global/actions/actionSlice";
import { getAccommodationById } from "../accommodations/tenantAccommodationsSlice";
import { CreationRentModel } from "./RentModel";
import { useNavigate } from "react-router-dom";
import { addNewRentRecord } from "../accommodations/AccommodationRentSlice";

interface Props {
  accommodationId?: number;
  setIsShowRentForm: React.Dispatch<React.SetStateAction<boolean>>;
}

let RentForm: React.FC<Props> = ({ accommodationId, setIsShowRentForm }) => {
  const [rentData, setRentData] = useState<CreationRentModel>({
    amount: null,
    currency: null,
    paymentType: null,
    transactionDate: null,
    facility: { facilityId: null },
    accommodation: {
      accommodationId: null,
      accommodationNumber: null,
    },
  });

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const accommodationState = useSelector(
    getAccommodationById(Number(accommodationId))
  );

  const accommodation = accommodationState?.accommodation;

  // SET THE DEFAULT BOOKING DATA
  useEffect(() => {
    if (accommodation) {
      setRentData((prev) => ({
        ...prev,
        amount: Number(accommodation.price),
        currency: accommodation.facility.preferedCurrency,
        paymentType: "",
        transactionDate: String(new Date().toISOString()),
        facility: { facilityId: accommodation.facility.facilityId },
        accommodation: {
          accommodationId: Number(accommodation.accommodationId),
          accommodationNumber: accommodation.accommodationNumber,
          accommodationType: String(accommodation.accommodationType),
        },
      }));
    }
  }, [accommodation]);

  // submit the accommodation rent payment
  const submitRentPayment = async () => {
    const currentUSer: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    // check if checkIn rent amount is valid
    if (
      String(rentData.amount).trim().length < 1 ||
      Number(rentData.amount) < 1
    ) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Invalid rent amount.",
        })
      );

      return;
    }

    // check if payment method is selected
    if (String(rentData.paymentType).trim().length < 1) {
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

    try {
      const result = await postData(
        `/pay-rent-by-tenant/${Number(currentUSer.userId)}`,
        rentData
      );

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

      dispatch(addNewRentRecord(result.data));

      dispatch(
        setAlert({
          type: AlertTypeEnum.success,
          status: true,
          message: "Payment has been submitted successfully.",
        })
      );

      setIsShowRentForm(false);
      navigate("/receipts");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("BOOKING CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ status: false, message: "" }));
    }
  };

  return (
    <div className="w-full mt-24 lg:mt-0 h-100vh bg-gray-100">
      <div className="p-5 bg-white flex justify-end w-full shadow-lg">
        <h1 className="text-2xl w-5/6 text-center text-gray-700">
          Add a new payment for{" "}
          {
            ACCOMMODATION_TYPE_DATA.find(
              (type) => type.value === accommodation?.accommodationType
            )?.label
          }{" "}
        </h1>
        <h1
          className="text-2xl text-bold p-2 lg:hover:bg-red-500 lg:hover:text-white cursor-pointer"
          onClick={() => setIsShowRentForm(false)}
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
          ({accommodation?.accommodationNumber})
          {accommodation?.accommodationCategory &&
            "(" +
              ACCOMMODATION_CATEGORY.find(
                (category) =>
                  category.value === accommodation?.accommodationCategory
              )?.label +
              ")"}
          {accommodation?.accommodationType.includes("Space") &&
            "(" + accommodation.capacity + " Seats)"}
        </h2>

        <h2 className="text-xl text-green-600 w-full text-center">
          {FormatMoney(
            Number(accommodation?.price),
            2,
            String(accommodation?.facility.preferedCurrency)
          )}
        </h2>

        <form
          className="w-full lg:w-1/3 m-auto p-5 border"
          onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <div className="form-group w-full py-5">
            <label htmlFor="rentAmount" className="w-full text-sm">
              Rent Amount{" "}
              <span className="uppercase">
                ({accommodation?.facility.preferedCurrency})
              </span>{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="rentAmount"
              name="rentAmount"
              className="w-full"
              value={Number(rentData.amount)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRentData((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
            />
            <small className="w-full"></small>
          </div>

          <h3 className="pt-5 text-lg font-bold w-full underline">
            Select payment method
          </h3>

          <div className="flex flex-wrap justify-between items-center py-5">
            {/* MTN mobile money */}
            <div
              className="form-group lg:w-1/2 p-2 flex items-center hover:bg-white hover:border rounded-lg cursor-pointer "
              onClick={() =>
                setRentData((prev) => ({
                  ...prev,
                  paymentType:
                    rentData.paymentType !== PaymentTypeEnum.onlineMomo
                      ? PaymentTypeEnum.onlineMomo
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={rentData.paymentType === PaymentTypeEnum.onlineMomo}
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
                setRentData((prev) => ({
                  ...prev,
                  paymentType:
                    rentData.paymentType !== PaymentTypeEnum.onlineAirtelMoney
                      ? PaymentTypeEnum.onlineAirtelMoney
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={
                  rentData.paymentType === PaymentTypeEnum.onlineAirtelMoney
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
                setRentData((prev) => ({
                  ...prev,
                  paymentType:
                    rentData.paymentType !== PaymentTypeEnum.onlineBank
                      ? PaymentTypeEnum.onlineBank
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={rentData.paymentType === PaymentTypeEnum.onlineBank}
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
                setRentData((prev) => ({
                  ...prev,
                  paymentType:
                    rentData.paymentType !== PaymentTypeEnum.onlinePaypal
                      ? PaymentTypeEnum.onlinePaypal
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={rentData.paymentType === PaymentTypeEnum.onlinePaypal}
              />
              <img
                src="/FILES/IMAGES/payment-method-images/paypal.jpeg"
                alt=""
                height={50}
                width={100}
              />
            </div>
          </div>

          <div className="form-group w-full py-10 flex items-center justify-center">
            <button
              type="submit"
              className="w-full px-10 py-2 text-2xl bg-blue-500 lg:hover:bg-blue-300 text-white"
              onClick={() => {
                dispatch(
                  setConfirm({
                    status: true,
                    message: `Are you sure you want to rent amounting to ${FormatMoney(
                      Number(rentData.amount),
                      2,
                      String(accommodation?.facility.preferedCurrency)
                    )}
                    ?`,
                  })
                );

                dispatch(setUserAction({ userAction: submitRentPayment }));
              }}
            >
              Submit payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

RentForm = React.memo(RentForm);

export default RentForm;
