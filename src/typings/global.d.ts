declare global {
  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /** 数据列表 */
    list: T;
    /** 总数 */
    total: number;
  }

  /**
   * 页签对象
   */
  interface TagView {
    /** 页签名称 */
    name: string;
    /** 页签标题 */
    title: string;
    /** 页签路由路径 */
    path: string;
    /** 页签路由完整路径 */
    fullPath: string;
    /** 页签图标 */
    icon?: string;
    /** 是否固定页签 */
    affix?: boolean;
    /** 是否開啟缓存 */
    keepAlive?: boolean;
    /** 路由查询参数 */
    query?: any;
  }

  /**
   * 系统設置
   */
  interface AppSettings {
    /** 系统标题 */
    title: string;
    /** 系统版本 */
    version: string;
    /** 是否显示設置 */
    showSettings: boolean;
    /** 是否固定头部 */
    fixedHeader: boolean;
    /** 是否显示多标签導航 */
    tagsView: boolean;
    /** 是否显示側邊欄Logo */
    sidebarLogo: boolean;
    /** 導航栏布局(left|top|mix) */
    layout: string;
    /** 主題顏色 */
    themeColor: string;
    /** 主題模式(dark|light) */
    theme: string;
    /** 布局大小(default |large |small) */
    size: string;
    /** 語言( zh-cn| en) */
    language: string;
    /** 是否開啟水印 */
    watermarkEnabled: boolean;
    /** 水印内容 */
    watermarkContent: string;
  }

  /**
   * 组件数据源
   */
  interface OptionType {
    /** 值 */
    value: string | number;
    /** 文本 */
    label: string;
    /** 子列表  */
    children?: OptionType[];
  }
}
export { };
