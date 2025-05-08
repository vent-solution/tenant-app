import React, { useEffect, useState } from "react";
import { MdDashboard, MdPayment } from "react-icons/md";
import { FaUsers, FaScrewdriverWrench } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import { NavLinkModel } from "../users/models/navLinkModel";
import SideBar from "../../sidebar/sideBar";
import Preloader from "../../other/Preloader";
// import { useSelector } from "react-redux";
// import { getMessages, resetSocketMessage } from "../../webSockets/soketsSlice";
import { UserModel } from "../users/models/userModel";
// import { Client } from "@stomp/stompjs";
// import { AppDispatch } from "../../app/store";
// import { socket } from "../../webSockets/socketService";
import { PiBuildingsFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { getSettings } from "../settings/SettingsSlice";
import TotalEarnings from "./TotalEarnings";
import MonthlyEarnings from "./MonthlyEarnings";
import AnnualEarnings from "./AnnualEarnings";
import DailyEarnings from "./DailyEarnings";
import NumberOfUsers from "./NumberOfFacilities";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { fetchFacilities } from "../facilities/FacilitiesSlice";
import { AppDispatch } from "../../app/store";
import { FaBusinessTime } from "react-icons/fa";
import { SiCoinmarketcap } from "react-icons/si";

// import { getCurrencyExchange } from "../../other/apis/CurrencyExchangeSlice";
// import { FormatMoney, FormatMoneyExt } from "../../global/actions/formatMoney";

interface Props {}

const user: UserModel = JSON.parse(localStorage.getItem("dnap-user") as string);

const Dashboard: React.FC<Props> = () => {
  const [navLinks] = useState<NavLinkModel[]>([
    {
      icon: <MdDashboard />,
      name: "Dashboard",
      link: "/dashboard",
      active: true,
    },

    {
      icon: <PiBuildingsFill />,
      name: "Facilities",
      link: "/facilities",
      active: false,
    },

    {
      icon: <FaUsers />,
      name: "Users",
      link: "/users",
      active: false,
    },

    {
      icon: <IoDiamondSharp />,
      name: "Tenants",
      link: "/tenants",
      active: false,
    },

    {
      icon: <ImOffice />,
      name: "Our offices",
      link: "/offices",
      active: false,
    },
    {
      icon: <FaScrewdriverWrench />,
      name: "Settings",
      link: "/settings",
      active: false,
    },
    {
      icon: <MdPayment />,
      name: "Subscription fees",
      link: "/subscription",
      active: false,
    },

    {
      icon: <SiCoinmarketcap />,
      name: "Bids",
      link: "/bids",
      active: false,
    },

    {
      icon: <FaBusinessTime />,
      name: "Market place",
      link: "/market",
      active: false,
    },

    {
      icon: <RxActivityLog />,
      name: "Activity Logs",
      link: "/logs",
      active: false,
    },
  ]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const [socketResponse, setSocketResponse] = useState<string>("");
  // const [names, setNames] = useState<string[]>([]);
  // const [currentCurrency] = useState<string>("ugx");
  // const [currentCurrencyValue, setCurrenctCurrencyValue] = useState<string>("");
  // const [exchnageAmount] = useState<number>(3700000);
  // const [desiredCurrency, setDesiredCurrency] = useState<string>("");

  // const dispatch = useDispatch<AppDispatch>();
  // const messagesState = useSelector(getMessages);
  // const { socketMessage } = messagesState;

  // const currencyExchange = useSelector(getCurrencyExchange);

  // Ref to hold the STOMP client instance
  // const stompClientRef = useRef<Client | null>(null);

  // Track reconnection attempts
  // let reconnectAttempts = 0;
  // const maxReconnectAttempts = 5; // You can adjust this
  // let reconnectDelay = 1000; // Start with 1 second delay

  // useEffect(() => {
  //   const currencyNames = Object.keys(currencyExchange);
  //   setNames(currencyNames);
  // }, []);

  //handle change currency
  // const changeCurrency = (currency: string) => {
  //   setDesiredCurrency(currency);
  // };

  // //set currency value
  // useEffect(() => {
  //   setCurrenctCurrencyValue(currencyExchange[currentCurrency]);
  // }, [currentCurrency]);

  // useEffect(() => {
  //   const user: UserModel = JSON.parse(
  //     localStorage.getItem("dnap-user") as string
  //   );

  // socket client connection
  //   const connectClient = () => {
  //     // Initialize SockJS and STOMP client
  //     const client = new Client({
  //       webSocketFactory: () => socket, // Use SockJS as WebSocket factory
  //       debug: (str) => console.log("STOMP Debug:", str),

  //       onConnect: () => {
  //         console.log("Connected to WebSocket server");

  //         // Reset reconnection attempts after a successful connection
  //         reconnectAttempts = 0;
  //         reconnectDelay = 1000; // Reset delay after successful connection

  //         // Subscribe to a topic
  //         client.subscribe("/topic/login", (message) => {
  //           console.log("Received message:", JSON.parse(message.body));
  //           dispatch(resetSocketMessage(JSON.parse(message.body))); // Dispatch to Redux store
  //         });

  //         client.publish({
  //           destination: "/app/login",
  //           body: JSON.stringify({
  //             userId: user.userId,
  //             userRole: user.userRole,
  //             topic: "login",
  //           }),
  //         });
  //       },

  //       onStompError: (frame) => {
  //         console.error("STOMP Error:", frame.headers["message"]);
  //         console.error("Additional details:", frame.body);
  //       },

  //       onWebSocketClose: (event) => {
  //         console.log("WebSocket connection closed:", event);
  //         handleReconnection();
  //       },

  //       onWebSocketError: (event) => {
  //         console.error("WebSocket Error:", event);
  //         handleReconnection();
  //       },
  //     });

  //     // Store the client instance in the ref
  //     stompClientRef.current = client;

  //     // Activate the STOMP client
  //     client.activate();
  //   };

  //   const handleReconnection = () => {
  //     if (reconnectAttempts < maxReconnectAttempts) {
  //       reconnectAttempts++;
  //       reconnectDelay *= 2; // Exponential backoff
  //       console.log(
  //         `Reconnecting attempt ${reconnectAttempts} in ${
  //           reconnectDelay / 1000
  //         } seconds...`
  //       );

  //       setTimeout(() => {
  //         if (stompClientRef.current) {
  //           stompClientRef.current.activate(); // Re-activate the client to reconnect
  //         } else {
  //           connectClient(); // Connect the client if it's not already set
  //         }
  //       }, reconnectDelay);
  //     } else {
  //       console.error(
  //         "Max reconnection attempts reached. Could not reconnect."
  //       );
  //     }
  //   };

  //   connectClient();

  //   return () => {
  //     // Cleanup on component unmount
  //     if (stompClientRef.current) {
  //       stompClientRef.current.deactivate();
  //     }
  //   };
  // }, [dispatch]);

  // check if the user is authenticated
  useEffect(() => {
    const current_user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    if (current_user) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  // const sendMessage = () => {
  //   const client = stompClientRef.current;
  //   if (client && client.connected) {
  //     const user: UserModel = JSON.parse(
  //       localStorage.getItem("dnap-user") as string
  //     );

  //     // Subscribe to a topic
  //     client.subscribe("/topic/check12", (message) => {
  //       console.log("Received message:", JSON.parse(message.body));
  //       setSocketResponse(message.body);
  //       dispatch(resetSocketMessage(JSON.parse(message.body))); // Dispatch to Redux store
  //     });

  //     client.publish({
  //       destination: "/app/check12",
  //       body: JSON.stringify({
  //         userId: user.userId,
  //         userRole: user.userRole,
  //         topic: "check12",
  //       }),
  //     });
  //   } else {
  //     console.error("Cannot send message: STOMP client is not connected");
  //   }
  // };

  const [currentUser] = useState<UserModel>(user);
  const dispatch = useDispatch<AppDispatch>();
  const settingsState = useSelector(getSettings);

  // fetch facilities that belong to the current landlord
  useEffect(() => {
    let userId: number;

    if (currentUser?.userRole !== UserRoleEnum.landlord) {
      userId = Number(currentUser?.linkedTo);
    } else {
      userId = Number(currentUser.userId);
    }

    dispatch(
      fetchFacilities({
        userId: Number(userId),
        page: 0,
        size: 25,
      })
    );
  }, [
    currentUser?.linkedTo,
    currentUser?.userId,
    currentUser?.userRole,
    dispatch,
  ]);

  if (!isAuthenticated) return <Preloader />;

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/4 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div
        className="right lg:w-full w-full h-svh px-0 lg:px-0 py-0 uppercase overflow-y-auto  mt-20 lg:mt-0"
        // style={{ height: "calc(100vh - 10px)" }}
      >
        {/* periodic total earning */}
        <TotalEarnings settings={settingsState.settings[0]} />

        {/* annual and monthly earning statistics*/}
        <div className="w-full h-fit text-sm flex flex-wrap justify-center items-center lg:p-5">
          {/* monthly earnings*/}
          <MonthlyEarnings settings={settingsState.settings[0]} />

          {/* Annual earnings*/}
          <AnnualEarnings settings={settingsState.settings[0]} />

          {/* daily earnings */}
          <DailyEarnings settings={settingsState.settings[0]} />

          {/* number of users in categories */}
          <NumberOfUsers />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
