import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  LinearProgress,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    background: value >= 80 
      ? theme.palette.success.main 
      : value >= 70 
        ? theme.palette.warning.main 
        : theme.palette.error.main,
  },
}));

const GradingResultCard = ({ gradingResults }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!gradingResults) return null;
  
  const { totalScore, maxScore, feedback = [] } = gradingResults;
  const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  
  return (
    <Card variant="outlined" sx={{ mb: 2, overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AssignmentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Grading Results</Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body1" fontWeight="bold">
              Score: {totalScore}/{maxScore}
            </Typography>
            <Chip 
              label={`${Math.round(scorePercentage)}%`}
              color={
                scorePercentage >= 80 
                  ? 'success' 
                  : scorePercentage >= 70 
                    ? 'warning' 
                    : 'error'
              }
              size="small"
            />
          </Box>
          <ProgressBar variant="determinate" value={scorePercentage} />
        </Box>
        
        <Button
          variant="outlined"
          size="small"
          onClick={() => setExpanded(!expanded)}
          startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mb: 1 }}
        >
          {expanded ? 'Hide Details' : 'Show Question Details'}
        </Button>
        
        <Collapse in={expanded} timeout="auto">
          <List component={Paper} variant="outlined" sx={{ mt: 1 }}>
            {feedback.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.correct 
                          ? <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                          : <CancelIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                        }
                        <Typography variant="subtitle2">
                          Question {item.q}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">{item.remarks}</Typography>
                        {item.refPage && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <MenuBookIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              Reference: Page {item.refPage}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default GradingResultCard;
