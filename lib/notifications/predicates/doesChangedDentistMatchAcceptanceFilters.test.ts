import { Dentist } from "lib/dentists/types/Dentist";
import { AcceptanceFilters } from "../types/AcceptanceFilters";
import doesChangedDentistMatchAcceptanceFilters from "./doesChangedDentistMatchAcceptanceFilters";
import testDentist from "../__fixtures__/dentists/testDentist";

describe('doesChangedDentistMatchAcceptanceFilters', () => {
    const previousDentist: Dentist = {
        ODSCode: 'ABC123',
        OrganisationName: 'Previous Dental Practice',
        Latitude: 51.5074,
        Longitude: -0.1278,
        AcceptingPatients: {
            AcceptingAdults: true,
            AcceptingAdultsEntitled: false,
            AcceptingChildren: true,
            AcceptingUrgent: false,
            AcceptingReferrals: true,
        },
        DentistsAcceptingPatientsLastUpdatedDate: '2023-04-09',
    };

    const currentDentist: Dentist = {
        ODSCode: 'DEF456',
        OrganisationName: 'Current Dental Practice',
        Latitude: 51.5074,
        Longitude: -0.1278,
        AcceptingPatients: {
            AcceptingAdults: true,
            AcceptingAdultsEntitled: true, // change to true
            AcceptingChildren: true,
            AcceptingUrgent: false,
            AcceptingReferrals: false, // change to false
        },
        DentistsAcceptingPatientsLastUpdatedDate: '2023-04-10',
    };

    test('returns true when no filters are set', () => {
        const filters: AcceptanceFilters = {
            AcceptingAdults: false,
            AcceptingAdultsEntitled: false,
            AcceptingChildren: false,
            AcceptingUrgent: false,
            AcceptingReferrals: false,
        };
        expect(doesChangedDentistMatchAcceptanceFilters({ previousDentist, currentDentist }, filters)).toBe(true);
    });

    test('returns true when AcceptingAdultsEntitled filter is active and AcceptingAdultsEntitled has changed to true', () => {
        const filters: AcceptanceFilters = {
            AcceptingAdults: false,
            AcceptingAdultsEntitled: true,
            AcceptingChildren: false,
            AcceptingUrgent: false,
            AcceptingReferrals: false,
        };
        expect(doesChangedDentistMatchAcceptanceFilters({ previousDentist, currentDentist }, filters)).toBe(true);
    });

    test('returns true when multiple filters are active and some of them have changed to true', () => {
        const filters: AcceptanceFilters = {
            AcceptingAdults: true, // remains true
            AcceptingAdultsEntitled: true, // changed to true
            AcceptingChildren: true, // remains false
            AcceptingUrgent: false,
            AcceptingReferrals: false,
        };
        expect(doesChangedDentistMatchAcceptanceFilters({ previousDentist, currentDentist }, filters)).toBe(true);
    });

    test('returns false when AcceptingAdults filter is active and AcceptingAdultsEntitled has not changed', () => {
        const filters: AcceptanceFilters = {
            AcceptingAdults: true,
            AcceptingAdultsEntitled: false,
            AcceptingChildren: false,
            AcceptingUrgent: false,
            AcceptingReferrals: false,
        };
        expect(doesChangedDentistMatchAcceptanceFilters({ previousDentist, currentDentist }, filters)).toBe(false);
    });

    test('returns false when AcceptingReferrals filter is active and AcceptingAdultsEntitled has changed to false', () => {
        const filters: AcceptanceFilters = {
            AcceptingAdults: false,
            AcceptingAdultsEntitled: false,
            AcceptingChildren: false,
            AcceptingUrgent: false,
            AcceptingReferrals: true,
        };
        expect(doesChangedDentistMatchAcceptanceFilters({ previousDentist, currentDentist }, filters)).toBe(false);
    });
});
