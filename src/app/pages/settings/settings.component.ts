import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class SettingsComponent implements OnInit {
  appVersion: string = '1.0.0';

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/']);
  }

  exportData() {
    const jsonStr = this.dataService.exportToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `shijian_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          try {
            const count = this.dataService.importFromJSON(event.target.result, true);
            alert(`成功导入 ${count} 条记录`);
          } catch (error) {
            alert('导入失败：文件格式错误');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  }

  clearAllData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      this.dataService.clearAllData();
      alert('所有数据已清空');
    }
  }
}
