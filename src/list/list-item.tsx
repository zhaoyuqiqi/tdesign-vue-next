import { defineComponent } from 'vue';
import { prefix } from '../config';
import props from './props';
import { renderTNodeJSX } from '../utils/render-tnode';

const name = `${prefix}-list-item`;

export default defineComponent({
  name: 'TListItem',
  props,
  render() {
    const propsDefaultContent = renderTNodeJSX(this, 'default');
    const propsContent = renderTNodeJSX(this, 'content');
    const propsActionContent = renderTNodeJSX(this, 'action');

    return (
      <li class={name}>
        <div class={`${name}-main`}>
          {propsDefaultContent || propsContent}
          {propsActionContent && <li class={`${name}__action`}>{propsActionContent}</li>}
        </div>
      </li>
    );
  },
});
