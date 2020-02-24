import { IonContent, DomController } from '@ionic/angular';
import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[scrollHide]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderDirective {
  // @Input("header") header: HTMLElement;
  // @Input("footer") footer: HTMLElement;
  // constructor(public element: ElementRef, public renderer: Renderer) {
  //   console.log('Hello HideHeaderDirective Directive');
  // }
  // ngOnInit() {
  //   this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 700ms');
  //   this.renderer.setElementStyle(this.footer, 'webkitTransition', 'bottom 700ms');
  // }
  // onContentScroll(event) {
  //   if (event.directionY == "down") {
  //     this.renderer.setElementStyle(this.header, 'top', '-56px');
  //     this.renderer.setElementStyle(this.footer, 'bottom', '-56px');
  //   }
  //   else {
  //     this.renderer.setElementStyle(this.header, 'top', '0px');
  //     this.renderer.setElementStyle(this.footer, 'bottom', '0px');
  //   }
  // }

  @Input('scrollHide') config: ScrollHideConfig;
  @Input('scrollContent') scrollContent: IonContent;

  contentHeight: number;
  scrollHeight: number;
  lastScrollPosition: number;
  lastValue: number = 0;

  constructor(private element: ElementRef, private renderer: Renderer2, private  domCtrl: DomController) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.scrollContent && this.config) {
      this.scrollContent.scrollEvents = true;

      let scrollStartFunc = async (ev) => {
        const el = await this.scrollContent.getScrollElement();
        this.contentHeight = el.offsetHeight;
        this.scrollHeight = el.scrollHeight;
        if (this.config.maxValue === undefined) {
          this.config.maxValue = this.element.nativeElement.offsetHeight;
        }
        this.lastScrollPosition = el.scrollTop;
      };

      if(this.scrollContent && this.scrollContent instanceof IonContent) {
        this.scrollContent.ionScrollStart.subscribe(scrollStartFunc);
        this.scrollContent.ionScroll.subscribe(async (ev) => this.adjustElementOnScroll(ev));
        this.scrollContent.ionScrollEnd.subscribe(async (ev) => this.adjustElementOnScroll(ev));

      } else if(this.scrollContent instanceof HTMLElement) {
        (this.scrollContent as HTMLElement).addEventListener('ionScrollStart', scrollStartFunc);
        (this.scrollContent as HTMLElement).addEventListener('ionScroll',async (ev) => this.adjustElementOnScroll(ev));
        (this.scrollContent as HTMLElement).addEventListener('ionScrollEnd',async (ev) => this.adjustElementOnScroll(ev));
      }
    }
  }

  private adjustElementOnScroll(ev) {
    if (ev) {
      this.domCtrl.write(async () => {
        const el = await this.scrollContent.getScrollElement();
        let scrollTop: number = el.scrollTop > 0 ? el.scrollTop : 0;
        let scrolldiff: number = scrollTop - this.lastScrollPosition;
        this.lastScrollPosition = scrollTop;
        let newValue = this.lastValue + scrolldiff;
        newValue = Math.max(0, Math.min(newValue, this.config.maxValue));
        this.renderer.setStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);
        this.lastValue = newValue;
      });
    }
  }
}

export interface ScrollHideConfig {
  cssProperty: string;
  maxValue: number;
}