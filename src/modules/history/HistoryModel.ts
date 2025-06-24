import { AccommodationModel } from "../accommodations/AccommodationModel";
import { TenantModel } from "../auth/TenantModel";
import { FacilitiesModel } from "../facilities/FacilityModel";

export interface HistoryModel {
  historyId?: number;
  tenant: TenantModel;
  accommodation: AccommodationModel;
  checkIn?: string;
  checkOut?: string;
  status?: string;
}
