import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button, TextField, InputAdornment, CircularProgress, Divider, Paper } from '@mui/material';
import { Search as SearchIcon, Code } from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function ExamplesPage() {
  const { supabase } = useSupabase();
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedExample, setExpandedExample] = useState(null);

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('examples')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExamples(data || []);
    } catch (error) {
      console.error('获取示例代码失败:', error);
      setError('获取示例代码失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 过滤示例代码
  const filteredExamples = examples.filter(example => {
    return example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           example.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 切换展开/折叠代码
  const toggleExample = (id) => {
    setExpandedExample(expandedExample === id ? null : id);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        C语言代码示例
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          浏览我们精选的C语言代码示例，包括常见算法、数据结构和实际应用场景。
          这些示例将帮助你更好地理解C语言的实际应用，提高编程技能。
        </Typography>
      </Box>

      {/* 搜索框 */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索示例代码..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* 加载状态 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* 错误信息 */}
      {error && (
        <Box sx={{ my: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* 示例代码列表 */}
      {!loading && !error && (
        <>
          {filteredExamples.length === 0 ? (
            <Box sx={{ my: 4, textAlign: 'center' }}>
              <Typography variant="h6">没有找到匹配的示例代码</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredExamples.map((example) => (
                <Grid item xs={12} key={example.id}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Code color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h2">
                        {example.title}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body1" paragraph>
                      {example.description}
                    </Typography>
                    
                    {expandedExample === example.id ? (
                      <Box sx={{ mt: 2 }}>
                        <SyntaxHighlighter language="c" style={docco} showLineNumbers>
                          {example.code}
                        </SyntaxHighlighter>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          onClick={() => toggleExample(example.id)}
                          sx={{ mt: 2 }}
                        >
                          收起代码
                        </Button>
                      </Box>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => toggleExample(example.id)}
                        sx={{ mt: 2 }}
                      >
                        查看代码
                      </Button>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}

export default ExamplesPage;