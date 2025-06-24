import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import { postData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { GenderEnum } from "../../global/enums/genderEnum";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import checkRequiredFormFields from "../../global/validation/checkRequiredFormFields";
import isValidEmail from "../../global/validation/emailValidation";
import markRequiredFormField from "../../global/validation/markRequiredFormField";
import isValidTelephone from "../../global/validation/telephoneValidation";
import AlertMessage from "../../other/alertMessage";
import { setAlert } from "../../other/alertSlice";
import { UserModel } from "../users/models/userModel";
import PhoneInput from "react-phone-input-2";
import TenantDetailsForm from "./TenantDetailsForm";
import { TenantCreationModel } from "./TenantModel";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [GenderValues] = useState([
    GenderEnum.male,
    GenderEnum.female,
    GenderEnum.others,
  ]);

  const [user, setUser] = useState<UserModel>({
    firstName: "",
    lastName: "",
    otherNames: "",
    gender: "",
    userRole: UserRoleEnum.tenant,
    userTelephone: "",
    userEmail: "",
    userPassword: "",
    addedBy: { userId: null },
    linkedTo: { userId: null },
  });

  const [tenant, setTenant] = useState<TenantCreationModel>({
    user: {
      userId: 0,
    },

    companyName: "",

    idType: "",
    nationalId: "",

    nextOfKin: {
      nokName: "",
      nokEmail: "",
      nokTelephone: "",
      nokNationalId: "",
      nokIdType: "",
      addressType: "",
      address: {
        country: "",
        state: "",
        city: "",
        county: "",
        division: "",
        parish: "",
        zone: "",
        street: "",
        plotNumber: "",
      },
    },
  });

  const [isShowTenantDetailsForm, setIsShowTenantDetailsForm] =
    useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const isValidGenderValue =
    user.gender === GenderEnum.female ||
    user.gender === GenderEnum.male ||
    user.gender === GenderEnum.others;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
    markRequiredFormField(e.target);
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const signUp = async () => {
    const firstName = document.getElementById("firstName") as HTMLInputElement;
    const lastName = document.getElementById("lastName") as HTMLInputElement;
    const email = document.getElementById("userEmail") as HTMLInputElement;
    const telephone = document.getElementById(
      "userTelephone"
    ) as HTMLInputElement;
    const gender = document.getElementById("gender") as HTMLInputElement;
    const password = document.getElementById(
      "userPassword"
    ) as HTMLInputElement;

    // check if all the required form fields are filled
    if (
      (user.firstName && user.firstName.trim().length < 1) ||
      (user.lastName && user.lastName.trim().length < 1) ||
      (user.userEmail && user.userEmail.trim().length < 1) ||
      (user.userTelephone && user.userTelephone.trim().length < 1) ||
      (user.gender && user.gender.trim().length < 1) ||
      (user.userPassword && user.userPassword.trim().length < 1)
    ) {
      checkRequiredFormFields([
        firstName,
        lastName,
        email,
        telephone,
        gender,
        password,
      ]);

      dispatch(
        setAlert({
          message: "Please fill in all the required form fields marked by (*)",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );

      return;
    }

    // check if the gender value is valid (male, female, others)
    if (!isValidGenderValue) {
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid gender value.",
          status: true,
        })
      );
      return;
    }

    // check if the email is valid
    if (!isValidEmail(String(user.userEmail))) {
      const parent: HTMLElement | null = email.parentElement;

      if (parent) {
        const small = parent.querySelector("small");
        parent.classList.add("required");
        small?.classList.add("visible");
      }

      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid email.",
          status: true,
        })
      );
      return;
    }

    // check if the telephone number is valid
    if (!isValidTelephone(String(user.userTelephone))) {
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid telephone number.",
          status: true,
        })
      );
      return;
    }

    // submit sign-up form if all conditions are fullfilled
    try {
      setLoading(true);
      const result = await postData("/sign-up", user);

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            type:
              result.data.status !== "OK"
                ? AlertTypeEnum.danger
                : AlertTypeEnum.success,
            message: result.data.message,
            status: true,
          })
        );
        return;
      }

      localStorage.setItem(
        "dnap-user",
        JSON.stringify({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          userId: result.data.userId,
          userRole: result.data.userRole,
        })
      );

      setTenant((prev) => ({
        ...prev,
        user: { userId: Number(result.data.userId) },
      }));

      setIsShowTenantDetailsForm(true);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED: ", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // conditional rendering for show landlord form if isShowLandlordForm is true
  if (isShowTenantDetailsForm)
    return (
      <TenantDetailsForm
        tenant={tenant}
        setTenant={setTenant}
        setIsShowTenantDetailsForm={setIsShowTenantDetailsForm}
      />
    );

  return (
    <form
      className="signup-form w-full h-full p-2 :lg:p-10 relative flex flex-wrap justify-center items-center"
      onSubmit={(e: React.FormEvent) => e.preventDefault()}
    >
      <div className="login-form-inner w-full lg:w-1/2 relative p-5 lg:p-10 rounded-md flex flex-wrap">
        {/* Header logo */}
        <div className="w-full p-3 lg:p-10 bg-red-950 flex justify-center">
          <img
            src="images/logo-no-background.png"
            width={130}
            height={130}
            alt=""
          />
        </div>

        {/* First name input field */}
        <div className="form-group py-2 w-full lg:w-1/2 px-5">
          <label htmlFor="firstName" className="w-full text-white">
            First name*
          </label>
          <input
            type="text"
            id="firstName"
            autoComplete="off"
            autoFocus
            placeholder="First name*"
            className="w-full outline-none rounded-lg border-2"
            value={user.firstName || ""}
            onChange={handleChange}
          />
          <small className="w-full text-red-200">First name is required.</small>
        </div>

        {/* Last name input field */}
        <div className="form-group py-2 w-full lg:w-1/2 px-5">
          <label htmlFor="lastName" className="w-full text-white">
            Last name*
          </label>
          <input
            type="text"
            id="lastName"
            autoComplete="off"
            placeholder="Last name*"
            className="w-full outline-none rounded-lg"
            value={user.lastName || ""}
            onChange={handleChange}
          />
          <small className="w-full text-red-200">Last name is required.</small>
        </div>

        {/* Other names form field */}
        <div className="form-group py-2 w-full px-5">
          <label htmlFor="otherNames" className="w-full text-white">
            Other names
          </label>
          <input
            type="text"
            id="otherNames"
            autoComplete="off"
            placeholder="Other names"
            className="w-full outline-none rounded-lg"
            value={user.otherNames || ""}
            onChange={handleChange}
          />
        </div>

        {/* Email input field */}
        <div className="form-group py-2 w-full lg:w-1/2 px-5">
          <label htmlFor="userEmail" className="w-full text-white">
            Email*
          </label>
          <input
            type="text"
            id="userEmail"
            autoComplete="off"
            placeholder="Email*"
            className="w-full outline-none rounded-lg"
            value={user.userEmail || ""}
            onChange={handleChange}
          />
          <small className="w-full text-red-200">Email is required.</small>
        </div>

        {/* Telephone input field */}
        <div className="form-group py-2 w-full lg:w-1/2 px-5">
          <label htmlFor="userTelephone" className="w-full text-white">
            Telephone*
          </label>

          <PhoneInput
            country={"us"}
            value={user.userTelephone}
            placeholder="Enter telephone 1"
            onChange={(phone) => {
              setUser({
                ...user,
                userTelephone: phone ? "+" + phone : null,
              });
            }}
            inputStyle={{
              width: "100%",
              padding: "10px 50px",
              fontSize: "16px",
              borderRadius: "4px",
            }}
            containerStyle={{
              width: "100%",
              display: "flex",
              alignItems: "center", // To keep the phone number and country code in the same line
            }}
          />

          <small className="w-full text-red-200">
            Telephone number is required
          </small>
        </div>

        {/* Gender form field */}
        <div className="form-group py-2 w-full lg:w-1/2 px-5">
          <label htmlFor="gender" className="w-full text-white">
            Gender*
          </label>
          <input
            type="text"
            id="gender"
            list="genderList"
            autoComplete="off"
            placeholder="Gender*"
            className="w-full outline-none rounded-lg"
            value={user.gender || ""}
            onChange={handleChange}
          />
          <datalist id="genderList">
            {GenderValues.map((gender, index) => (
              <option key={index} value={gender} />
            ))}
          </datalist>
          <small className="w-full text-red-200">Gender is required.</small>
        </div>

        {/* Password input field */}
        <div className="form-group relative py-0 lg:py-2 w-full lg:w-1/2 pl-5">
          <label htmlFor="userPassword" className="w-full text-white">
            Password*
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="userPassword"
            autoComplete="off"
            placeholder="Password*"
            className="w-full outline-none rounded-lg"
            value={user.userPassword || ""}
            onChange={handleChange}
          />
          <small className="w-full text-red-200">Password is required.</small>
          <div
            className="absolute right-0 top-1/2 text-blue-800 text-lg px-2 mr-2 cursor-pointer"
            onClick={handleTogglePassword}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

        {/* action buttons */}
        <div className="form-group w-full flex flex-wrap justify-center py-10 text-gold">
          <button
            className="w-full bg-red-950 p-3 text-lg text-white hover:bg-red-800 active:translate-x-2"
            onClick={signUp}
            disabled={loading}
          >
            {loading ? "Saving..." : "Next"}
          </button>
          <p className="w-full pt-5 text-blue-300">
            Have an account already?{" "}
            <Link to="/" className="text-xl text-blue-500">
              Log In
            </Link>
          </p>
        </div>
      </div>
      <AlertMessage />
    </form>
  );
};

export default SignUpForm;
