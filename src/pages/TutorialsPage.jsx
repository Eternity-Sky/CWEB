import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button, Chip, CircularProgress, Divider, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, School } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';

function TutorialsPage() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    setLoading(true);
    setError(null);

    try {
      // 读取tutorials目录下的所有.md文件
      const tutorialsDir = path.join(process.cwd(), 'src', 'tutorials');
      
      try {
        await fs.access(tutorialsDir);
      } catch (err) {
        // 如果目录不存在，创建它
        await fs.mkdir(tutorialsDir, { recursive: true });
        // 创建一个欢迎文件
        const welcomeFilePath = path.join(tutorialsDir, 'welcome.md');
        const welcomeContent = '# 欢迎使用C语言教程\n\n这是一个示例教程文件，您可以在管理后台添加更多教程内容。';
        await fs.writeFile(welcomeFilePath, welcomeContent);
      }
      
      const files = await fs.readdir(tutorialsDir);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      const tutorialsData = await Promise.all(
        mdFiles.map(async (file) => {
          const filePath = path.join(tutorialsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const title = content.split('\n')[0].replace('#', '').trim();
          const stats = await fs.stat(filePath);
          
          // 从文件名或内容中提取难度级别，默认为初级
          let level = 'beginner';
          if (content.includes('## 难度: 中级') || file.includes('intermediate')) {
            level = 'intermediate';
          } else if (content.includes('## 难度: 高级') || file.includes('advanced')) {
            level = 'advanced';
          }
          
          return {
            id: file,
            title,
            content,
            level,
            created_at: stats.birthtime
          };
        })
      );
      
      setTutorials(tutorialsData);
    } catch (error) {
      console.error('获取教程失败:', error);
      setError('获取教程失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 过滤教程
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || tutorial.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // 获取难度级别的中文名称
  const getLevelName = (level) => {
    switch (level) {
      case 'beginner': return '初级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return level;
    }
  };

  // 获取难度级别的颜色
  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'primary';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        C语言教程
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          从基础语法到高级应用，我们的C语言教程将帮助你掌握这门强大的编程语言。
          无论你是初学者还是想要提高技能的程序员，这里都有适合你的内容。
        </Typography>
      </Box>

      {/* 搜索和筛选 */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索教程..."
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
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="全部" 
            onClick={() => setSelectedLevel('all')} 
            color={selectedLevel === 'all' ? 'primary' : 'default'}
            variant={selectedLevel === 'all' ? 'filled' : 'outlined'}
          />
          <Chip 
            label="初级" 
            onClick={() => setSelectedLevel('beginner')} 
            color={selectedLevel === 'beginner' ? 'success' : 'default'}
            variant={selectedLevel === 'beginner' ? 'filled' : 'outlined'}
          />
          <Chip 
            label="中级" 
            onClick={() => setSelectedLevel('intermediate')} 
            color={selectedLevel === 'intermediate' ? 'primary' : 'default'}
            variant={selectedLevel === 'intermediate' ? 'filled' : 'outlined'}
          />
          <Chip 
            label="高级" 
            onClick={() => setSelectedLevel('advanced')} 
            color={selectedLevel === 'advanced' ? 'error' : 'default'}
            variant={selectedLevel === 'advanced' ? 'filled' : 'outlined'}
          />
        </Box>
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

      {/* 教程列表 */}
      {!loading && !error && (
        <>
          {filteredTutorials.length === 0 ? (
            <Box sx={{ my: 4, textAlign: 'center' }}>
              <Typography variant="h6">没有找到匹配的教程</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredTutorials.map((tutorial) => (
                <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <School color="primary" sx={{ mr: 1 }} />
                        <Chip 
                          label={getLevelName(tutorial.level)} 
                          size="small" 
                          color={getLevelColor(tutorial.level)} 
                          sx={{ ml: 'auto' }} 
                        />
                      </Box>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {tutorial.title}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {tutorial.content.substring(0, 150)}...
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary" component={Link} to={`/tutorials/${tutorial.id}`}>
                        阅读全文
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}

export default TutorialsPage;