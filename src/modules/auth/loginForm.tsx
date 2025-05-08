import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LoginModel } from "../users/models/loginModel";
import markRequiredFormField from "../../global/validation/markRequiredFormField";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import AlertMessage from "../../other/alertMessage";
import isValidEmail from "../../global/validation/emailValidation";
import isValidTelephone from "../../global/validation/telephoneValidation";
import { postData } from "../../global/api";
import axios from "axios";
import checkRequiredFormFields from "../../global/validation/checkRequiredFormFields";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { SocketMessageModel } from "../../webSockets/SocketMessageModel";
import { UserActivity } from "../../global/enums/userActivity";
import { webSocketService } from "../../webSockets/socketService";

const LoginForm: React.FC = () => {
  // local state variables
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [loginDetails, setLoginDetails] = useState<LoginModel>({
    userName: "",
    userPassword: "",
  });

  const handleTogglePassword = () => setShowPassword(!showPassword);

  // const [ip, setIp] = useState("");

  // useEffect(() => {
  //   const fetchIp = async () => {
  //     const publicIp = await getIp();
  //     if (publicIp) {
  //       setIp(publicIp);
  //     }
  //   };
  //   fetchIp();
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginDetails({ ...loginDetails, [id]: value });
    markRequiredFormField(e.target);
  };

  const dispatch = useDispatch<AppDispatch>();

  // user login function
  const handleLogIn = async () => {
    const userPassword = document.getElementById(
      "userPassword"
    ) as HTMLInputElement;
    const userName = document.getElementById("userName") as HTMLInputElement;

    // check if all the required form fields are filled.
    if (
      loginDetails.userName.trim().length < 1 ||
      loginDetails.userPassword.trim().length < 1
    ) {
      checkRequiredFormFields([userName, userPassword]);
      dispatch(
        setAlert({
          ...alert,
          type: AlertTypeEnum.danger,
          message: "Please fill in all the required form fields marked by (*)",
          status: true,
        })
      );

      return;
    }

    // check if email or phone number is valid
    if (
      !isValidEmail(loginDetails.userName) &&
      !isValidTelephone(loginDetails.userName)
    ) {
      dispatch(
        setAlert({
          ...alert,
          type: AlertTypeEnum.danger,
          message: "Invalid phone number or email.",
          status: true,
        })
      );
      return;
    }

    // submit form if all the conditions are fullfilled
    try {
      setLoading(true);

      const result = await postData("/log-in", loginDetails);

      if (!result) {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            message: "ERROR OCCURRED PLEASE TRY AGAIN!!",
            status: true,
          })
        );

        return;
      }

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            ...alert,
            type: AlertTypeEnum.danger,
            message: result.data.message,
            status: true,
          })
        );
      } else {
        localStorage.setItem("dnap-user", JSON.stringify(result.data));
        window.location.href = "/home";
      }

      const socketMessage: SocketMessageModel = {
        userId: result.data.userId,
        userRole: result.data.userRole,
        content: null,
        activity: UserActivity.login,
      };

      webSocketService.sendMessage("/app/login", socketMessage);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED: ", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="login-for p-2 lg:p-10 relative  flex flex-wrap justify-center items-center bg-blue-950 text-sm"
      action=""
      onSubmit={(e: React.FormEvent) => e.preventDefault()}
    >
      <div className="login-form-inne w-full  lg:w-1/4 relative p-5 lg:p-10 rounded-3xl bg-white  bg-opacity-10 shadow-white shadow-sm">
        <div className="w-full p-3 lg:p-5  flex justify-center">
          <img
            src="images/logo-colored-no-bg.png"
            width={50}
            height={50}
            alt=""
          />
        </div>
        <div className="form-group py-2">
          <label htmlFor="userName" className="w-full text-white">
            Email/Telephone*
          </label>
          <input
            type="text"
            id="userName"
            autoFocus
            autoComplete="false"
            aria-label="User name"
            placeholder="Email or Telephone*"
            className="w-full outline-none rounded-lg py-1"
            value={loginDetails.userName}
            onChange={handleChange}
          />
          <small className="w-full text-red-200">
            Email or telephone is required!
          </small>
        </div>
        <div className="form-group relative py-2">
          <label htmlFor="userPassword" className="w-full text-white">
            Password*
          </label>
          <input
            type={`${showPassword ? "text" : "password"}`}
            id="userPassword"
            autoComplete="false"
            aria-label="Password"
            placeholder="Password*"
            className="w-full outline-none rounded-lg py-1"
            value={loginDetails.userPassword}
            onChange={handleChange}
          />
          <small className="w-full text-red-200 text-sm">
            Password is required!
          </small>
          <div
            className="absolute right-0 top-1/3 text-blue-800 text-lg  px-2  mr-2 cursor-pointer"
            onClick={handleTogglePassword}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>
        <div className="forgot-password text-blue-200 text-sm py-5">
          <Link to="/reset-password">Forgot password?</Link>
        </div>
        <div className="form-group flex flex-wrap justify-center py-10  text-gold">
          <button
            className="w-full bg-blue-600 p-3 text-lg text-white hover:bg-blue-400 active:scale-95"
            disabled={loading}
            onClick={handleLogIn}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          <p className="w-full pt-5 text-blue-300">
            Have no account?{" "}
            <Link to="/sign-up" className="text-lg text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <AlertMessage />
    </form>
  );
};

export default LoginForm;
