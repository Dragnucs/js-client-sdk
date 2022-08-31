export interface PaperPaymentElementConstructorArgs {
  onLoad?: (event?: Event) => void;
  elementOrId?: string | HTMLElement;
}

export class PaperPaymentElement {
  private elementOrId?: PaperPaymentElementConstructorArgs["elementOrId"];
  private onLoad?: PaperPaymentElementConstructorArgs["onLoad"];

  constructor({ elementOrId, onLoad }: PaperPaymentElementConstructorArgs) {
    this.elementOrId = elementOrId;
    this.onLoad = onLoad;
  }
  createPaymentElement({
    handler,
    link,
    iframeId,
  }: {
    handler: (
      iframe: HTMLIFrameElement
    ) => (event: MessageEvent<any>) => void | Promise<void>;
    link: URL;
    iframeId: string;
  }) {
    const iframe = document.createElement("iframe");
    window.addEventListener("message", handler(iframe));
    iframe.src = link.href;
    iframe.id = iframeId;
    iframe.setAttribute(
      "style",
      "margin-left:auto; margin-right:auto; height:350px; width:100%; transition-property:all; transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1); transition-duration:150ms;"
    );
    iframe.onload = (event: Event) => {
      if (this.onLoad) {
        this.onLoad(event);
      }
    };

    if (!this.elementOrId) {
      return iframe;
    }
    let container: HTMLElement | string = this.elementOrId;
    if (typeof container === "string") {
      const domElement = document.getElementById(container);
      if (!domElement) {
        throw new Error("Invalid id given");
      }
      container = domElement;
    }
    const existing: HTMLIFrameElement | null = container.querySelector(
      "#" + iframeId
    );
    // if we already created am iframe, consider updating the iframe link if it's new
    if (existing) {
      if (existing.src === link.href) {
        return existing;
      }
      existing.src = link.href;
      return existing;
    }
    return container.appendChild(iframe);
  }
}
