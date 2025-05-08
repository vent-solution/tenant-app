import React, { useEffect, useState } from "react";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { FacilitiesModel } from "./FacilityModel";
import { useNavigate } from "react-router-dom";
import { FormatMoney } from "../../global/actions/formatMoney";
import { useDispatch, useSelector } from "react-redux";
import { getSettings } from "../settings/SettingsSlice";
import {
  BUSINESS_TYPE_DATA,
  FACILITY_CATEGORY_DATA,
  FACILITY_STATUS,
} from "../../global/PreDefinedData/PreDefinedData";
import { fetchData } from "../../global/api";
import { AppDispatch } from "../../app/store";
import axios from "axios";

interface Props {
  facility: FacilitiesModel;
  facilityIndex: number;
}

const FacilityRow: React.FC<Props> = ({ facilityIndex, facility }) => {
  const [facilityCategory, setFacilityCategory] = useState<{
    label: string;
    value: string;
  }>();

  const [businessType, setBusinessType] = useState<{
    label: string;
    value: string;
  }>();

  const registeredDate = facility.dateCreated
    ? parseISO(facility.dateCreated)
    : null;

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

  const navigate = useNavigate();

  const adminFinancialSetting = useSelector(getSettings);

  const { settings } = adminFinancialSetting;

  // reset facility bid to zero if there is no bid record for the current month of the current year
  const resetFacilityBidAmount = async () => {
    const facilityId: number = Number(facility.facilityId);

    if (!facilityId) return;

    try {
      const result = await fetchData(
        `/reset-facility-bid-amount/${facilityId}`
      );

      if (result.data.status !== "OK" || result.status !== 200) return;

      if (result.data === 0) {
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH NUMBER OF FACILITY BID RECORDS CANCELLED: ",
          error.message
        );
      }
    }
  };

  // setFacility category and business type
  useEffect(() => {
    setFacilityCategory(
      FACILITY_CATEGORY_DATA.find(
        (category) => category.value === facility.facilityCategory
      )
    );

    setBusinessType(
      BUSINESS_TYPE_DATA.find((type) => type.value === facility.businessType)
    );

    resetFacilityBidAmount();
  }, [facility]);

  return (
    <tr
      className="cursor-pointer text-sm text-center border-y-2  hover:bg-gray-100 "
      onClick={() => navigate(`/facilities/${facility.facilityId}`)}
    >
      <td className="py-5">{facilityIndex + 1}</td>
      <td>{"FAC-" + facility.facilityId}</td>

      <td>{businessType?.label}</td>
      <td>{facilityCategory?.label}</td>
      <td>{facility.facilityName}</td>
      <td>
        {facility.facilityLocation.city && facility.facilityLocation.city}{" "}
        {facility.facilityLocation.country}
      </td>
      <td>
        {
          FACILITY_STATUS.find(
            (status) => status.value === facility.facilityStatus
          )?.label
        }
      </td>
      {/* <td className="font-bold font-mono">
        {(facility.businessType === businessTypeEnum.sale ||
          facility.businessType === businessTypeEnum.rentWhole) &&
          FormatMoney(Number(facility.price), 2, facility.preferedCurrency)}
      </td> */}
      <td className="font-bold font-mono">
        {FormatMoney(
          facility.bidAmount ? facility.bidAmount : 0,
          2,
          settings[0].preferedCurrency
        )}
      </td>
      <td>{registered}</td>
    </tr>
  );
};

export default FacilityRow;
