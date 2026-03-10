import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class RecordComponent implements OnInit, OnDestroy {
  category: '学习' | '工作' | '锻炼' = '学习';
  content: string = '';
  duration: number = 30;
  note: string = '';
  
  // 计时器模式
  isTimerMode: boolean = false;
  timerRunning: boolean = false;
  timerSeconds: number = 0;
  timerDisplay: string = '00:00:00';
  private timerInterval: any;
  private startTime: Date | null = null;
  
  // 模板
  templates = this.templateService.getTemplates();
  selectedTemplate: string = '';

  // 快捷时长
  quickDurations = [15, 30, 45, 60];

  constructor(
    private dataService: DataService,
    private templateService: TemplateService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.stopTimer();
  }

  onTemplateSelect() {
    if (this.selectedTemplate) {
      const parts = this.selectedTemplate.split(': ');
      if (parts.length === 2) {
        this.category = parts[0] as '学习' | '工作' | '锻炼';
        this.content = parts[1];
        
        // 查找对应的默认时长
        const template = this.templates.find(t => 
          t.category === this.category && t.content === this.content
        );
        if (template) {
          this.duration = template.default_duration;
        }
      }
    }
  }

  setQuickDuration(minutes: number) {
    this.duration = minutes;
  }

  toggleTimer() {
    if (!this.timerRunning) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  startTimer() {
    if (!this.content.trim()) {
      alert('请先输入行为内容');
      return;
    }
    
    this.timerRunning = true;
    this.startTime = new Date();
    this.timerSeconds = 0;
    
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      this.updateTimerDisplay();
    }, 1000);
  }

  stopTimer() {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
    
    // 计算时长并切换到手动模式
    const minutes = Math.max(1, Math.floor(this.timerSeconds / 60));
    this.duration = minutes;
    this.isTimerMode = false;
  }

  updateTimerDisplay() {
    const hours = Math.floor(this.timerSeconds / 3600);
    const minutes = Math.floor((this.timerSeconds % 3600) / 60);
    const seconds = this.timerSeconds % 60;
    
    this.timerDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  saveRecord() {
    if (!this.content.trim()) {
      alert('请输入行为内容');
      return;
    }

    if (this.duration <= 0) {
      alert('请输入有效的时长');
      return;
    }

    // 保存记录
    this.dataService.addActivity({
      category: this.category,
      content: this.content.trim(),
      duration_min: this.duration,
      note: this.note.trim()
    });

    // 重置表单
    this.category = '学习';
    this.content = '';
    this.duration = 30;
    this.note = '';
    this.selectedTemplate = '';
    this.timerSeconds = 0;
    this.timerDisplay = '00:00:00';

    // 返回首页
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
