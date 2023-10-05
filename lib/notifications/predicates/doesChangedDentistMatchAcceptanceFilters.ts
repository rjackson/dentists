import { ChangedDentist } from "lib/dentists/types/ChangedDentist";
import { AcceptanceFilters } from "../types/AcceptanceFilters";

const doesChangedDentistMatchAcceptanceFilters = ({ previousDentist, currentDentist }: ChangedDentist, filters: AcceptanceFilters): boolean => {
    const activeFiltersProperties: Array<keyof AcceptanceFilters> = Object.entries(filters).filter(([, active]) => active).map(([property]) => property as keyof AcceptanceFilters);

    // No filters set, so any changes pass
    if (activeFiltersProperties.length === 0) {
        return true;
    }

    return activeFiltersProperties.some(property => {
        const previousValue = previousDentist.AcceptingPatients[property];
        const currentValue = currentDentist.AcceptingPatients[property];

        // Value hasn't changed, we're not interested
        if (previousValue === currentValue) {
            return false;
        }

        // Value changed. If it turned to true, this'll pass our filter. If it remains false, it won't.
        return currentValue;
    });
}

export default doesChangedDentistMatchAcceptanceFilters;