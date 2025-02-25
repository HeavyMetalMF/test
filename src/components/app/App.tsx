import {ChangeEvent, FC, useCallback, useRef} from 'react';
import {
  TextField,
  Container,
  CircularProgress,
  Typography,
} from '@mui/material';
import {AppDispatch, RootState} from "../../store/store";
import {fetchRepos, resetRepos, setUsername} from "../../store/slices/reposSlice";
import RepoCard from "../repoCard/RepoCard";
import './app.scss';
import {useAppDispatch, useAppSelector} from "../../store/hooks/store-hooks";

const App: FC = () => {
  const dispatch = useAppDispatch<AppDispatch>();
  const { repos, loading, error, page, hasMore, username } = useAppSelector(
      (state: RootState) => state.repos
  );

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(setUsername(value));
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      dispatch(resetRepos());
      if (value.trim() !== '') {
        dispatch(fetchRepos({ username: value, page: 1 }));
      }
    }, 500);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastRepoElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            dispatch(fetchRepos({ username, page: page + 1 }));
          }
        });
        if (node) observer.current.observe(node);
      },
      [loading, hasMore, username, page]
  );

  return (
      <Container className="app__container" maxWidth="md">
        <TextField
            label="Введите имя пользователя GitHub"
            variant="outlined"
            fullWidth
            value={username}
            onChange={handleSearchChange}
        />
        {error && (
            <Typography color="error" className="app__error">
              {error}
            </Typography>
        )}
        {repos.map((repoItem, index) => {
          // Для последнего элемента в списке навешиваем ref для триггера бесконечной прокрутки
          if (index === repos.length - 1) {
            return (
                <div ref={lastRepoElementRef} key={repoItem.id}>
                  <RepoCard key={repoItem.id} repoItem={repoItem} />
                </div>
            );
          }
          return <RepoCard key={repoItem.id} repoItem={repoItem} />;
        })}
        {loading && (
            <div className="app__loading">
              <CircularProgress />
            </div>
        )}
      </Container>
  );
};

export default App;
