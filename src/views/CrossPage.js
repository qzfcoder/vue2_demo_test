/**
 * @description 跨页选择
 * @param {Object} options
 * @param {String} options.key 行数据唯一标识
 * @param {Function} options.toggleRowSelection 设置行数据选中/取消选中的方法,必传
 */
export const CrossPage = class {
  #crossPageMap = new Map();
  constructor(options = {}) {
    this.key = options.key || 'id';
    this.data = options.data || [];
    this.max = options.max || Number.MAX_SAFE_INTEGER;
    this.toggleRowSelection = options.toggleRowSelection;
    if (typeof this.toggleRowSelection !== 'function')
      throw new Error('toggleRowSelection is not function');
  }
  get keys() {
    return Array.from(this.#crossPageMap.keys());
  }
  get values() {
    return Array.from(this.#crossPageMap.values());
  }
  get size() {
    return this.#crossPageMap.size;
  }
  clear() {
    this.#crossPageMap.clear();
    this.updateViews();
  }
  isChecked(row) {
    return this.#crossPageMap.has(row[this.key]);
  }
  onRowSelectChange(row) {
    if (typeof row !== 'object') return console.error('row is not object');
    const { key, toggleRowSelection } = this;
    if (this.isChecked(row)) this.#crossPageMap.delete(row[key]);
    else {
      this.#crossPageMap.set(row[key], row);
      if (this.size > this.max) {
        this.#crossPageMap.delete(row[key]);
        toggleRowSelection(row, false);
      }
    }
  }
  onDataChange(list) {
    this.data = list;
    this.updateViews();
  }
  updateViews() {
    const { data, toggleRowSelection, key } = this;
    data.forEach((row) => {
      toggleRowSelection(row, this.isChecked(row));
    });
  }
};
