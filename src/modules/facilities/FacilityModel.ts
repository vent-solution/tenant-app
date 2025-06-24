import { LandlordModel } from "../auth/landlordModel";
import { TenantModel } from "../auth/TenantModel";
import { UserModel } from "../users/models/userModel";
import { AmenitiesModel } from "./AmenitiesModel";
export interface FacilitiesModel {
  facilityId: number;
  facilityCategory: string;
  facilityName: string;
  facilityLocation: {
    primaryAddress: string;
    country: string;
    city: string;

    latitude: string;
    longitude: string;
    distance: string;
  };
  contact: {
    telephone1: string;
    email: string;
  };
  genderRestriction: string;
  businessType: string;
  dateCreated: string;
  lastUpdated: string;
  facilityAmenities?: AmenitiesModel | null;
  facilityImages?: { imageName: string }[];
  manager: UserModel;
  preferedCurrency: string;
  price?: number;
  bookingPercentage: number;
  bidAmount?: number;
  tenants: TenantModel[];
  description?: string | null;
  facilityRating?: string;
  facilityStatus?: string | null;
  landlord?: LandlordModel;
}
