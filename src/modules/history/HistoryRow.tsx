import React from "react";
import { HistoryModel } from "./HistoryModel";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ACCOMMODATION_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";

interface Props {
  history: HistoryModel;
  onClick: () => void;
}
const HistoryRow: React.FC<Props> = ({ history, onClick }) => {
  const createdDate = history.checkIn ? parseISO(history.checkIn) : null;
  const lastUpdated = history.checkOut ? parseISO(history.checkOut) : null;

  // formating the checkIn  date and time
  const checkIn = createdDate
    ? Date.now() - createdDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(createdDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(createdDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  // formating the checkOut  date and time
  const checkOut = lastUpdated
    ? Date.now() - lastUpdated.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(lastUpdated, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(lastUpdated, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  return (
    <tr
      className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100"
      onClick={() => onClick()}
    >
      <td className="px-2 py-5">
        {history.accommodation.facility.facilityName +
          ", " +
          history.accommodation.facility.facilityLocation.city +
          " " +
          history.accommodation.facility.facilityLocation.country}
      </td>
      <td className="px-2 py-5">{history.accommodation.accommodationNumber}</td>
      <td className="px-2">{history.accommodation.floor}</td>
      <td className="px-2">
        {
          ACCOMMODATION_TYPE_DATA.find(
            (type) => type.value === history.accommodation.accommodationType
          )?.label
        }
      </td>
      <td className="px-2">
        {history.accommodation.facility.contact.telephone1}
      </td>
      <td className="px-2">{history.accommodation.facility.contact.email}</td>
      <td className="px-2">{checkIn}</td>
      <td className="px-2">{checkOut}</td>
    </tr>
  );
};

export default HistoryRow;
