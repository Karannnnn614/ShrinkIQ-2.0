import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ClicksOverTime, DeviceBreakdown } from '../../types';

// Configure axios base URL if not already set
if (!axios.defaults.baseURL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
}

interface AnalyticsState {
  clicksOverTime: ClicksOverTime[];
  deviceBreakdown: DeviceBreakdown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  clicksOverTime: [],
  deviceBreakdown: [],
  isLoading: false,
  error: null,
};

export const fetchClicksOverTime = createAsyncThunk(
  'analytics/fetchClicksOverTime',
  async () => {
    const response = await axios.get('/api/analytics/chart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  }
);

export const fetchDeviceBreakdown = createAsyncThunk(
  'analytics/fetchDeviceBreakdown',
  async () => {
    const response = await axios.get('/api/analytics/analytics', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClicksOverTime.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchClicksOverTime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clicksOverTime = action.payload;
      })
      .addCase(fetchClicksOverTime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch clicks data';
      })
      .addCase(fetchDeviceBreakdown.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDeviceBreakdown.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deviceBreakdown = action.payload;
      })
      .addCase(fetchDeviceBreakdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch device data';
      });
  },
});

export default analyticsSlice.reducer;