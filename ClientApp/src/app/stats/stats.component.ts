import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartType } from 'angular-google-charts';
import { title } from 'process';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  public treeGrid: TreeGrid[] = [];

  public myCharts: MyChart[] = [];
  public chartType: ChartType = ChartType.ComboChart;
  public myData: any[] = [];
  public myOptions: any;

  public view: any = [];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    http.get<TreeGrid[]>(baseUrl + 'treegridapi')
      .subscribe({
        next: (r) => this.treeGrid = r,
        error: (e) => console.error(e),
        complete: () => this.afterGet(),
      });

  }

  ngOnInit(): void {
  }

  regenForest(): void {
    this.treeGrid = [];
    this.http.get<TreeGrid[]>(this.baseUrl + 'treegridapi/gengrid')
      .subscribe({
        next: (r) => this.treeGrid = r,
        error: (e) => console.error(e),
        complete: () => this.afterGet(),
      });
  }

  loadForest(filename: string): void {
    this.treeGrid = [];
    this.http.get<TreeGrid[]>(this.baseUrl + 'treegridapi/gengrid/' + filename)
      .subscribe({
        next: (r) => this.treeGrid = r,
        error: (e) => console.error(e),
        complete: () => this.afterGet(),
      });
  }

  afterGet(): void {

    this.myData = [];
    for (var i = 0; i < 10; i++) {
      this.myData[i] = [`${i} meter`, this.countTree(i)];
    }
    this.myOptions = {
      width: 350,
      height: 300,
      backgroundColor: 'transparent',
      is3D: true,
      legend: { position: 'none' },
      chartArea: { left: 55, top: 20, bottom: 20, right: 0 },
    };

    this.myCharts[0] = {
      title: 'Tree Heights (m)',
      chartType: ChartType.PieChart,
      myData: this.myData,
      myOptions: this.myOptions,
    };

    this.myData = [];
    for (var i = 0; i < 10; i++) {
      this.myData[i] = [`${i}m`, this.getHighScore(i)];
    }

    this.myOptions = {
      width: 650,
      height: 300,
      backgroundColor: 'transparent',
      is3D: true,
      legend: { position: 'none' },
      chartArea: { left: 55, top: 20, bottom: 20, right: 0 },
    };

    this.myCharts[1] = {
      title: 'Tree High Scores',
      chartType: ChartType.ColumnChart,
      myData: this.myData,
      myOptions: this.myOptions,
    };


    this.myOptions = {
      width: 1000,
      height: 400,
      backgroundColor: 'transparent',
      is3D: true,
      legend: { position: 'none' },
      chartArea: { left: 30, top: 20, width: "100%", height: "90%" },
    };

    this.myData = [];
    for (var i = 0; i < 10; i++) {
      var d = this.countScore(i);
      this.myData[i] = [`${i}m`, d[0], d[1]];
    }

    this.myCharts[2] = {
      title: 'Tree Scores (average, median)',
      chartType: ChartType.BarChart,
      myData: this.myData,
      myOptions: this.myOptions,
    };

  }

  countTree(height: number): number {
    var result = 0;
    // add to result when we find the height in the array.
    for (var i = 0; i < this.treeGrid.length; i++) {
      if (this.treeGrid[i].data === height) {
        result++;
      }
    }

    return result;
  }

  countScore(height: number): number[] {
    var result = [0, 0];
    var count = 0;
    var g: number[] = [];
    for (var i = 0; i < this.treeGrid.length; i++) {
      if (this.treeGrid[i].data === height && this.treeGrid[i].scenicScore > 0) {
        result[0] += this.treeGrid[i].scenicScore;
        count++;
        g.push(this.treeGrid[i].scenicScore);
      }
    }
    if (count !== 0)
      result[0] /= count;

    g = g.sort((a, b) => a - b);
    var m = Math.floor(g.length / 2);
    if (g.length % 2 === 0)
      result[1] = (g[m - 1] + g[m]) / 2;
    else
      result[1] = g[m];

    return result;
  }

  getHighScore(height: number): number {
    var result = 0;
    for (var i = 0; i < this.treeGrid.length; i++) {
      if (this.treeGrid[i].data === height && this.treeGrid[i].scenicScore > result)
        result = this.treeGrid[i].scenicScore;
    }

    return result;
  }

}

interface MyChart {
  title: string;
  chartType: ChartType;
  myData: any;
  myOptions: any;
}

interface TreeGrid {
  data: number;
  visible: boolean;
  scenicScore: number;
  //direction: boolean[];
  //scores: number[];
}
