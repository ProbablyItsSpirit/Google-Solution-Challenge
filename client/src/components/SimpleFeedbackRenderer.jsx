import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * An extremely simple renderer that just formats sections with basic HTML
 */
const SimpleFeedbackRenderer = ({ content }) => {
  if (!content) return null;

  // Format important parts with styling
  const formatContent = (text) => {
    // Bold the section titles and add spacing
    return text
      .split('\n')
      .map((line, index) => {
        if (line.match(/^\d+\.\s+[A-Z]/)) {
          // This looks like a section heading like "1. Overall Grade:"
          return (
            <Typography 
              key={index} 
              variant="h6" 
              sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}
            >
              {line}
            </Typography>
          );
        } else if (line.match(/^\*\*([^*]+)\*\*/)) {
          // Handle bold text with markdown-style ** markers
          const boldText = line.replace(/\*\*([^*]+)\*\*/g, '$1');
          return (
            <Typography 
              key={index} 
              variant="subtitle1"
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              {boldText}
            </Typography>
          );
        }
        
        // Handle normal paragraphs
        return (
          <Typography key={index} variant="body1" paragraph>
            {line}
          </Typography>
        );
      });
  };

  return (
    <Box sx={{ fontFamily: 'inherit' }}>
      {formatContent(content)}
    </Box>
  );
};

export default SimpleFeedbackRenderer;
