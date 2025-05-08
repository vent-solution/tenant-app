import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { FormatMoney } from "../../global/actions/formatMoney";
import { PAYMENT_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";
import { RentModel } from "../rent/RentModel";

interface Props {
  rent: RentModel;
}

const AccommodationRentRow: React.FC<Props> = ({ rent }) => {
  const registeredDate = rent.dateCreated ? parseISO(rent.dateCreated) : null;

  const registered = registeredDate
    ? Date.now() - registeredDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(registeredDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(registeredDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : // Use relative time
      "";

  return (
    <tr className="border-y-blue-500 border-2 hover:bg-blue-100">
      <td className="py-2">{"TNT-" + rent.tenant.tenantId}</td>
      {!rent.tenant.companyName && (
        <td>{rent.tenant.user.firstName + " " + rent.tenant.user.lastName}</td>
      )}

      {rent.tenant.companyName && <td>{rent.tenant.companyName}</td>}
      <td className="font-bold font-mono">
        {FormatMoney(
          rent.amount,
          2,
          rent.accommodation.facility.preferedCurrency
        )}
      </td>
      <td>
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === rent.paymentType)
            ?.label
        }
      </td>
      <td>{registered}</td>
    </tr>
  );
};

export default AccommodationRentRow;
