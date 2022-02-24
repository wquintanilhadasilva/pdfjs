import {
  Component,
  ViewChild,
  HostListener,
  ElementRef,
  AfterViewInit,
  Inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';

import { DOCUMENT } from '@angular/common';

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
  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad!: PdfJsViewerComponent;


  title = 'NG2PDF-Viewer LAB';
  pdfSrc = "/assets/Metro_Versao_Consolidada_PUBLICA.pdf";
  loadtype: number = 0;

  // doc: any;

  viewer: any;

  tags: {content?: any, page?: number}[] = [];

  tags2: {page?: number, texto?:string, coords?: any[]}[] = [];

  get opcao2Value(): any {
    return opcao2;
  }

  constructor(private http: HttpClient, private ref: ElementRef,
    @Inject(DOCUMENT) private docx: Document) {

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
          // console.log(this.pdfViewerOnDemand);
          // console.log(this.pdfViewerOnDemand.iframe.nativeElement);
          // this.doc = this.pdfViewerOnDemand.iframe.nativeElement;

          // console.log(this.ref);

          // console.log(this.ref.nativeElement);

          // this.ref.nativeElement.addEventListener('onselect', function() { console.log('ok')});

          // console.log(this.doc);

          // console.log(this.docx);
          // console.log(this.docx.getElementById('viewer'));

          // console.log(this.pdfViewerOnDemand.PDFViewerApplication);
          // console.log(this.pdfViewerOnDemand.PDFViewerApplicationOptions);

        }
      );
  }

  public testBeforePrint(): any {
    console.log('testBeforePrint');
  }

  public testAfterPrint(): any {
    console.log('testAfterPrint');
  }

  public testPagesLoaded(event: any): void {
    console.log('testPagesLoaded');
    console.log(event);
    console.log(this.pdfViewerOnDemand.PDFViewerApplication);
    this.viewer = this.pdfViewerOnDemand.PDFViewerApplication;

    // console.log(this.docx.getElementById('viewer'));
    // console.log(this.viewer.appConfig);

    this.pdfViewerOnDemand.PDFViewerApplication.appConfig.viewerContainer.onmouseup = this.selectedText;
    // this.viewer.appConfig.viewerContainer.onmouseup = this.selectedText;

    // console.log(this.viewer.appConfig);

    // console.log(this.viewer.appConfig.viewerContainer);

    // console.log(this.pdfViewerOnDemand);
    // console.log(this.pdfViewerOnDemand.PDFViewerApplication);

  }

  public testPageChange(event: any): void {
    console.log('testPageChange');
    console.log(event);
  }

  public openPdfBytes(): void {
    let url = "/assets/Metro_Versao_Consolidada_PUBLICA.pdf"; // Or your url pdfSrc can be Blob or Uint8Array
    this.downloadFile(url).subscribe(
        (res: any) => {
            this.pdfViewerAutoLoad.pdfSrc = res; // pdfSrc can be Blob or Uint8Array
            this.pdfViewerAutoLoad.refresh(); // Ask pdf viewer to load/refresh pdf
        }
    );
  }

  public comentar(): void {
    var comment = {content: selection.content, page: selection.page};
    this.tags.push(comment);
    this.getHightlightCoords();
    this.showHighlight(opcao2);
  }

  // @HostListener('window:mouseup', ['$event'])
  selectedText(event): void {

    selection.content = event.view.getSelection().toString();
    selection.page = event.view.PDFViewerApplication.page;
    console.log(selection);

    console.log(event);
    console.log(event.view);
    console.log(event.view.getSelection());
    console.log(event.view.getSelection().toString());
    content = event.view.getSelection().toString();
    console.log(content);

    console.log(event.view.getSelection().anchorNode);
    console.log(event.view.getSelection().anchorNode.textContent);

    console.log(event.view.getSelection().anchorNode.parentElement.innerHTML);

    console.log('==================================');



    // event.view.PDFViewerApplication.findBar.opened = true;
    // event.view.PDFViewerApplication.findBar.findField.innerHTML = "texto";


    console.log(event.view.PDFViewerApplication.findBar);

    globalSelection = event.view.getSelection();

    // var selectionRects = event.view.getSelection().getRangeAt(0).getClientRects();
    // console.log(selectionRects);
    // var selectionRectsList = Object.values(selectionRects)
    // console.log(selectionRectsList);
    // this.getHightlightCoords(event.view);

    // event.view.PDFViewerApplication.findBar.open();


    // event.view.PDFViewerApplication.findBar.findField.value = "teste";
    // event.view.PDFViewerApplication.findBar.caseSensitive.checked = true;
    // event.view.PDFViewerApplication.findBar.highlightAll.checked = true;
    // event.view.PDFViewerApplication.findBar.findNextButton.click();
    // event.view.PDFViewerApplication.findBar.close();



    // this.pdfViewerOnDemand.PDFViewerApplication.findBar.opened = true;
    // this.pdfViewerOnDemand.PDFViewerApplication.findBar.findField.innerHTML = "texto";
    // console.log(this.pdfViewerOnDemand.PDFViewerApplication.findBar);

    // this.pdfViewerOnDemand.PDFViewerApplication.findBar.toggleButton.click();

    // console.log('teste');
    // console.log(getSelection().toString());
    // this.content = getSelection().toString();
    // const textLayer = document.getElementsByClassName('TextLayer');
    // const x = window!.getSelection().getRangeAt(0).getClientRects()[0].left - textLayer[0].getBoundingClientRect().left;
    // const y = window!.getSelection().getRangeAt(0).getClientRects()[0].top - textLayer[0].getBoundingClientRect().top;
    // console.log(x);
    // console.log(y);

  }

  public exibirComentario(): void {
    console.log(this.viewer);
    console.log(this.pdfViewerOnDemand);
    console.log(content);
    this.viewer.findBar.open();
    this.viewer.findBar.findField.value = content;
    this.viewer.findBar.caseSensitive.checked = false;
    this.viewer.findBar.highlightAll.checked = true;
    this.viewer.findBar.findNextButton.click();

    this.pdfViewerOnDemand.PDFViewerApplication.pdfViewer.currentPageNumber = selection.page;

  }

  get contentSelected() { return content; }

  public show(event, tag: {content?: any, page?: number}): void {
    this.viewer.findBar.open();
    this.viewer.findBar.findField.value = tag.content;
    this.viewer.findBar.caseSensitive.checked = false;
    this.viewer.findBar.highlightAll.checked = true;
    this.viewer.findBar.findNextButton.click();
    this.pdfViewerOnDemand.PDFViewerApplication.pdfViewer.currentPageNumber = tag.page;
    event.preventDefault();
  }

  public show2(event, tag: {page?: number, texto?:string, coords?: any[]}): void {
    this.pdfViewerOnDemand.PDFViewerApplication.pdfViewer.currentPageNumber = tag.page;
    this.showHighlight(tag);
    event.preventDefault();
  }


  public getHightlightCoords(): any {
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
    // selectionRects.forEach(value => {
    //   selected.push(viewport.convertToPdfPoint(value.left - pageRect.x, value.top - pageRect.y).concat(
    //     viewport.convertToPdfPoint(value.right - pageRect.x, value.bottom - pageRect.y)));
    // })
    // var selected = selectionRects.map(function (r) {
    //   return viewport.convertToPdfPoint(r.left - pageRect.x, r.top - pageRect.y).concat(
    //      viewport.convertToPdfPoint(r.right - pageRect.x, r.bottom - pageRect.y));
    // });
    opcao2 = {page: pageIndex, texto: content, coords: selected};
    console.log(opcao2);
    this.tags2.push(opcao2);
    return opcao2
  }

  public showHighlight(selected) {

    console.log(selected);

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


}
