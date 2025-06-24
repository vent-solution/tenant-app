import React from "react";
import axios from "axios";
import { postData } from "../../global/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { NATIONAL_ID_TYPE } from "../../global/PreDefinedData/PreDefinedData";
import AlertMessage from "../../other/alertMessage";

import checkRequiredFormFields from "../../global/validation/checkRequiredFormFields";
import { useNavigate } from "react-router-dom";
import { TenantCreationModel } from "./TenantModel";

interface Props {
  tenant: TenantCreationModel;
  setTenant: React.Dispatch<React.SetStateAction<TenantCreationModel>>;
  setIsShowTenantDetailsForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const TenantDetailsForm: React.FC<Props> = ({ tenant, setTenant }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // check if can save tenant details
  const canSaveTenant = String(tenant.idType).trim().length > 0;

  // handle change text field values
  const handleChangeTextFieldValues = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setTenant((prev) => ({ ...prev, [id]: value }));
  };

  // save tenant details
  const handleSaveTenantDetails = async () => {
    const idType = document.getElementById("idType") as HTMLInputElement;
    const NOKIdType = document.getElementById("nokIdType") as HTMLInputElement;
    const nationalId = document.getElementById(
      "nationalId"
    ) as HTMLInputElement;
    const NOKNationalId = document.getElementById(
      "nokNationalId"
    ) as HTMLInputElement;
    const addressType = document.getElementById(
      "addressType"
    ) as HTMLInputElement;
    const country = document.getElementById("country") as HTMLInputElement;
    const city = document.getElementById("city") as HTMLInputElement;

    const NOKtelephone = document.getElementById(
      "userTelephone"
    ) as HTMLInputElement;

    const nokName = document.getElementById("fullName") as HTMLInputElement;

    // check if all the required form fields are filled
    if (
      !tenant.idType ||
      tenant.idType.trim().length < 1 ||
      !tenant.nationalId ||
      tenant.nationalId.trim().length < 1 ||
      // !tenant.nextOfKin?.addressType ||
      // tenant.nextOfKin.addressType.trim().length < 1 ||
      // !tenant.nextOfKin.address?.country ||
      // tenant.nextOfKin.address?.country.trim().length < 1 ||
      // !tenant.nextOfKin.address?.city ||
      // tenant.nextOfKin.address?.city.trim().length < 1 ||
      !tenant.nextOfKin?.nokTelephone ||
      tenant.nextOfKin.nokTelephone.trim().length < 1 ||
      !tenant.nextOfKin?.nokName ||
      tenant.nextOfKin.nokName.trim().length < 1
    ) {
      checkRequiredFormFields([
        idType,
        nationalId,
        // addressType,
        // country,
        // city,
        NOKtelephone,
        // NOKIdType,
        // NOKNationalId,
        nokName,
      ]);
    }
    // check if all the required fiels are filled
    if (!canSaveTenant) {
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: "Please fill in all the required fields marked by (*)",
        })
      );
      return;
    }

    try {
      const result = await postData("/addNewTenant", tenant);

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: result.data.message,
          })
        );

        return;
      }

      navigate("/home");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE USER CANCELLED: ");
      }
    }
  };

  return (
    <form
      className="login-for relative  flex flex-wrap justify-center items-start bg-blue-950 text-sm min-h-svh py-10 px-3 lg:px-24"
      action=""
      onSubmit={(e: React.FormEvent) => e.preventDefault()}
    >
      <div className=" text-white w-full lg:w-1/3 p-5  flex flex-wrap justify-center items-center lg:h-svh lg:sticky top-0 lg:py-32">
        <div className="w-full flex justify-start items-end">
          <img
            className="w-14 lg:w-20 h-14 lg:h-20"
            src="/tenant/images/logo-no-background.png"
            alt=""
          />
          <h1 className="text-3xl lg:text-5xl font-extrabold">ENT</h1>
        </div>
        <div className="text-gray-400 h-3/4 flex flex-wrap items-center justify-center w-full text-start py-20 text-xl lg:text-3xl">
          <div className="h-fit capitalize font-extralight">
            <p className="w-full">welcome to vent.</p>
            <p className="w-full">
              the World's number one real-estate solution.
            </p>
          </div>
        </div>
        <h1 className="text-xs w-full text-start">&copy; vent solutions</h1>
      </div>

      <div className="flex flex-wrap justify-between w-full lg:w-2/3 text-white px-10">
        <h1 className="text-3xl font-bold w-full">
          Complete your tenant details
        </h1>

        {/* company name form input field */}
        <div className="form-group w-full py-5 px-2  shadow-lg">
          <label htmlFor="companyName" className="w-full font-bold">
            Company name <span className="text-red-600">(optional)</span>
          </label>
          <input
            type="text"
            id="companyName"
            placeholder="Enter company name"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={handleChangeTextFieldValues}
          />
          <small className="w-full"></small>
        </div>

        {/* national ID number form input field */}
        <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="nationalId" className="w-full font-bold">
            ID number <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="nationalId"
            placeholder="Enter national ID number"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={handleChangeTextFieldValues}
          />
          <small className="w-full text-red-200">ID number is required!</small>
        </div>

        {/* national ID type form input field */}
        <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="idType" className="w-full font-bold">
            ID type <span className="text-red-600">*</span>
          </label>
          <select
            id="idType"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-3"
            onChange={handleChangeTextFieldValues}
          >
            <option value={""}>SELECT ID TYPE</option>
            {NATIONAL_ID_TYPE.map((type, index) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <small className="w-full text-red-200">ID type is required!</small>
        </div>

        {/*next of kin details */}
        <h1 className="w-full text-xl font-bold pt-10">Next of Kin</h1>

        {/* next of kin full name form input field */}
        <div className="form-group w-full py-5 px-2  shadow-lg">
          <label htmlFor="fullName" className="w-full font-bold">
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter next of kin full name"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, nokName: e.target.value },
              }))
            }
          />
          <small className="w-full text-red-200">Name is required!</small>
        </div>

        {/* next of kin email form input field */}
        <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="nokEmail" className="w-full font-bold">
            Email <span className="text-red-600">(optional)</span>
          </label>
          <input
            type="text"
            id="nokEmail"
            placeholder="Enter next of kin email"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, nokEmail: e.target.value },
              }))
            }
          />
          <small className="w-full"></small>
        </div>

        {/* next of kin telephone form input field */}
        <div className="form-group py-2 w-full lg:w-1/2 px-5">
          <label htmlFor="userTelephone" className="w-full text-white">
            Telephone <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            id="userTelephone"
            autoComplete="off"
            placeholder="Telephone* Eg. +23578348990"
            className="w-full outline-none rounded-lg bg-gray-100 py-2"
            value={tenant.nextOfKin?.nokTelephone || ""}
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, nokTelephone: e.target.value },
              }))
            }
          />

          <small className="w-full text-red-200">
            Telephone number is required!
          </small>
        </div>

        {/* next of kin ID form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="nokNationalId" className="w-full font-bold">
            ID number <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="nokNationalId"
            placeholder="Enter next of kin national ID"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, nokNationalId: e.target.value },
              }))
            }
          />
          <small className="w-full text-red-200">
            Next of kin's ID number is required!
          </small>
        </div> */}

        {/* next of kin national ID type form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="nokIdType" className="w-full font-bold">
            ID type
            <span className="text-red-600">*</span>
          </label>
          <select
            id="nokIdType"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-3"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, nokIdType: e.target.value },
              }))
            }
          >
            <option value="">SELECT ID TYPE</option>

            {NATIONAL_ID_TYPE.map((type) => (
              <option value={type.value}>{type.label}</option>
            ))}
          </select>
          <small className="w-full text-red-200">
            Next of kin's ID type is required!
          </small>
        </div> */}

        {/* tenant's next of kin address */}
        {/* <h1 className="text-lg font-bold pt-5 w-full">Next of kin address</h1> */}

        {/* next of kin address type form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="addressType" className="w-full font-bold">
            Address type <span className="text-red-600">*</span>
          </label>
          <select
            id="addressType"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-3"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: { ...prev.nextOfKin, addressType: e.target.value },
              }))
            }
          >
            <option value="">SELECT ADDRESS TYPE</option>

            {ADDRESS_TYPE.map((type) => (
              <option value={type.value}>{type.label}</option>
            ))}
          </select>
          <small className="w-full text-red-200">
            Next of kin's address type is required!
          </small>
        </div> */}

        {/* next of kin country form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="country" className="w-full font-bold">
            Country <span className="text-red-600">*</span>
          </label>

          <select
            name="country"
            id="country"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-3"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: {
                  ...prev.nextOfKin,
                  address: {
                    ...prev.nextOfKin?.address,
                    country: e.target.value,
                  },
                },
              }))
            }
          >
            <option value="">SELECT COUNTRY</option>
            {countryList.map((country) => (
              <option value={country.value}>{country.label}</option>
            ))}
          </select>
          <small className="w-full text-red-200">Country is required!</small>
        </div> */}

        {/* next of kin state form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="state" className="w-full font-bold">
            State <span className="text-red-600"></span>
          </label>
          <input
            type="text"
            id="state"
            placeholder="Enter next of kin state"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: {
                  ...prev.nextOfKin,
                  address: {
                    ...prev.nextOfKin?.address,
                    state: e.target.value,
                  },
                },
              }))
            }
          />
          <small className="w-full"></small>
        </div> */}

        {/* next of kin city form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="city" className="w-full font-bold">
            City/Municipality/District <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="city"
            placeholder="Enter next of kin city"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: {
                  ...prev.nextOfKin,
                  address: {
                    ...prev.nextOfKin?.address,
                    city: e.target.value,
                  },
                },
              }))
            }
          />
          <small className="w-full text-red-200">
            City/Municipality/District is required!
          </small>
        </div> */}

        {/* next of kin county form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="county" className="w-full font-bold">
            County <span className="text-red-600"></span>
          </label>
          <input
            type="text"
            id="county"
            placeholder="Enter next of kin county"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: {
                  ...prev.nextOfKin,
                  address: {
                    ...prev.nextOfKin?.address,
                    county: e.target.value,
                  },
                },
              }))
            }
          />
          <small className="w-full"></small>
        </div> */}

        {/* next of kin division form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="division" className="w-full font-bold">
            Division / Sub county <span className="text-red-600"></span>
          </label>
          <input
            type="text"
            id="division"
            placeholder="Enter next of kin division"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: {
                  ...prev.nextOfKin,
                  address: {
                    ...prev.nextOfKin?.address,
                    division: e.target.value,
                  },
                },
              }))
            }
          />
          <small className="w-full"></small>
        </div> */}

        {/* next of kin parish form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="parish" className="w-full font-bold">
            Parish / Ward <span className="text-red-600"></span>
          </label>
          <input
            type="text"
            id="parish"
            placeholder="Enter next of kin parish"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: {
                  ...prev.nextOfKin,
                  address: {
                    ...prev.nextOfKin?.address,
                    parish: e.target.value,
                  },
                },
              }))
            }
          />
          <small className="w-full"></small>
        </div> */}

        {/* next of kin zone form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="zone" className="w-full font-bold">
            Zone / Village / LC1 <span className="text-red-600"></span>
          </label>
          <input
            type="text"
            id="zone"
            placeholder="Enter next of kin zone"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: {
                  ...prev.nextOfKin,
                  address: {
                    ...prev.nextOfKin?.address,
                    zone: e.target.value,
                  },
                },
              }))
            }
          />
          <small className="w-full"></small>
        </div> */}

        {/* next of kin street form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="street" className="w-full font-bold">
            Street <span className="text-red-600"></span>
          </label>
          <input
            type="text"
            id="street"
            placeholder="Enter next of kin street"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: {
                  ...prev.nextOfKin,
                  address: {
                    ...prev.nextOfKin?.address,
                    street: e.target.value,
                  },
                },
              }))
            }
          />
          <small className="w-full"></small>
        </div> */}

        {/* next of kin plotNumber form input field */}
        {/* <div className="form-group w-full lg:w-1/2 py-5 px-2  shadow-lg">
          <label htmlFor="plotNumber" className="w-full font-bold">
            Plot Number <span className="text-red-600"></span>
          </label>
          <input
            type="text"
            id="plotNumber"
            placeholder="Enter next of kin plotNumber"
            className="w-full outline-none border border-gray-400 rounded-lg focus:border-blue-400 py-2"
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                nextOfKin: {
                  ...prev.nextOfKin,
                  address: {
                    ...prev.nextOfKin?.address,
                    plotNumber: e.target.value,
                  },
                },
              }))
            }
          />
          <small className="w-full"></small>
        </div> */}

        {/* button for saving tenant */}
        <div className="form-group w-full py-5 flex justify-center items-center">
          <input
            type="submit"
            id="save-tenant"
            className="py-1 px-10 outline-none bg-blue-700 lg:hover:bg-blue-400 text-2xl text-white cursor-pointer"
            onClick={handleSaveTenantDetails}
          />
        </div>
      </div>
      <AlertMessage />
    </form>
  );
};

export default TenantDetailsForm;
