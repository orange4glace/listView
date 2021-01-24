import { IDisposable } from '@orange4glace/vs-lib/base/common/lifecycle';

export interface IListVirtualDelegate<T> {
	getTemplateId(element: T): string;
}

interface IItem<T> {
  element: T;
  templateId: string;
  templateData: any;
}

export interface IListRenderer<T, TTemplateData> {
  readonly templateId: string;
  renderTemplate(container: HTMLElement): TTemplateData;
  renderElement(element: T, templateData: TTemplateData): void;
  disposeTemplate(templateData: TTemplateData)
  disposeElement(element: T): void;
}

export class ListView<T> implements IDisposable {

  private domNode_: HTMLElement;

  private items_: IItem<T>[] = [];
  get items(): readonly IItem<T>[] { return this.items_; }

  private renderers_ = new Map<string, IListRenderer<T, any>>();
  
  get length() { return this.items.length; }

  constructor(
    parent: HTMLElement,
    readonly virtualDelegate: IListVirtualDelegate<T>, 
    renderers: IListRenderer<T, any>[],
  ) {
    this.domNode_ = document.createElement('div');
    parent.append(this.domNode_);

    renderers.forEach(renderer => this.renderers_.set(renderer.templateId, renderer));
  }

  splice(start: number, deleteCount: number, ...appends: T[]) {
    const items = appends.map<IItem<T>>(element => ({
      element,
      templateId: this.virtualDelegate.getTemplateId(element),
      templateData: undefined
    }));
    for (let i = start; i < start + deleteCount; i ++) {
      const item = this.items[i];
      this.removeItemDOM(item, start);
    }
    for (let i = 0; i < items.length; i ++) {
      this.insertItemDOM(items[i], start + i);
    }
    this.items_.splice(start, deleteCount, ...items);
  }

  clear() {
    for (let i = 0; i < this.items_.length; i ++) {
      this.removeItemDOM(this.items[i], 0);
    }
    this.splice(0, this.items_.length);
  }

  private insertItemDOM(item: IItem<T>, index: number) {
    const node = document.createElement('div');
    this.domNode_.insertBefore(node, this.domNode_.children[index]);
    const renderer = this.renderers_.get(item.templateId);
    const templateData = renderer.renderTemplate(node);
    item.templateData = templateData;
    renderer.renderElement(item.element, templateData);
  }

  private removeItemDOM(item: IItem<T>, index: number) {
    const renderer = this.renderers_.get(item.templateId);
    this.domNode_.removeChild(this.domNode_.children[index]);
    renderer.disposeElement(item.element);
    renderer.disposeTemplate(item.templateData);
  }

  dispose(): void {
  }

}