import React, { useState, useEffect } from 'react';
import SimpleMarkdownRenderer from './SimpleMarkdownRenderer';

// The component starts with the simple renderer
const ConditionalMarkdownRenderer = ({ content }) => {
  const [Renderer, setRenderer] = useState(() => SimpleMarkdownRenderer);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to dynamically import the full renderer
    import('./MarkdownRenderer.jsx')
      .then(module => {
        setRenderer(() => module.default);
        setIsLoading(false);
      })
      .catch(err => {
        console.warn("Using SimpleMarkdownRenderer as fallback - please run install-dependencies.bat");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading markdown renderer...</div>;
  }

  return <Renderer content={content} />;
};

export default ConditionalMarkdownRenderer;
