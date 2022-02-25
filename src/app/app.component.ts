import {
  Component,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';

let content: any = '';
let selection: {content?: any, page?: number} = {};
let opcao2: {page?: number, texto?:string, coords?: any[]} = {};
let globalSelection: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{

  @ViewChild('pdfViewerOnDemand') pdfViewerOnDemand!: PdfJsViewerComponent;

  title = 'NG2PDF-Viewer LAB';
  pdfSrc = "/assets/Metro_Versao_Consolidada_PUBLICA.pdf";

  viewer: any;
  textoSelecionado = '';
  tags2: {page?: number, texto?:string, coords?: any[]}[] = [];
  tagSelecionada: {page?: number, texto?:string, coords?: any[]}

  get opcao2Value(): any {
    return opcao2;
  }

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit(): void {
  }

  private downloadFile(url: string): any {
    return this.http.get(url, { responseType: 'blob' })
        .pipe(
            map((result: any) => {
                return result;
            })
        );
  }

  public openPdf() {

    let url = "/assets/Metro_Versao_Consolidada_PUBLICA.pdf"; // E.g. http://localhost:3000/api/GetMyPdf

    this.downloadFile(url).subscribe(
      (res: any) => {
          this.pdfViewerOnDemand.pdfSrc = res; // pdfSrc can be Blob or Uint8Array
          this.pdfViewerOnDemand.refresh(); // Ask pdf viewer to load/reresh pdf
        }
      );
  }

  // public testBeforePrint(): any {
  //   console.log('testBeforePrint');
  // }

  // public testAfterPrint(): any {
  //   console.log('testAfterPrint');
  // }

  public testPagesLoaded(event: any): void {
    // console.log('testPagesLoaded');
    this.viewer = this.pdfViewerOnDemand.PDFViewerApplication;
    this.pdfViewerOnDemand.PDFViewerApplication.appConfig.viewerContainer.onmouseup = this.selectedText;
  }

  public testPageChange(event: any): void {
    // console.log('testPageChange');
    // console.log(event);
    var page = this.pdfViewerOnDemand.PDFViewerApplication.pdfViewer.getPageView(event);
    console.log(page);
    if(this.tagSelecionada && page.canvas) {
      var pageTags = this.getPageTags(event);
      if(pageTags && pageTags.length){
        pageTags.forEach(t => this.showHighlight(t))
        ;
      }
    }
  }

  public comentar(): void {
    this.getHightlightCoords();
    this.showHighlight(opcao2);
  }

  selectedText(event): void {
    selection.content = event.view.getSelection().toString();
    selection.page = event.view.PDFViewerApplication.page;
    content = event.view.getSelection().toString();
    globalSelection = event.view.getSelection()
  }

  get contentSelected() { return content; }

  public show2(event, tag: {page?: number, texto?:string, coords?: any[]}): void {
    this.tagSelecionada = tag;
    this.textoSelecionado = tag.texto;
    this.pdfViewerOnDemand.PDFViewerApplication.pdfViewer.currentPageNumber = tag.page;
    event.preventDefault();
  }


  public getHightlightCoords(): any {
    // console.log('PDFApplication');
    // console.log(this.pdfViewerOnDemand.PDFViewerApplication);
    // console.log(this.pdfViewerOnDemand.PDFViewerApplication.pdfViewer.currentPageNumber);
    // console.log(this.pdfViewerOnDemand.PDFViewerApplication.pdfViewer.getPageView(pageIndex));
    var pageIndex = this.viewer.pdfViewer.currentPageNumber;
    var page = this.viewer.pdfViewer.getPageView(pageIndex);
    console.log(page);
    var pageRect = page.canvas.getClientRects()[0];
    var selectionRects: any[] = globalSelection.getRangeAt(0).getClientRects();
    var viewport = page.viewport;
    var selected: any[] = [];

    for(let i = 0; i < selectionRects.length; i++) {
      const value: DOMRect = selectionRects[i];
      selected.push(viewport.convertToPdfPoint(value.left - pageRect.x, value.top - pageRect.y).concat(
        viewport.convertToPdfPoint(value.right - pageRect.x, value.bottom - pageRect.y)));
    }

    opcao2 = {page: pageIndex, texto: content, coords: selected};
    this.tags2.push(opcao2);
    return opcao2

  }

  public showHighlight(selected) {

    // console.log(selected);

    var pageIndex = selected.page;
    var page = this.viewer.pdfViewer.getPageView(pageIndex);
    var pageElement = page.canvas.parentElement;
    var viewport = page.viewport;
    selected.coords.forEach(function (rect) {
      var bounds = viewport.convertToViewportRectangle(rect);
      var el = document.createElement('div');
      el.setAttribute('style', 'position: absolute; background-color: pink; opacity: 0.3;' +
        'left:' + Math.min(bounds[0], bounds[2]) + 'px; top:' + Math.min(bounds[1], bounds[3]) + 'px;' +
        'width:' + Math.abs(bounds[0] - bounds[2]) + 'px; height:' + Math.abs(bounds[1] - bounds[3]) + 'px;');
      pageElement.appendChild(el);
    });

  }

  private getPageTags(page: number): {page?: number, texto?:string, coords?: any[]} [] {
    var pageTags:{page?: number, texto?:string, coords?: any[]}[] = this.tags2.filter(t => t.page === page);
    return pageTags;
  }


}
