export interface Repo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    updated_at: string;
}

export interface ReposState {
    repos: Repo[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
    username: string;
}