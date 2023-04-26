import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tree-grid',
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.css']
})
export class TreeGridComponent implements OnInit {

  public debug: boolean = false;
  public gridSize: number = 2.5;

  public treeGrid: TreeGrid[] = [];
  public rowLength: number = 1;
  public gridRows: TreeGrid[][] = [];
  public selectedTree?: TreeGrid;
  public lastSelectedTree?: TreeGrid;

  public isLegendClosed: boolean = true;

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

  afterGet(): void {

    const max = Math.max(...this.treeGrid.map(o => o.scenicScore));
    var index = this.treeGrid.findIndex(o => o.scenicScore === max);
    this.treeGrid[index].highscore = true;

    this.rowLength = this.treeGrid[this.treeGrid.length - 1].data;
    var gridLength = this.treeGrid.length - 1;

    for (var i = 0; i < gridLength / this.rowLength; i++) {
      this.gridRows.push(this.treeGrid.slice(this.rowLength * i, this.rowLength * (i + 1)));
    }

  }

  regenForest(): void {
    this.treeGrid = [];
    this.gridRows = [];
    this.http.get<TreeGrid[]>(this.baseUrl + 'treegridapi/gengrid')
      .subscribe({
        next: (r) => this.treeGrid = r,
        error: (e) => console.error(e),
        complete: () => this.afterGet(),
      });
  }

  loadForest(filename: string): void {
    this.treeGrid = [];
    this.gridRows = [];
    this.http.get<TreeGrid[]>(this.baseUrl + 'treegridapi/gengrid/' + filename)
      .subscribe({
        next: (r) => this.treeGrid = r,
        error: (e) => console.error(e),
        complete: () => this.afterGet(),
      });
  }

  selectTree(tree?: TreeGrid): void {
    if (this.selectedTree === tree)
      tree = undefined;

    this.lastSelectedTree = this.selectedTree ?? tree;
    this.selectedTree = tree;


    var index = this.treeGrid.findIndex(o => o === this.lastSelectedTree);
    this.treeGrid[index].selected = false;
    index = this.treeGrid.findIndex(o => o === this.selectedTree);
    if (this.treeGrid[index])
      this.treeGrid[index].selected = true;
  }

  noSelect(): void {
    var index = this.treeGrid.findIndex(o => o === this.lastSelectedTree);
    this.treeGrid[index].selected = false;

    this.lastSelectedTree = undefined;
    this.selectedTree = undefined;
  }

  toggleLegend(): boolean {
    this.isLegendClosed = !this.isLegendClosed;
    return this.isLegendClosed;
  }

  makeArray(n: number): number[] {
    return new Array(n).fill(0).map((n, index) => index + 1);
  }

}

interface TreeGrid {
  data: number;
  visible: boolean;
  scenicScore: number;
  direction: boolean[];
  scores: number[];
  highscore: boolean;
  selected: boolean;
}

/*
		public byte Data;
		public bool Visible;
		public long ScenicScore;
		public bool[] Direction;
		public int[] Scores;
*/
