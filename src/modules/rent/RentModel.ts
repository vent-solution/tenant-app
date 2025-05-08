import { AccommodationModel } from "../accommodations/AccommodationModel";
import { FacilitiesModel } from "../facilities/FacilityModel";
import { TenantModel } from "../tenants/TenantModel";

export interface RentModel {
  rentId?: number;
  amount: number;
  currency: string;
  paymentType: string;
  transactionDate: string;
  period: number;

  balance: number;
  transactionStatus?: string;
  dateCreated?: string;
  lastUpdated?: string;
  tenant: TenantModel;
  facility: FacilitiesModel;
  accommodation: AccommodationModel;
}

// CREATION RENT MODEL
export interface CreationRentModel {
  amount: number | null;
  currency: string | null;
  paymentType: string | null;
  transactionDate?: string | null;
  transactionStatus?: string | null;
  dateCreated?: string | null;
  lastUpdated?: string | null;
  tenant?: { tenantId: number | null };
  facility?: { facilityId: number | null };
  accommodation?: {
    accommodationId: number | null;
    accommodationNumber: string | null;
  };
}
