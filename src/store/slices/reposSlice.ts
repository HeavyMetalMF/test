import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {Repo, ReposState} from "../../shared/types";



const initialState: ReposState = {
    repos: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    username: '',
};

export const fetchRepos = createAsyncThunk<
    { repos: Repo[]; page: number },
    { username: string; page: number },
    { rejectValue: string }
>(
    'repos/fetchRepos',
    async ({ username, page }, { rejectWithValue }) => {
        try {
            const per_page = 20;
            const response = await axios.get<Repo[]>(`https://api.github.com/users/${username}/repos`, {
                params: { per_page, page },
            });
            return { repos: response.data, page };
        } catch (error) {
            if (!axios.isAxiosError(error)) {
                return rejectWithValue(error as string);
            }
            if (error.response?.status === 404) {
                return rejectWithValue("Пользователь не найден, проверьте корректность введенных данных");
            }
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const reposSlice = createSlice({
    name: 'repos',
    initialState,
    reducers: {
        resetRepos: (state) => {
            state.repos = [];
            state.page = 1;
            state.hasMore = true;
            state.error = null;
        },
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRepos.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchRepos.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.page === 1) {
                state.repos = action.payload.repos;
            } else {
                state.repos = [...state.repos, ...action.payload.repos];
            }
            state.page = action.payload.page;
            state.hasMore = action.payload.repos.length === 20;
        });
        builder.addCase(fetchRepos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { resetRepos, setUsername } = reposSlice.actions;
export default reposSlice.reducer;
