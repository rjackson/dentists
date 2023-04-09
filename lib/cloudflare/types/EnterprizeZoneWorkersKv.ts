import { EnterpriseZoneWorkersKV as CfEnterpriseZoneWorkersKV } from "cloudflare";
import { EnterpriseZoneWorkersKvBrowseResponse } from "./EnterpriseZoneWorkersKvBrowseResponse";

export interface EnterpriseZoneWorkersKV extends Omit<CfEnterpriseZoneWorkersKV, 'browse'> {
    browse(account_id: string, namespace_id: string, options: object): Promise<EnterpriseZoneWorkersKvBrowseResponse>;
}