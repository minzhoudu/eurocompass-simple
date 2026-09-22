import { useMutation } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { CreateReservationDto } from "../dtos";

// Longer than the shared axiosInstance default (10s): the backend runs on a
// free tier that can cold-start for up to ~1 minute after being idle, and
// this call shouldn't be aborted mid-boot. Its result isn't awaited by the
// UI either way - see ReservationForm's handleFormSubmit.
const CREATE_RESERVATION_TIMEOUT = 60000;

export const useCreateReservation = () =>
  useMutation({
    mutationKey: ["createReservation"],
    mutationFn: async (reservation: CreateReservationDto) => {
      await axiosInstance.post("/reservations", reservation, {
        timeout: CREATE_RESERVATION_TIMEOUT,
      });
    },
  });
