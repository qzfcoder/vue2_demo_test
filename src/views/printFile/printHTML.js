export function printHTML(html) {
  // 创建iframe元素
  const iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'display:none');
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  // 写入html
  doc.write(html);
  doc.close();

  // 调用打印
  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  // 打印完毕后移除
  iframe.parentNode.removeChild(iframe);
}
