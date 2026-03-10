import { Injectable } from '@angular/core';

export interface Template {
  category: '学习' | '工作' | '锻炼';
  content: string;
  default_duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templates: Template[] = [
    { category: '学习', content: 'Python 编程学习', default_duration: 60 },
    { category: '学习', content: '阅读技术书籍', default_duration: 45 },
    { category: '学习', content: '英语学习', default_duration: 30 },
    { category: '学习', content: '阅读《原子习惯》', default_duration: 45 },
    { category: '工作', content: '撰写项目文档', default_duration: 90 },
    { category: '工作', content: '代码审查', default_duration: 30 },
    { category: '工作', content: '会议讨论', default_duration: 60 },
    { category: '工作', content: '需求分析', default_duration: 45 },
    { category: '锻炼', content: '晨跑', default_duration: 30 },
    { category: '锻炼', content: '力量训练', default_duration: 45 },
    { category: '锻炼', content: '瑜伽', default_duration: 30 },
    { category: '锻炼', content: '游泳', default_duration: 60 },
  ];

  getTemplates(): Template[] {
    return this.templates;
  }

  getTemplatesByCategory(category: string): Template[] {
    return this.templates.filter(t => t.category === category);
  }
}
