import { AccommodationModel } from "../accommodations/AccommodationModel";
import { TenantModel } from "../auth/TenantModel";

export interface BookingModel {
  bookingId?: number;
  amount: number;
  currency: string;
  paymentType: string;
  checkIn?: string;
  checkOut?: string;
  transactionDate: string;
  transactionStatus: string;
  dateCreated?: string;
  lastUpdated?: string;
  tenant: TenantModel;
  accommodation: AccommodationModel;
}

export interface BookingCreationModel {
  amount: number | null;
  currency: string | null;
  paymentType: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  transactionDate: string | null;
  transactionStatus: string;
  accommodation: { accommodationId: number | null };
}
