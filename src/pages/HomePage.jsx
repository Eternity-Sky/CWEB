import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Grid, Card, CardContent, CardActions, Box, Container } from '@mui/material';
import { School, Code, AdminPanelSettings } from '@mui/icons-material';

function HomePage() {
  const features = [
    {
      title: 'C语言教程',
      description: '从基础到高级的C语言教程，包含详细的语法解释和实例代码。适合初学者和想要提高的程序员。',
      icon: <School fontSize="large" color="primary" />,
      link: '/tutorials'
    },
    {
      title: '代码示例',
      description: '丰富的C语言代码示例，涵盖常见算法、数据结构和实际应用场景，帮助你理解和应用C语言。',
      icon: <Code fontSize="large" color="primary" />,
      link: '/examples'
    },
    {
      title: '在线编译器',
      description: '在线编写、编译和运行C语言代码，无需安装本地环境，随时随地学习和实践。',
      icon: <AdminPanelSettings fontSize="large" color="primary" />,
      link: '/compiler'
    }
  ];

  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          欢迎来到C语言学习网
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          一站式C语言学习平台，从入门到精通
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" component={Link} to="/tutorials" sx={{ mx: 1 }}>
            开始学习
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/register" sx={{ mx: 1 }}>
            注册账号
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  {feature.title}
                </Typography>
                <Typography align="center">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" color="primary" component={Link} to={feature.link}>
                  了解更多
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          为什么选择我们？
        </Typography>
        <Typography variant="body1" paragraph>
          我们提供全面的C语言学习资源，从基础语法到高级应用，帮助你成为C语言专家。
          注册账号后，你可以保存学习进度，参与社区讨论，获取个性化学习建议。
        </Typography>
      </Box>
    </Container>
  );
}

export default HomePage;