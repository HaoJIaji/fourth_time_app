import { Injectable } from '@angular/core';

export interface Activity {
  id?: number;
  category: '学习' | '工作' | '锻炼';
  content: string;
  duration_min: number;
  start_time?: string;
  end_time?: string;
  record_date: string;
  note?: string;
  created_at?: string;
}

export interface DailyStats {
  [date: string]: {
    [category: string]: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEY = 'shijian_activities';
  private activities: Activity[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.activities = data ? JSON.parse(data) : [];
  }

  private saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.activities));
  }

  // 添加活动记录
  addActivity(activity: Omit<Activity, 'id' | 'record_date' | 'created_at'>): Activity {
    const newActivity: Activity = {
      ...activity,
      id: Date.now(),
      record_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    this.activities.unshift(newActivity);
    this.saveData();
    return newActivity;
  }

  // 获取所有活动记录
  getActivities(
    category?: string,
    startDate?: string,
    endDate?: string,
    keyword?: string,
    limit: number = 100
  ): Activity[] {
    let filtered = [...this.activities];

    if (category && category !== '全部') {
      filtered = filtered.filter(a => a.category === category);
    }

    if (startDate) {
      filtered = filtered.filter(a => a.record_date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(a => a.record_date <= endDate);
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(a => 
        a.content.toLowerCase().includes(lowerKeyword) ||
        (a.note && a.note.toLowerCase().includes(lowerKeyword))
      );
    }

    return filtered.slice(0, limit);
  }

  // 删除活动记录
  deleteActivity(id: number) {
    this.activities = this.activities.filter(a => a.id !== id);
    this.saveData();
  }

  // 更新活动记录
  updateActivity(id: number, updates: Partial<Activity>) {
    const index = this.activities.findIndex(a => a.id === id);
    if (index !== -1) {
      this.activities[index] = { ...this.activities[index], ...updates };
      this.saveData();
    }
  }

  // 获取日期范围内的统计数据
  getStatsByDateRange(startDate: string, endDate: string): { [category: string]: { total_min: number; count: number } } {
    const filtered = this.activities.filter(a => 
      a.record_date >= startDate && a.record_date <= endDate
    );

    const stats: { [category: string]: { total_min: number; count: number } } = {};

    filtered.forEach(activity => {
      if (!stats[activity.category]) {
        stats[activity.category] = { total_min: 0, count: 0 };
      }
      stats[activity.category].total_min += activity.duration_min;
      stats[activity.category].count += 1;
    });

    return stats;
  }

  // 获取每日统计数据
  getDailyStats(days: number = 7): DailyStats {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    const stats: DailyStats = {};

    this.activities.forEach(activity => {
      const activityDate = new Date(activity.record_date);
      if (activityDate >= startDate && activityDate <= endDate) {
        if (!stats[activity.record_date]) {
          stats[activity.record_date] = {};
        }
        if (!stats[activity.record_date][activity.category]) {
          stats[activity.record_date][activity.category] = 0;
        }
        stats[activity.record_date][activity.category] += activity.duration_min;
      }
    });

    return stats;
  }

  // 获取总体统计数据
  getTotalStats() {
    const totalMin = this.activities.reduce((sum, a) => sum + a.duration_min, 0);
    const uniqueDays = new Set(this.activities.map(a => a.record_date)).size;
    const totalCount = this.activities.length;

    // 计算最常进行的活动类型
    const categoryCount: { [key: string]: number } = {};
    this.activities.forEach(a => {
      categoryCount[a.category] = (categoryCount[a.category] || 0) + a.duration_min;
    });

    let mostFrequent: string | null = null;
    let maxDuration = 0;
    for (const [category, duration] of Object.entries(categoryCount)) {
      if (duration > maxDuration) {
        maxDuration = duration;
        mostFrequent = category;
      }
    }

    return {
      total_min: totalMin,
      days_with_records: uniqueDays,
      total_count: totalCount,
      most_frequent: mostFrequent
    };
  }

  // 计算连续记录天数
  getStreakDays(): number {
    if (this.activities.length === 0) return 0;

    const uniqueDates = [...new Set(this.activities.map(a => a.record_date))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    
    let streak = 0;
    let checkDate = new Date();

    for (const dateStr of uniqueDates) {
      const recordDate = new Date(dateStr);
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      if (dateStr === checkDateStr || dateStr === today) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dateStr === new Date(checkDate.getTime() + 86400000).toISOString().split('T')[0]) {
        streak++;
        checkDate = new Date(recordDate.getTime() - 86400000);
      } else {
        break;
      }
    }

    return streak;
  }

  // 导出数据为JSON
  exportToJSON(): string {
    const exportData = {
      export_version: '1.0',
      export_date: new Date().toISOString(),
      records: this.activities
    };
    return JSON.stringify(exportData, null, 2);
  }

  // 从JSON导入数据
  importFromJSON(jsonStr: string, merge: boolean = true): number {
    const data = JSON.parse(jsonStr);
    const records: Activity[] = data.records || [];

    if (!merge) {
      this.activities = [];
    }

    let importedCount = 0;
    records.forEach((record: Activity) => {
      // 检查是否已存在相同ID的记录
      const exists = this.activities.some(a => a.id === record.id);
      if (!exists) {
        this.activities.push(record);
        importedCount++;
      }
    });

    this.saveData();
    return importedCount;
  }

  // 清空所有数据
  clearAllData() {
    this.activities = [];
    this.saveData();
  }
}
