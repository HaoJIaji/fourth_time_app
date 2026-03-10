import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Activity } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  currentTab: 'today' | 'week' | 'month' = 'today';
  
  // 统计数据
  totalHours: number = 0;
  recordCount: number = 0;
  streakDays: number = 0;
  mostFrequent: string = '暂无记录';
  
  // 分类统计
  categoryStats: { [category: string]: { total_min: number; count: number } } = {};
  dailyStats: { [date: string]: { [category: string]: number } } = {};
  
  // 颜色配置
  colors: { [key: string]: string } = {
    '学习': '#4A90D9',
    '工作': '#E74C3C',
    '锻炼': '#27AE60',
    'primary': '#6C5CE7'
  };

  // 最近7天日期
  weekDates: string[] = [];

  constructor(private dataService: DataService) {
    this.generateWeekDates();
  }

  ngOnInit() {
    this.refreshStats();
  }

  generateWeekDates() {
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      this.weekDates.push(date.toISOString().split('T')[0]);
    }
  }

  refreshStats() {
    const today = new Date();
    let startDate: Date;
    let endDate: Date = today;

    switch (this.currentTab) {
      case 'today':
        startDate = today;
        endDate = today;
        break;
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
    }

    const startStr = startDate!.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    // 获取统计数据
    this.categoryStats = this.dataService.getStatsByDateRange(startStr, endStr);
    this.dailyStats = this.dataService.getDailyStats(7);
    
    const totalStats = this.dataService.getTotalStats();
    this.streakDays = this.dataService.getStreakDays();
    
    // 计算总时长和记录数
    const totalMin = Object.values(this.categoryStats).reduce((sum, s) => sum + s.total_min, 0);
    this.totalHours = totalMin / 60;
    this.recordCount = Object.values(this.categoryStats).reduce((sum, s) => sum + s.count, 0);
    this.mostFrequent = totalStats.most_frequent || '暂无记录';
  }

  onTabChange(tab: 'today' | 'week' | 'month') {
    this.currentTab = tab;
    this.refreshStats();
  }

  getCategoryPercentage(category: string): number {
    const total = Object.values(this.categoryStats).reduce((sum, s) => sum + s.total_min, 0);
    if (total === 0) return 0;
    return (this.categoryStats[category]?.total_min || 0) / total * 100;
  }

  getCategoryHours(category: string): number {
    return (this.categoryStats[category]?.total_min || 0) / 60;
  }

  getDailyTotal(date: string): number {
    const dayData = this.dailyStats[date] || {};
    return Object.values(dayData).reduce((sum, min) => sum + min, 0) / 60;
  }

  getMaxDailyTotal(): number {
    const totals = this.weekDates.map(d => this.getDailyTotal(d));
    return Math.max(...totals, 1);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  getBarHeight(date: string): number {
    const max = this.getMaxDailyTotal();
    const total = this.getDailyTotal(date);
    return max > 0 ? (total / max * 100) : 0;
  }
}
