import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { LoginModel } from "../users/models/loginModel";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import AlertMessage from "../../other/alertMessage";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import axios from "axios";
import { postData } from "../../global/api";

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [user, setUser] = useState<LoginModel>({
    userName: "",
    userPassword: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  // check if all required fields are filled before saving
  const canSave =
    user.userName.trim().length > 0 && user.userPassword.trim().length > 0;

  // toggle show and hide password
  const hindeAndShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // handle change form event
  const handleChangeFormFieldEvent = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  // get password reset token
  const saveNewPassword = async () => {
    if (!canSave) {
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: "Please fill in all the required fields!",
        })
      );
    }
    try {
      // fetch the password reset token

      const result = await postData("/reset-password", {
        email: user.userName,
      });

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: result.data.message,
          })
        );
        return;
      } else {
        // save the new password after receiving the password reset token

        const token = result.data; // Extract the token
        if (!token) {
          console.log("Invalid token received from server.");
          return;
        }

        // Save the new password
        const result2 = await postData(
          `/save-password?token=${encodeURIComponent(token)}`,
          {
            newPassword: user.userPassword,
          }
        );
        // const result2 = await postData(`/save-password?token=${result.data}`, {
        //   newPassword: user.userPassword,
        // });

        if (result2.data.status && result2.data.status !== "OK") {
          dispatch(
            setAlert({
              status: true,
              type: AlertTypeEnum.danger,
              message: result2.data.message,
            })
          );
          return;
        } else {
          dispatch(
            setAlert({
              status: true,
              type: AlertTypeEnum.success,
              message: result2.data.message,
            })
          );

          navigate("/");
        }
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("GET PASSWORD RESET TOKEN CANCELLED: ", error.message);
      }
    }
  };

  return (
    <form
      className="login-form w-full h-full p-2 lg:p-10  relative  flex flex-wrap justify-center items-center"
      action=""
      onSubmit={(e: React.FormEvent) => e.preventDefault()}
    >
      <div className="login-form-inner w-full  lg:w-1/4 relative p-5 lg:p-10 rounded-md ">
        <div className="w-full p-3 lg:p-10 bg-red-950 flex justify-center">
          <img
            src="images/logo-no-background.png"
            width={130}
            height={130}
            alt=""
          />
        </div>

        {/* email or telephone form field */}
        <div className="form-group py-2">
          <label htmlFor="userName" className="w-full text-white">
            Email/Telephone*
          </label>
          <input
            type="text"
            id="userName"
            autoFocus
            autoComplete="false"
            value={user.userName}
            placeholder="Enter email or Telephone*"
            className="w-full outline-none rounded-lg"
            onChange={handleChangeFormFieldEvent}
          />
          <small className="w-full"></small>
        </div>

        {/* password form field */}
        <div className="form-group relative py-2">
          <label htmlFor="userPassword" className="w-full text-white">
            New password*
          </label>
          <input
            type={`${showPassword ? "text" : "password"}`}
            id="userPassword"
            autoComplete="false"
            value={user.userPassword}
            placeholder="Enter Password*"
            className="w-full outline-none rounded-lg"
            onChange={handleChangeFormFieldEvent}
          />
          <small className="w-full"></small>
          <div
            className="absolute right-0 top-1/2 text-blue-800 text-lg  px-2  mr-2 cursor-pointer"
            onClick={() => hindeAndShowPassword()}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>
        <Link to="/" className="forgot-password pt-10 text-blue-300 text-lg">
          Login Instead?
        </Link>
        <div className="form-group flex flex-wrap justify-center py-10  text-gold">
          <button
            className="w-full bg-red-950 p-3 text-lg text-white hover:bg-red-800 active:translate-x-2"
            onClick={() => {
              saveNewPassword();
              // setUserAction({ userAction: saveNewPassword });

              // dispatch(
              //   setConfirm({
              //     status: true,
              //     message: "Are you sure you want to set a new password? ",
              //   })
              // );
            }}
          >
            Reset Password
          </button>
          <p className="w-full pt-5 text-blue-300">
            Have no account?{" "}
            <Link to="/sign-up" className="text-xl text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <AlertMessage />
    </form>
  );
};

export default ResetPasswordForm;
