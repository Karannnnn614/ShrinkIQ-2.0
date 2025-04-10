import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Link, CreateLinkPayload } from '../../types';

// Configure axios base URL if not already set
if (!axios.defaults.baseURL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
}

interface LinksState {
  links: Link[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LinksState = {
  links: [],
  isLoading: false,
  error: null,
};

export const createLink = createAsyncThunk(
  'links/create',
  async (payload: CreateLinkPayload) => {
    const response = await axios.post("/api/links/shorten", payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

export const fetchLinks = createAsyncThunk('links/fetch', async () => {
  const response = await axios.get('/api/links', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
});

const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createLink.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.links.unshift(action.payload);
      })
      .addCase(createLink.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create link';
      })
      .addCase(fetchLinks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.links = action.payload;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch links';
      });
  },
});

export default linksSlice.reducer;