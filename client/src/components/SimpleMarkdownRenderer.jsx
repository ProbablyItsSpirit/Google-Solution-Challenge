import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

/**
 * A simple markdown-like renderer that doesn't require external dependencies.
 * This is a fallback for when react-markdown is not available.
 */
const SimpleMarkdownRenderer = ({ content }) => {
  if (!content) return null;

  // Very basic processing of common markdown elements
  const processContent = (text) => {
    // Process headings
    let processed = text
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      
      // Process bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Process lists
      .replace(/^\s*\*\s(.*$)/gm, '<li>$1</li>')
      
      // Process code blocks (simple version)
      .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
      
      // Process paragraphs - split by double newlines
      .split(/\n\n+/).map(p => {
        // Don't wrap already wrapped content
        if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<li')) {
          return p;
        }
        return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
      }).join('');

    return processed;
  };

  return (
    <Box sx={{ fontFamily: 'inherit' }}>
      <div dangerouslySetInnerHTML={{ __html: processContent(content) }} />
    </Box>
  );
};

export default SimpleMarkdownRenderer;
