import { configureStore } from "@reduxjs/toolkit";

import authReducer         from "../Reducer/AuthSlice";
import pharmacyReducer     from "../Reducer/PharmacySlice";
import medicineReducer     from "../Reducer/MedicineSlice";
import reservationReducer  from "../Reducer/ReservationSlice";
import emergencyReducer    from "../Reducer/EmergencySlice";
import notificationReducer from "../Reducer/NotificationSlice";

const store = configureStore({
  reducer: {
    auth:         authReducer,
    pharmacy:     pharmacyReducer,
    medicine:     medicineReducer,
    reservation:  reservationReducer,
    emergency:    emergencyReducer,
    notification: notificationReducer,
  },
});

export default store;