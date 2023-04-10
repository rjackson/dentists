import { Dentist } from "./Dentist";

export type ChangedDentist = {
    previousDentist: Dentist;
    currentDentist: Dentist;
};