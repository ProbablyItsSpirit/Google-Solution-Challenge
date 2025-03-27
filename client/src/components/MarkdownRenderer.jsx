import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Typography, Paper } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <Box sx={{ fontFamily: 'inherit' }}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <Typography variant="h4" gutterBottom fontWeight="bold" {...props} />,
          h2: ({ node, ...props }) => <Typography variant="h5" gutterBottom fontWeight="bold" {...props} />,
          h3: ({ node, ...props }) => <Typography variant="h6" gutterBottom fontWeight="bold" {...props} />,
          h4: ({ node, ...props }) => <Typography variant="subtitle1" gutterBottom fontWeight="bold" {...props} />,
          h5: ({ node, ...props }) => <Typography variant="subtitle2" gutterBottom fontWeight="bold" {...props} />,
          h6: ({ node, ...props }) => <Typography variant="subtitle2" gutterBottom fontWeight="bold" {...props} />,
          p: ({ node, ...props }) => <Typography variant="body1" paragraph {...props} />,
          a: ({ node, ...props }) => <Typography component="a" color="primary" {...props} />,
          ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 2, mb: 2 }} {...props} />,
          ol: ({ node, ...props }) => <Box component="ol" sx={{ pl: 2, mb: 2 }} {...props} />,
          li: ({ node, ...props }) => <Typography component="li" variant="body1" sx={{ mb: 1 }} {...props} />,
          blockquote: ({ node, ...props }) => (
            <Paper elevation={0} sx={{ pl: 2, py: 1, borderLeft: '4px solid', borderColor: 'grey.300', mb: 2, bgcolor: 'grey.50' }}>
              <Typography {...props} />
            </Paper>
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <Typography
                component="code"
                sx={{
                  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  bgcolor: 'grey.100',
                  p: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                }}
                {...props}
              >
                {children}
              </Typography>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
