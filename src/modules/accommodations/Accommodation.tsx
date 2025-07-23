import React from "react";
import { AccommodationModel } from "./AccommodationModel";
import { parseISO, formatDistanceToNow, format } from "date-fns";

import {
  ACCOMMODATION_TYPE_DATA,
  PAYMENT_PARTERN,
} from "../../global/PreDefinedData/PreDefinedData";
import { FormatMoney } from "../../global/actions/formatMoney";
import countriesList from "../../global/data/countriesList.json";
import { calculateRentExpiry } from "../../global/actions/calculateRentExpiry";
import { useSelector } from "react-redux";
import { getAccommodationRent } from "./AccommodationRentSlice";
import { calculateFutureDate } from "../receipts/calculateFutureDate";

interface Props {
  accommodation: AccommodationModel;
  checkIn: string | undefined;
  onClick: () => void;
}

const Accommodattion: React.FC<Props> = ({
  accommodation,
  checkIn,
  onClick,
}) => {
  const checkInDate = checkIn ? parseISO(checkIn) : null;

  const checkInDetails = checkInDate
    ? Date.now() - checkInDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(checkInDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(checkInDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : // Use relative time
      "";

  const rentState = useSelector(getAccommodationRent);
  const { tenantRent } = rentState;

  return (
    <tr
      className="cursor-pointer text-sm text-start border-y-2 hover:bg-gray-100"
      onClick={() => {
        onClick();
      }}
    >
      {/* <td className="py-5">{accommodationIndex + 1}</td> */}
      <td>
        {`(FAC-${accommodation.facility.facilityId}) ${
          accommodation.facility.facilityName
        }, ${accommodation.facility.facilityLocation.city} ${
          countriesList.find(
            (country) =>
              country.value === accommodation.facility.facilityLocation.country
          )?.label
        }`}
      </td>
      <td>{accommodation.accommodationNumber}</td>
      <td>
        {
          ACCOMMODATION_TYPE_DATA.find(
            (type) => type.value === accommodation.accommodationType
          )?.label
        }
      </td>
      <td>{accommodation.floor}</td>

      <td className="font-mono font-bold">
        {FormatMoney(
          Number(accommodation.price),
          2,
          accommodation.facility.preferedCurrency
        )}{" "}
        {
          PAYMENT_PARTERN.find(
            (partern) => partern.value === accommodation.paymentPartten
          )?.label
        }
      </td>

      <td>{checkInDetails}</td>
      <td
        className={`text-${calculateRentExpiry(
          tenantRent.length > 0 ? tenantRent[0].balance : 0,
          new Date(String(checkIn)),
          String(accommodation.paymentPartten),
          tenantRent.length > 0 ? tenantRent[0].periods : 0
        )}`}
      >
        {new Date(
          String(
            calculateFutureDate(
              tenantRent.length > 0 ? tenantRent[0].balance : 0,
              new Date(String(checkIn)),
              String(accommodation.paymentPartten),
              tenantRent.length > 0 ? tenantRent[0].periods : 0
            )
          )
        ).toDateString()}
      </td>
    </tr>
  );
};

export default Accommodattion;
