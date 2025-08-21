import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SEOHead = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const updateMetaTags = () => {
      const lang = i18n.language;
      const isEN = lang === 'en';
      
      // 更新页面标题
      document.title = isEN 
        ? 'SlotPass - Slot Machine Password Generator | Secure Password Tool'
        : 'SlotPass - 老虎机密码生成器 | 安全密码生成工具';
      
      // 更新描述
      const description = isEN
        ? 'SlotPass is a slot machine-style password generator that provides secure and fun password generation. Supports multiple languages, customizable password length and character types.'
        : 'SlotPass是一个老虎机风格的密码生成器，提供安全、有趣的密码生成体验。支持多语言，可自定义密码长度和字符类型，适合个人和企业使用。';
      
      // 更新meta标签
      updateMetaTag('description', description);
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description);
      
      // 更新语言标签
      document.documentElement.lang = lang;
      updateMetaTag('language', lang);
      updateMetaTag('og:locale', isEN ? 'en_US' : 'zh_CN');
      
      // 更新标题
      const title = isEN ? 'SlotPass - Slot Machine Password Generator' : 'SlotPass - 老虎机密码生成器';
      updateMetaTag('og:title', title);
      updateMetaTag('twitter:title', title);
    };

    const updateMetaTag = (name, content) => {
      // 处理property类型的meta标签 (Open Graph)
      let meta = document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        // 处理name类型的meta标签
        meta = document.querySelector(`meta[name="${name}"]`);
      }
      
      if (meta) {
        meta.setAttribute('content', content);
      }
    };

    updateMetaTags();
  }, [i18n.language]);

  return null; // 这个组件不渲染任何内容
};

export default SEOHead;