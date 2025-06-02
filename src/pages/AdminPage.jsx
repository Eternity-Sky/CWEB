import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import fs from 'fs/promises';
import path from 'path';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AdminPage() {
  const [tabValue, setTabValue] = useState(0);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 编辑对话框状态
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'tutorial'
  const [dialogAction, setDialogAction] = useState(''); // 'add', 'edit'
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});

  // 删除确认对话框状态
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      }
      
      const files = await fs.readdir(tutorialsDir);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      const tutorialsData = await Promise.all(
        mdFiles.map(async (file) => {
          const filePath = path.join(tutorialsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const title = content.split('\n')[0].replace('#', '').trim();
          const stats = await fs.stat(filePath);
          
          return {
            id: file,
            title,
            content,
            created_at: stats.birthtime
          };
        })
      );
      
      setTutorials(tutorialsData);
      
    } catch (error) {
      console.error('获取数据失败:', error);
      setError('获取数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 打开添加/编辑对话框
  const handleOpenDialog = (type, action, item = null) => {
    setDialogType(type);
    setDialogAction(action);
    setCurrentItem(item);
    
    if (action === 'edit' && item) {
      setFormData({ ...item });
    } else {
      setFormData({ title: '', content: '' });
    }
    
    setOpenDialog(true);
  };

  // 关闭对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteDialog(false);
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 保存数据
  const handleSave = async () => {
    try {
      const fileName = formData.id || `${formData.title.toLowerCase().replace(/\s+/g, '-')}.md`;
      const tutorialsDir = path.join(process.cwd(), 'src', 'tutorials');
      
      try {
        await fs.access(tutorialsDir);
      } catch (err) {
        // 如果目录不存在，创建它
        await fs.mkdir(tutorialsDir, { recursive: true });
      }
      
      const filePath = path.join(tutorialsDir, fileName);
      await fs.writeFile(filePath, `# ${formData.title}\n\n${formData.content}`);
      
      // 刷新数据
      fetchData();
      handleCloseDialog();
      
    } catch (error) {
      console.error('保存数据失败:', error);
      setError('保存数据失败，请稍后再试');
    }
  };

  // 打开删除确认对话框
  const handleDeleteConfirm = (type, item) => {
    setDialogType(type);
    setItemToDelete(item);
    setDeleteDialog(true);
  };

  // 删除数据
  const handleDelete = async () => {
    try {
      const tutorialsDir = path.join(process.cwd(), 'src', 'tutorials');
      const filePath = path.join(tutorialsDir, itemToDelete.id);
      await fs.unlink(filePath);
      
      // 刷新数据
      fetchData();
      handleCloseDialog();
      
    } catch (error) {
      console.error('删除数据失败:', error);
      setError('删除数据失败，请稍后再试');
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        管理后台
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="教程管理" />
        </Tabs>
        
        {/* 教程管理 */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog('tutorial', 'add')}
            >
              添加教程
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>标题</TableCell>
                  <TableCell>创建时间</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tutorials.map((tutorial) => (
                  <TableRow key={tutorial.id}>
                    <TableCell>{tutorial.title}</TableCell>
                    <TableCell>{new Date(tutorial.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog('tutorial', 'edit', tutorial)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteConfirm('tutorial', tutorial)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {tutorials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">暂无数据</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
      
      {/* 添加/编辑对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogAction === 'add' ? '添加' : '编辑'}教程
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="标题"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="内容"
            name="content"
            multiline
            rows={15}
            value={formData.content || ''}
            onChange={handleInputChange}
            placeholder="使用Markdown格式编写教程内容"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 删除确认对话框 */}
      <Dialog open={deleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除这个教程？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminPage;