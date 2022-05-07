// 创建指定文件实例
import Vue from 'vue';

export default function create(component, props) {
  // 创建组件实例
  const vm = new Vue({
    render(h) {
      // render提供给我一个h函数，来渲染页面
      return h(component, { props });
    },
  }).$mount();
  console.log(vm);
  const comp = vm.$children[0];
  document.body.appendChild(vm.$el);
  document.body.style.background = '#fff';
  document.body.style.filter = 'Alpha(Opacity=60)';
  document.body.style.opacity = '0.6';
  comp.remove = () => {
    console.log('123');
    document.body.removeChild(vm.$el);
    vm.$destroy();
    document.body.style.background = '#fff';
    document.body.style.filter = 'unset';
    document.body.style.opacity = 'unset';
  };
  return comp;
}
