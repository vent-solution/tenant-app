import { FacilitiesModel } from "../facilities/FacilityModel";
import { UserModel } from "../users/models/userModel";

export interface BidModel {
  bidId?: string;
  bidAmount: number;
  paymentType: string;
  dateCreated: string;
  lastUpdated?: string;
  facility: FacilitiesModel;
  paidBy: UserModel;
}
