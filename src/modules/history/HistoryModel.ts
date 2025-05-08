import { AccommodationModel } from "../accommodations/AccommodationModel";
import { FacilitiesModel } from "../facilities/FacilityModel";
import { TenantModel } from "../tenants/TenantModel";

export interface HistoryModel {
  historyId?: number;
  tenant: TenantModel;
  accommodation: AccommodationModel;
  checkIn?: string;
  checkOut?: string;
  status?: string;
}
