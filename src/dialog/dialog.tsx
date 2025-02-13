import { defineComponent, Transition } from 'vue';
import { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-vue-next';

import { prefix } from '../config';
import TButton from '../button';
import ActionMixin from './actions';
import { DialogCloseContext, TdDialogProps } from './type';
import props from './props';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';
import TransferDom from '../utils/transfer-dom';
import { ClassName, Styles } from '../common';
import { emitEvent } from '../utils/event';
import mixins from '../utils/mixins';
import getConfigReceiverMixins, { DialogConfig } from '../config-provider/config-receiver';

const name = `${prefix}-dialog`;

function GetCSSValue(v: string | number) {
  return Number.isNaN(Number(v)) ? v : `${Number(v)}px`;
}

// 注册元素的拖拽事件
function InitDragEvent(dragBox: HTMLElement) {
  const target = dragBox;
  target.addEventListener('mousedown', (targetEvent: MouseEvent) => {
    // 算出鼠标相对元素的位置
    const disX = targetEvent.clientX - target.offsetLeft;
    const disY = targetEvent.clientY - target.offsetTop;
    function mouseMoverHandler(documentEvent: MouseEvent) {
      // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      const left = documentEvent.clientX - disX;
      const top = documentEvent.clientY - disY;
      // 移动当前元素
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    }
    function mouseUpHandler() {
      // 鼠标弹起来的时候不再移动
      document.removeEventListener('mousemove', mouseMoverHandler);
      // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
      document.removeEventListener('mouseup', mouseUpHandler);
    }
    // 元素按下时注册document鼠标监听事件
    document.addEventListener('mousemove', mouseMoverHandler);
    // 鼠标弹起来移除document鼠标监听事件
    document.addEventListener('mouseup', mouseUpHandler);
    // 拖拽结束移除鼠标监听事件，解决文字拖拽结束事件未解绑问题
    document.addEventListener('dragend', mouseUpHandler);
  });
}
export default defineComponent({
  ...mixins(ActionMixin, getConfigReceiverMixins<DialogConfig>('dialog')),
  name: 'TDialog',
  components: {
    CloseIcon,
    InfoCircleFilledIcon,
    CheckCircleFilledIcon,
    ErrorCircleFilledIcon,
    TButton,
    Transition,
  },

  // 注册v-draggable指令,传入ture时候初始化拖拽事件
  directives: {
    TransferDom,
    draggable(el, binding) {
      // el 指令绑定的元素
      if (el && binding && binding.value) {
        InitDragEvent(el);
      }
    },
  },

  props: { ...props },

  emits: [
    'esc-keydown',
    'update:visible',
    'overlay-click',
    'close-btn-click',
    'cancel',
    'confirm',
    'opened',
    'closed',
    'close',
  ],

  data() {
    return {
      scrollWidth: 0,
    };
  },

  computed: {
    // 是否模态形式的对话框
    isModal(): boolean {
      return this.mode === 'modal';
    },
    // 是否非模态对话框
    isModeless(): boolean {
      return this.mode === 'modeless';
    },

    maskClass(): ClassName {
      return [`${name}__mask`, !this.showOverlay && `${prefix}-is-hidden`];
    },

    dialogClass(): ClassName {
      const dialogClass = [`${name}`, `${name}--default`, `${name}--${this.placement}`, `${name}__modal-${this.theme}`];
      if (['modeless', 'modal'].includes(this.mode)) {
        dialogClass.push(`${name}--fixed`);
      }
      return dialogClass;
    },

    dialogStyle(): Styles {
      const { top, placement } = this;
      let topStyle = {};

      // 设置了top属性
      if (top) {
        const topValue = GetCSSValue(top);
        topStyle = {
          top: topValue,
          transform: 'translate(-50%, 0)',
          transformOrigin: '25% 25%',
          maxHeight: `calc(100% - ${topValue})`,
        };
      } else if (placement === 'top') {
        topStyle = {
          maxHeight: 'calc(100% - 20%)',
        };
      }
      return { width: GetCSSValue(this.width), ...topStyle };
    },
  },

  watch: {
    visible(value) {
      const { scrollWidth } = this;
      let bodyCssText = 'overflow: hidden;';
      if (value) {
        if (scrollWidth > 0) {
          bodyCssText += `position: relative;width: calc(100% - ${scrollWidth}px);`;
        }
        document.body.style.cssText = bodyCssText;
      } else {
        document.body.style.cssText = '';
      }
      this.disPreventScrollThrough(value);
      this.addKeyboardEvent(value);
    },
  },
  mounted() {
    this.scrollWidth = window.innerWidth - document.body.offsetWidth;
  },

  beforeUnmount() {
    this.disPreventScrollThrough(false);
    this.addKeyboardEvent(false);
  },

  methods: {
    disPreventScrollThrough(disabled: boolean) {
      // 防止滚动穿透,modal形态才需要
      if (this.preventScrollThrough && this.isModal) {
        document.body.style.overflow = disabled ? 'hidden' : '';
      }
    },
    addKeyboardEvent(status: boolean) {
      if (status) {
        document.addEventListener('keydown', this.keyboardEvent);
      } else {
        document.removeEventListener('keydown', this.keyboardEvent);
      }
    },
    keyboardEvent(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        emitEvent<Parameters<TdDialogProps['onEscKeydown']>>(this, 'esc-keydown', { e });
        // 根据closeOnKeydownEsc判断按下ESC时是否触发close事件
        if (this.closeOnKeydownEsc) {
          this.emitCloseEvent({
            trigger: 'esc',
            e,
          });
        }
      }
    },
    overlayAction(e: MouseEvent) {
      emitEvent<Parameters<TdDialogProps['onOverlayClick']>>(this, 'overlay-click', { e });
      // 根据closeOnClickOverlay判断点击蒙层时是否触发close事件
      if (this.closeOnOverlayClick) {
        this.emitCloseEvent({
          trigger: 'overlay',
          e,
        });
      }
    },
    closeBtnAcion(e: MouseEvent) {
      emitEvent<Parameters<TdDialogProps['onCloseBtnClick']>>(this, 'close-btn-click', { e });
      this.emitCloseEvent({
        trigger: 'close-btn',
        e,
      });
    },

    cancelBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdDialogProps['onCancel']>>(this, 'cancel', { e });
      this.emitCloseEvent({
        trigger: 'cancel',
        e,
      });
    },
    confirmBtnAction(e: MouseEvent) {
      emitEvent<Parameters<TdDialogProps['onConfirm']>>(this, 'confirm', { e });
    },
    // 打开弹窗动画结束时事件
    afterEnter() {
      emitEvent<Parameters<TdDialogProps['onOpened']>>(this, 'opened');
    },
    // 关闭弹窗动画结束时事件
    afterLeave() {
      emitEvent<Parameters<TdDialogProps['onClosed']>>(this, 'closed');
    },

    emitCloseEvent(context: DialogCloseContext) {
      emitEvent<Parameters<TdDialogProps['onClose']>>(this, 'close', context);
      // 默认关闭弹窗
      emitEvent(this, 'update:visible', false);
    },

    // Vue在引入阶段对事件的处理还做了哪些初始化操作。Vue在实例上用一个_events属性存贮管理事件的派发和更新，
    // 暴露出$on, $once, $off, $emit方法给外部管理事件和派发执行事件
    // 所以通过判断_events某个事件下监听函数数组是否超过一个，可以判断出组件是否监听了当前事件
    hasEventOn(name: string) {
      // _events 因没有被暴露在vue实例接口中，只能把这个规则注释掉
      // eslint-disable-next-line dot-notation
      const eventFuncs = this['_events']?.[name];
      return !!eventFuncs?.length;
    },
    getIcon() {
      const icon = {
        info: <InfoCircleFilledIcon class="t-is-info" />,
        warning: <ErrorCircleFilledIcon class="t-is-warning" />,
        danger: <ErrorCircleFilledIcon class="t-is-error" />,
        success: <CheckCircleFilledIcon class="t-is-success" />,
      };
      return icon[this.theme];
    },
    renderDialog() {
      // header 值为 true 显示空白头部
      const defaultHeader = <h5 class="title"></h5>;
      const defaultCloseBtn = <CloseIcon />;
      const body = renderContent(this, 'default', 'body');
      const defaultFooter = (
        <div>
          {this.getCancelBtn({
            cancelBtn: this.cancelBtn,
            globalCancel: this.global.cancel,
            className: `${prefix}-dialog__cancel`,
          })}
          {this.getConfirmBtn({
            theme: this.theme,
            confirmBtn: this.confirmBtn,
            globalConfirm: this.global.confirm,
            globalConfirmBtnTheme: this.global.confirmBtnTheme,
            className: `${prefix}-dialog__confirm`,
          })}
        </div>
      );
      const bodyClassName = this.theme === 'default' ? `${name}__body` : `${name}__body__icon`;
      return (
        // /* 非模态形态下draggable为true才允许拖拽 */
        <div
          key="dialog"
          class={this.dialogClass}
          style={this.dialogStyle}
          v-draggable={this.isModeless && this.draggable}
        >
          <div class={`${name}__header`}>
            {this.getIcon()}
            {renderTNodeJSX(this, 'header', defaultHeader)}
          </div>
          <span class={`${name}__close`} onClick={this.closeBtnAcion}>
            {renderTNodeJSX(this, 'closeBtn', defaultCloseBtn)}
          </span>
          <div class={bodyClassName}>{body}</div>
          <div class={`${name}__footer`}>{renderTNodeJSX(this, 'footer', defaultFooter)}</div>
        </div>
      );
    },
  },
  render() {
    const maskView = this.isModal && <div key="mask" class={this.maskClass} onClick={this.overlayAction}></div>;
    const dialogView = this.renderDialog();
    const view = [maskView, dialogView];
    const ctxStyle: any = { zIndex: this.zIndex };
    const ctxClass = [`${name}__ctx`, { 't-dialog__ctx--fixed': this.mode === 'modal' }];
    return (
      <transition
        duration={300}
        name={`${name}-zoom__vue`}
        onAfterEnter={this.afterEnter}
        onAfterLeave={this.afterLeave}
      >
        {(!this.destroyOnClose || this.visible) && (
          <div v-show={this.visible} class={ctxClass} style={ctxStyle} v-transfer-dom={this.attach}>
            {view}
          </div>
        )}
      </transition>
    );
  },
});
