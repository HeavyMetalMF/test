import {FC} from 'react';
import {
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
} from '@mui/material';
import {Repo} from "../../shared/types";
import './RepoCard.scss';

interface CardProps {
    repoItem: Repo
}

const RepoCard: FC<CardProps> = ({repoItem}) => {
    return (
        <Card className="repo-card" key={repoItem.id}>
            <CardContent>
                <Typography variant="h5">{repoItem.name}</Typography>
                {repoItem.description && (
                    <Typography variant="body2" color="textSecondary">
                        {repoItem.description}
                    </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                    Stars: {repoItem.stargazers_count}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Последнее обновление: {new Date(repoItem.updated_at).toLocaleString()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" href={repoItem.html_url} target="_blank">
                    Перейти на GitHub
                </Button>
            </CardActions>
        </Card>
    );
};

export default RepoCard;