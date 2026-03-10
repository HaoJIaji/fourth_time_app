import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, Activity } from '../../services/data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class HistoryComponent implements OnInit {
  activities: Activity[] = [];
  
  // 筛选条件
  filterCategory: string = '全部';
  filterDate: string = '全部';
  searchKeyword: string = '';

  // 颜色配置
  colors: { [key: string]: string } = {
    '学习': '#4A90D9',
    '工作': '#E74C3C',
    '锻炼': '#27AE60'
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    let startDate: string | undefined;
    let endDate: string | undefined;

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    switch (this.filterDate) {
      case '今天':
        startDate = today;
        endDate = today;
        break;
      case '本周':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        startDate = weekStart.toISOString().split('T')[0];
        endDate = today;
        break;
      case '本月':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = monthStart.toISOString().split('T')[0];
        endDate = today;
        break;
    }

    const category = this.filterCategory === '全部' ? undefined : this.filterCategory;
    const keyword = this.searchKeyword.trim() || undefined;

    this.activities = this.dataService.getActivities(
      category,
      startDate,
      endDate,
      keyword,
      100
    );
  }

  onFilterChange() {
    this.loadActivities();
  }

  onSearchChange() {
    this.loadActivities();
  }

  deleteActivity(id: number | undefined) {
    if (id && confirm('确定要删除这条记录吗？')) {
      this.dataService.deleteActivity(id);
      this.loadActivities();
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  }
}
