import { TenantModel } from "../auth/TenantModel";

export interface BrokerFeeModel {
  brokerFeeId?: string;
  amount: number;
  currency: string;
  tenant: TenantModel;
  paymentType: string;
  dateCreated?: string;
  lastUpdated?: string;
}

export interface BrokerFeeCreationModel {
  amount: number | null;
  currency: string | null;
  tenant: { tenantId: number | null };
  paymentType: string | null;
}
