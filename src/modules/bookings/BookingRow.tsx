import React from "react";
import { BookingModel } from "./BookingModel";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { FormatMoney } from "../../global/actions/formatMoney";
import {
  ACCOMMODATION_CATEGORY,
  ACCOMMODATION_TYPE_DATA,
  PAYMENT_TYPE_DATA,
} from "../../global/PreDefinedData/PreDefinedData";

interface Props {
  booking: BookingModel;
}

let BookingRow: React.FC<Props> = ({ booking }) => {
  const createdDate = booking.dateCreated
    ? parseISO(booking.dateCreated)
    : null;

  // formating the date and time office created
  const created = createdDate
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

  return (
    <tr className="cursor-pointer text-sm text-start border-y-2 hover:bg-gradient-to-b  hover:bg-gray-100">
      {/* <td className="py-5">{"BKG-" + booking.bookingId}</td> */}
      <td>
        {
          ACCOMMODATION_TYPE_DATA.find(
            (type) => type.value === booking.accommodation.accommodationType
          )?.label
        }

        {booking.accommodation.accommodationCategory &&
          booking.accommodation.accommodationCategory !== null && (
            <span className="italic font-bold">
              {" "}
              (
              {
                ACCOMMODATION_CATEGORY.find(
                  (category) =>
                    category.value ===
                    booking.accommodation.accommodationCategory
                )?.label
              }
              ){" "}
            </span>
          )}
      </td>
      <td>{booking.accommodation.accommodationNumber}</td>
      <td className="px-2">
        {booking.accommodation.facility.facilityName +
          ", " +
          booking.accommodation.facility.facilityLocation.city +
          " " +
          booking.accommodation.facility.facilityLocation.country}
      </td>
      <td className="px-2">
        {booking.accommodation.facility.contact.telephone1}
      </td>
      <td className="px-2">{booking.accommodation.facility.contact.email}</td>
      <td className="px-2 font-bold font-mono">
        {FormatMoney(
          booking.amount,
          2,
          booking.accommodation.facility.preferedCurrency
        )}
      </td>
      <td className="px-2">
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === booking.paymentType)
            ?.label
        }
      </td>
      <td className="px-2">{booking.checkIn}</td>
      <td className="px-2">{created}</td>
    </tr>
  );
};

BookingRow = React.memo(BookingRow);

export default BookingRow;
