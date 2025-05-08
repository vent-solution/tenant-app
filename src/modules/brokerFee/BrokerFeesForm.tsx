import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
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
import { BrokerFeeCreationModel } from "./BrokerFeeModel";
import { getSettings } from "../settings/SettingsSlice";
import { addNewBrokerFees } from "./BrokerFeesSlice";

interface Props {
  setShowBrokerFeesForm: React.Dispatch<React.SetStateAction<boolean>>;
}

let BrokerFeesForm: React.FC<Props> = ({ setShowBrokerFeesForm }) => {
  const [brokerFeesData, setBrokerFeesData] = useState<BrokerFeeCreationModel>({
    amount: null,
    currency: null,
    tenant: { tenantId: null },
    paymentType: null,
  });

  const dispatch = useDispatch<AppDispatch>();

  const adminFinancialSettings = useSelector(getSettings);

  // SETTING THE DEFAULT BROKER FEE DETAILS
  useEffect(() => {
    if (adminFinancialSettings.settings[0]) {
      setBrokerFeesData((prev) => ({
        ...prev,
        amount: Number(adminFinancialSettings.settings[0].brokerFee),
        currency: adminFinancialSettings.settings[0].preferedCurrency,
      }));
    }
  }, [adminFinancialSettings.settings]);

  // submit the broker fees payment
  const submitBrokerFees = async () => {
    const currentUSer: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    // check if amount is provided
    if (!brokerFeesData.amount) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Invalid broker fees amount",
        })
      );

      return;
    }

    // check if the provided amount is less than the preferred amount
    if (
      Number(brokerFeesData.amount) <
      Number(adminFinancialSettings.settings[0].brokerFee)
    ) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: `The minimum amount allowed is ${FormatMoney(
            Number(adminFinancialSettings.settings[0].brokerFee),
            2,
            String(adminFinancialSettings.settings[0].preferedCurrency)
          )}`,
        })
      );

      return;
    }

    // check if payment method is selected
    if (!brokerFeesData.paymentType) {
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
        `/pay-broker-fees-by-tenant/${Number(currentUSer.userId)}`,
        brokerFeesData
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

      dispatch(addNewBrokerFees(result.data));

      dispatch(
        setAlert({
          type: AlertTypeEnum.success,
          status: true,
          message: "Broker fees was paid successfully.",
        })
      );

      setShowBrokerFeesForm(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("BROKER FEE PAYMENT CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ status: false, message: "" }));
    }
  };

  return (
    <div className="w-full mt-24 lg:mt-0 h-100vh bg-gray-100">
      <div className="p-5 bg-white flex justify-end w-full shadow-lg">
        <h1 className="text-2xl w-5/6 text-center text-gray-700">
          Pay broker fees
        </h1>
        <h1
          className="text-2xl text-bold p-2 lg:hover:bg-red-500 lg:hover:text-white cursor-pointer"
          onClick={() => setShowBrokerFeesForm(false)}
        >
          <RxCross1 />
        </h1>
      </div>

      <div className="py-10 flex flex-wrap justify-center w-full">
        <h2 className="text-xl text-green-600 w-full text-center">
          {FormatMoney(
            Number(adminFinancialSettings.settings[0].brokerFee),
            2,
            String(adminFinancialSettings.settings[0].preferedCurrency)
          )}
        </h2>

        <form
          className="w-full lg:w-1/3 m-auto p-5 border"
          onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <div className="form-group w-full py-5">
            <label htmlFor="amount" className="w-full text-sm">
              Amount{" "}
              <span className="text-red-600">
                ({adminFinancialSettings.settings[0].preferedCurrency})*
              </span>
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              className="w-full"
              placeholder={String(adminFinancialSettings.settings[0].brokerFee)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBrokerFeesData((prev) => ({
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
                setBrokerFeesData((prev) => ({
                  ...prev,
                  paymentType:
                    brokerFeesData.paymentType !== PaymentTypeEnum.onlineMomo
                      ? PaymentTypeEnum.onlineMomo
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={
                  brokerFeesData.paymentType === PaymentTypeEnum.onlineMomo
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
                setBrokerFeesData((prev) => ({
                  ...prev,
                  paymentType:
                    brokerFeesData.paymentType !==
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
                  brokerFeesData.paymentType ===
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
                setBrokerFeesData((prev) => ({
                  ...prev,
                  paymentType:
                    brokerFeesData.paymentType !== PaymentTypeEnum.onlineBank
                      ? PaymentTypeEnum.onlineBank
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={
                  brokerFeesData.paymentType === PaymentTypeEnum.onlineBank
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
                setBrokerFeesData((prev) => ({
                  ...prev,
                  paymentType:
                    brokerFeesData.paymentType !== PaymentTypeEnum.onlinePaypal
                      ? PaymentTypeEnum.onlinePaypal
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={
                  brokerFeesData.paymentType === PaymentTypeEnum.onlinePaypal
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

          <div className="form-group w-full py-10 flex items-center justify-center">
            <button
              type="submit"
              className="w-full px-10 py-2 text-2xl bg-blue-500 lg:hover:bg-blue-300 text-white"
              onClick={() => {
                dispatch(
                  setConfirm({
                    status: true,
                    message: `Are you sure you want to pay broker fees ${FormatMoney(
                      Number(adminFinancialSettings.settings[0].brokerFee),
                      2,
                      String(
                        adminFinancialSettings.settings[0].preferedCurrency
                      )
                    )} ?`,
                  })
                );

                dispatch(setUserAction({ userAction: submitBrokerFees }));
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

BrokerFeesForm = React.memo(BrokerFeesForm);

export default BrokerFeesForm;
