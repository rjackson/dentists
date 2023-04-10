import { RawAcceptingPatientsEntry } from "./RawAcceptingPatientsEntry";

export type RawDentist = {
    ODSCode: string;
    OrganisationName: string;
    Latitude: number;
    Longitude: number;
    AcceptingPatients: {
        GP: null;
        Dentist: RawAcceptingPatientsEntry[];
    };
    DentistsAcceptingPatientsLastUpdatedDate: string;
};