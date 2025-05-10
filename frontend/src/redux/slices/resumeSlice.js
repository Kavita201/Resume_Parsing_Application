import { createSlice } from "@reduxjs/toolkit";
import merge from "lodash.merge"; // install lodash if needed

// Initial state
const initialState = {
  parsedData: {},
  education: [],
  specialties: [],
  experience: [],
  basicInformation: {},
};

export const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResumeData: (state, action) => {
      state.parsedData = merge({}, state.parsedData, action.payload); //merge (from lodash) deeply merges the existing parsedData with action.payload.
      sessionStorage.setItem("parsedData", JSON.stringify(state.parsedData));
    },
    // setResumeData: (state, action) => {
    //   state.parsedData = action.payload;
    //   sessionStorage.setItem("parsedData", JSON.stringify(action.payload));
    // },
    // setResumeData: (state, action) => {
    //   state.parsedData = { ...state.parsedData, ...action.payload };
    //   sessionStorage.setItem("parsedData", JSON.stringify(state.parsedData));
    // },

    setEducationData: (state, action) => {
      state.education = action.payload;
    },
    setSpecialtiesData: (state, action) => {
      state.specialties = action.payload;
    },
    setExperienceData: (state, action) => {
      state.experience = action.payload;
    },
    setBasicInformation: (state, action) => {
      state.basicInformation = action.payload; // Update Redux state
      sessionStorage.setItem(
        "basicInformation",
        JSON.stringify(action.payload)
      ); // Save to sessionStorage
    },
  },
});

export const {
  setResumeData,
  setEducationData,
  setSpecialtiesData,
  setExperienceData,
  setBasicInformation,
} = resumeSlice.actions;

export default resumeSlice.reducer;
