import { FacilitiesModel } from "../facilities/FacilityModel";
import { UserModel } from "../users/models/userModel";

export interface ServiceFeeModel {
  serviceFeeId?: number;
  amount: number;
  paymentType: string;
  dateCreated?: string;
  facility: FacilitiesModel;
  paidBy: UserModel;
}

export interface ServiceFeeCreationModel {
  amount: number | null;
  paymentType: string | null;
  facility: { facilityId?: number | null };
  paidBy: { userId?: number | null };
}
