import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import Preloader from "../../other/Preloader";
import { LogModel } from "./LogModel";
import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";
import Log from "./Log";
import { getLogs } from "./LogsSlice";
import { UserModel } from "../users/models/userModel";
import EmptyList from "../../global/EnptyList";

interface Props {}

let LogsList: React.FC<Props> = () => {
  // local state variabes
  const [searchString, setSearchString] = useState<string>("");
  const [filteredLogs, setFilteredLogs] = useState<LogModel[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const logsState = useSelector(getLogs);
  const { userLogs, status, error, page, size, totalElements, totalPages } =
    logsState;

  useEffect(() => {
    const originalLogs =
      userLogs.length > 0
        ? [...userLogs].sort((a, b) => {
            const aLogId = a.logId ? parseInt(a.logId, 10) : 0;
            const bLogId = b.logId ? parseInt(b.logId, 10) : 0;
            return bLogId - aLogId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredLogs(originalLogs);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredLogs(
        originalLogs.filter((log) => {
          const { user } = log;

          const logNumber = "LOG-" + log.logId;
          const userNumber = "USR-" + log.user?.userId;
          const logYear = new Date(`${log.dateCreated}`).getFullYear();
          const logMonth = new Date(`${log.dateCreated}`).getMonth() + 1;
          const logDay = new Date(`${log.dateCreated}`).getDate();
          const logDate = logDay + "/" + logMonth + "/" + logYear;
          return (
            (logDate && logDate.toLowerCase().includes(searchTerm)) ||
            (log.logId && logNumber.toLowerCase().includes(searchTerm)) ||
            (log.user?.userId &&
              userNumber.toLowerCase().includes(searchTerm)) ||
            (user?.firstName &&
              user.firstName.toLowerCase().includes(searchTerm)) ||
            (user?.lastName && user.lastName.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, userLogs]);

  // handle search event
  const handleSearchlogs = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    const user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    dispatch(
      fetchLogs({ userId: [Number(user?.userId)], page: page + 1, size: size })
    );
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    const user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    dispatch(
      fetchLogs({ userId: [Number(user?.userId)], page: page - 1, size: size })
    );
  }, [dispatch, page, size]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0 bg-gray-200">
      <div className="list w-full relative">
        <div className="bg-white w-full">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-2 lg:px-10 py-3 bg-white shadow-lg">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-blue-950 text-2xl">Activity logs</h1>
                <h1 className="text-lg">
                  {filteredLogs.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-800 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for log..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchlogs}
                />

                <button className="bg-blue-800 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5 h-[calc(100svh-150px)] relative">
          {filteredLogs.length > 0 ? (
            <table className="border-2 w-full bg-cyan-50 bordered mt-3 shadow-xl">
              <thead className="sticky top-0 bg-blue-800 text-white">
                <tr>
                  {/* <th className="p-2 text-start font-bold">#</th> */}
                  {/* <th className="p-2 text-start font-bold">Log number</th> */}
                  <th className="p-2 text-start font-bold">User number</th>
                  <th className="p-2 text-start font-bold">User full name</th>
                  <th className="p-2 text-start font-bold">User role</th>
                  <th className="p-2 text-start font-bold">Activity</th>
                  <th className="p-2 text-start font-bold">Description</th>
                  <th className="p-2 text-start font-bold">Status</th>
                  <th className="p-2 text-start font-bold">Log date</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredLogs.map((log: LogModel, index: number) => (
                  <Log key={index} log={log} logIndex={index} />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyList itemName="activity log" />
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

LogsList = React.memo(LogsList);
export default LogsList;
function fetchLogs(arg0: {
  userId: number[];
  page: number;
  size: number;
}): any {
  throw new Error("Function not implemented.");
}
