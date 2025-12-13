import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "./eventsApi";

interface EventsState {
  selectedEvent: Event | null;
  filter: string;
}

const initialState: EventsState = {
  selectedEvent: null,
  filter: "all",
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    selectEvent: (state, action: PayloadAction<Event>) => {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

export const { selectEvent, clearSelectedEvent, setFilter } =
  eventsSlice.actions;
export default eventsSlice.reducer;
