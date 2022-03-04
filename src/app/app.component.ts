import {
  Component,
  ViewChild,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';

import { fabric } from 'fabric';

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

  viewer: any;
  textoSelecionado = '';
  tags2: {page?: number, texto?:string, coords?: any[]}[] = [];
  tagSelecionada: {page?: number, texto?:string, coords?: any[]}

  // canvas reference and event handlers
  protected _canvas?: fabric.Canvas;
  protected _mouseDown: (evt: fabric.IEvent) => void;
  protected _mouseMove: (evt: fabric.IEvent) => void;
  protected _mouseUp: (evt: fabric.IEvent) => void;
  private rect;
  private isDown;
  private origX;
  private origY;


  public pagina: any;
  public savedImage: any;

  public editar: boolean = false;
  private paginaAtual: any;

  get opcao2Value(): any {
    return opcao2;
  }

  constructor(private http: HttpClient, protected _zone: NgZone) {
    this._mouseDown = (evt: fabric.IEvent) => this.__onMouseDown(evt);
    this._mouseMove = (evt: fabric.IEvent) => this.__onMouseMove(evt);
    this._mouseUp = (evt: fabric.IEvent) => this.__onMouseUp(evt);
  }

  ngAfterViewInit(): void {

    this._zone.runOutsideAngular( () => {
      this._canvas = new fabric.Canvas('c', {
        backgroundColor: '#ebebef',
        selection: false,
        preserveObjectStacking: true,
      });

      this._canvas.on('mouse:down', this._mouseDown);
      this._canvas.on('mouse:move', this._mouseMove);
      this._canvas.on('mouse:up', this._mouseUp);

    });

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

  public testPagesLoaded(event: any): void {
    this.viewer = this.pdfViewerOnDemand.PDFViewerApplication;
    this.pdfViewerOnDemand.PDFViewerApplication.appConfig.viewerContainer.onmouseup = this.selectedText;
  }

  public testPageChange(event: any): void {

    var page = this.pdfViewerOnDemand.PDFViewerApplication.pdfViewer.getPageView(event);
    this.paginaAtual = page;
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
    globalSelection = event.view.getSelection()
  }

  public show2(event, tag: {page?: number, texto?:string, coords?: any[]}): void {
    this.tagSelecionada = tag;
    this.textoSelecionado = tag.texto;
    this.pdfViewerOnDemand.PDFViewerApplication.pdfViewer.currentPageNumber = tag.page;
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

    opcao2 = {page: pageIndex, texto: selection.content, coords: selected};
    this.tags2.push(opcao2);
    return opcao2

  }

  public showHighlight(selected) {

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

  public getImageCanvas(): void {
    this.pagina = this.paginaAtual.canvas.toDataURL("image/png");

    console.log(this.pagina);
    fabric.Image.fromURL(this.pagina, (img) => {
      img.set({
        left: 0,
        top: 0,
        angle: 0,
        // opacity: 0.75,
        width:700,
        height:700,
        selectable: false,
        evented: false
      });
      this._canvas.add(img); // erro aqui, this não é acessível

    });

    // // Seta a imagem no canvas para edição
    // var canv: any = document.getElementById("c");
    // var ctx = canv.getContext("2d");
    // var image = new Image();
    // image.onload = function() {
    //   ctx.drawImage(image, 0, 0);
    // };
    // image.src = this.pagina;

  }

  protected __onMouseDown(evt: fabric.IEvent): void{
    this.isDown = true;
    var pointer = this._canvas.getPointer(evt.e);
    this.origX = pointer.x;
    this.origY = pointer.y;
    var pointer = this._canvas.getPointer(evt.e);
    this.rect = new fabric.Rect({
        left: this.origX,
        top: this.origY,
        originX: 'left',
        originY: 'top',
        width: pointer.x - this.origX,
        height: pointer.y - this.origY,
        angle: 0,
        fill: 'rgba(255,0,0,0.5)',
        transparentCorners: false
    });
    this._canvas.add(this.rect);
  }
  protected __onMouseMove(evt: fabric.IEvent): void {
    if (!this.isDown) return;
    var pointer = this._canvas.getPointer(evt.e);

    if(this.origX>pointer.x){
        this.rect.set({ left: Math.abs(pointer.x) });
    }
    if(this.origY>pointer.y){
        this.rect.set({ top: Math.abs(pointer.y) });
    }

    this.rect.set({ width: Math.abs(this.origX - pointer.x) });
    this.rect.set({ height: Math.abs(this.origY - pointer.y) });


    this._canvas.renderAll();

  }
  protected __onMouseUp(evt: fabric.IEvent): void
  {
    this.isDown = false;
  }

  public saveImage(): void {
    this.savedImage = this._canvas.toDataURL("image/png");
    this.editar = true;
  }


}
