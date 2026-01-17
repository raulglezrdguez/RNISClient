import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InterestItem {
  id: string;
  descripcion: string;
}

export interface InterestsState {
  interests: InterestItem[];
}

const initialState: InterestsState = {
  interests: [],
};

export const interestSlice = createSlice({
  name: 'interests',
  initialState,
  reducers: {
    setInterests: (state, action: PayloadAction<InterestItem[]>) => {
      state.interests = action.payload;
    },
  },
});

export const selectInterests = (state: { interests: InterestsState }) =>
  state.interests.interests;
export const { setInterests } = interestSlice.actions;
export default interestSlice.reducer;
