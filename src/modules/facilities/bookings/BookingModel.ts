import { AccommodationModel } from "../../accommodations/AccommodationModel";
import { TenantModel } from "../../auth/TenantModel";
import { FacilitiesModel } from "../FacilityModel";

export interface BookingModel {
  bookingId?: number;
  amount: number;
  paymentType: string;
  accommodationType: string;
  checkIn?: string;
  accommodationCategory: string;
  transactionDate: string;
  transactionStatus: string;
  numberOfAccommodations: number;
  dateCreated?: string;
  lastUpdated?: string;
  tenant: TenantModel;
  facility: FacilitiesModel;
  accommodation?: AccommodationModel;
}
