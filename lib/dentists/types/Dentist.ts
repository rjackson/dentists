import { AcceptingPatientsBlock } from "./AcceptingPatientsBlock";

export type Dentist = {
    ODSCode: string;
    OrganisationName: string;
    Latitude: number;
    Longitude: number;
    AcceptingPatients: AcceptingPatientsBlock;
    DentistsAcceptingPatientsLastUpdatedDate: string;
};