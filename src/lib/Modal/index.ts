import { ModalStyles, StyleObject } from '../../interfaces/Modal';
import { getDefaultModalStyles, modalKeyframeAnimations } from './styles';

export const MODAL_ID = 'paper-js-sdk-modal';
export class Modal {
  protected container: HTMLElement;
  protected main: HTMLDivElement;
  protected overlay: HTMLDivElement;
  protected iframe: HTMLIFrameElement;

  protected style: HTMLStyleElement;
  protected closeTimeout: number | undefined;
  styles = getDefaultModalStyles();
  body: HTMLDivElement;

  constructor(container?: HTMLElement, styles?: Partial<ModalStyles>) {
    this.container = container || document.body;

    if (styles) {
      this.mergeStyles(styles);
    }

    this.main = document.createElement('div');
    this.main.id = MODAL_ID;

    this.overlay = document.createElement('div');
    this.overlay.id = `${MODAL_ID}-overlay`;
    this.body = document.createElement('div');
    this.body.id = `${MODAL_ID}-body`;
    this.iframe = document.createElement('iframe');
    this.iframe.id = `${MODAL_ID}-iframe`;
    this.iframe.allow = 'camera; microphone; payment';

    this.style = document.createElement('style');
    this.style.innerHTML = modalKeyframeAnimations;

    this.assignStyles(this.main, this.styles.main);
    this.assignStyles(this.overlay, this.styles.overlay);
    this.assignStyles(this.body, this.styles.body);
    this.assignStyles(this.iframe, this.styles.iframe);
  }

  open({ iframeUrl }: { iframeUrl?: string } = {}) {
    if (iframeUrl) {
      this.iframe.src = iframeUrl;
      this.body.appendChild(this.iframe);
    }

    this.addAccessibility();

    this.main.appendChild(this.overlay);
    this.main.appendChild(this.style);
    this.main.appendChild(this.body);

    this.container.appendChild(this.main);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.body.style.animation = 'pew-modal-slideOut 0.2s forwards';

    this.closeTimeout = window.setTimeout(() => {
      document.body.style.overflow = 'visible';
      this.main.remove();

      window.clearTimeout(this.closeTimeout);
    }, 250);
  }

  protected mergeStyles(styles: Partial<ModalStyles>) {
    this.styles.body = {
      ...this.styles.body,
      ...(styles.body || {}),
    };

    this.styles.overlay = {
      ...this.styles.overlay,
      ...(styles.overlay || {}),
    };

    this.styles.main = {
      ...this.styles.main,
      ...(styles.main || {}),
    };

    this.styles.iframe = {
      ...this.styles.iframe,
      ...(styles.iframe || {}),
    };
  }

  protected addAccessibility() {
    this.main.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('aria-hidden', 'true');
    this.body.setAttribute('aria-modal', 'true');
    this.body.setAttribute('role', 'dialog');
  }

  protected assignStyles(el: HTMLElement, styles: StyleObject) {
    Object.assign(el.style, styles);
  }
}
