import { ChangedDentist } from "lib/dentists/types/ChangedDentist";
import { Dentist } from "lib/dentists/types/Dentist";

const testDentist: Dentist = {
    ODSCode: "test-dentist",
    OrganisationName: "Test Dentist",
    Latitude: 0,
    Longitude: 0,
    AcceptingPatients: {
        AcceptingAdults: false,
        AcceptingAdultsEntitled: false,
        AcceptingChildren: false,
        AcceptingReferrals: false,
        AcceptingUrgent: false
    },
    DentistsAcceptingPatientsLastUpdatedDate: "2023-01-01T12:34:56Z"
}

export default testDentist;