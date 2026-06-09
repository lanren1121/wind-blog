// 日期、内容格式化

// 日期格式化
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// 相对时间格式化（如：2小时前，3天前）
const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 30) return `${diffDays}天前`;
  if (diffMonths < 12) return `${diffMonths}个月前`;
  return `${diffYears}年前`;
};

// 内容截断
const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

// 数字格式化（千分位分隔符）
const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 文本转HTML安全格式
const escapeHtml = (text) => {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 格式化阅读时间
const formatReadingTime = (wordsCount) => {
  const wordsPerMinute = 200; // 平均阅读速度
  const minutes = Math.ceil(wordsCount / wordsPerMinute);
  return minutes < 1 ? '1分钟内' : `${minutes}分钟`;
};

// 将文本转换为URL友好的slug格式
const textToSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 将空格和下划线替换为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
};

export const format = {
  formatDate,
  formatRelativeTime,
  truncateText,
  formatNumber,
  escapeHtml,
  generateId,
  formatReadingTime,
  textToSlug
};