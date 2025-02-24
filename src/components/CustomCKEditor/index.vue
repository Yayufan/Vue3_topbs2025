<!-- 自己的CKEditor5 封裝

主要接收父組件的三個數據
scope: 區域,這個是用來區分不同內容[最新消息、醫學新知、專業醫療],各種類的圖片放置區位置,也是localStorage中暫存的key名稱
htmlContent: 內容,這個是父組件異步調用API,獲取數據後傳來的內容
updateContent: 回調函數,更新數據給父組件去使用

-->
<template>
  <!-- CKEditor5 編輯器 -->
  <div class="main-container">
    <div class="editor-container editor-container_document-editor">
      <div class="editor-container__menu-bar" ref="editorMenuBarElement"></div>
      <div class="editor-container__toolbar" ref="editorToolbarElement"></div>
      <div class="editor-container__editor-wrapper">
        <div class="editor-container__editor">
          <div>
            <!-- 這邊注意v-model的值一定必須是字符串(空字串也可以),不得是null 或是 undefined  -->
            <ckeditor v-if="isLayoutReady" v-model="tempContent" :editor="editor" :config="config" @ready="onReady" />
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'

//接收父組件傳來的數據
const props = defineProps(["scope", "htmlContent", "updateContent"])

//Editor的臨時值,用於初始化
const tempContent = ref(props.htmlContent || "")

//監聽父組件傳來的HTML(可能為異步數據)
watch(() => props.htmlContent, (newValue, oldValue) => {
  tempContent.value = newValue
})

//監聽臨時的內容,將他傳遞給父組件
watch(tempContent, (newValue, oldValue) => {
  props.updateContent(newValue)
})


/**--------------- CKEditor5 配置 -------------------------------------- */

import {
  DecoupledEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  CloudServices,
  Code,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  SimpleUploadAdapter,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  //Markdown,
  MediaEmbed,
  PageBreak,
  Paragraph,
  //PasteFromMarkdownExperimental,
  PasteFromOffice,
  PictureEditing,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
  Editor
} from 'ckeditor5';

// 翻譯
//import translations from 'ckeditor5/dist/translations';

import 'ckeditor5/ckeditor5.css';
import MyUploadAdapter from '@/utils/CKEditorUploadImg'

//編輯器本身對象
const editorObj = reactive({})
//編輯器上方工具欄
const editorToolbarElement = ref()
//編輯器功能菜單欄
const editorMenuBarElement = ref()
//頁面掛載的狀態
let isLayoutReady = ref(false)
//配置項
let config = reactive({})
//編輯器本身使用CKEditor的文檔編輯器
let editor = DecoupledEditor

//頁面掛載時執行
onMounted(async () => {
  const defaultConfig = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'link',
        'insertImage',
        'insertTable',
        'highlight',
        'blockQuote',
        '|',
        'alignment',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'indent',
        'outdent'
      ],
      shouldNotGroupWhenFull: false
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      BlockToolbar,
      Bold,
      CloudServices,
      Code,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Heading,
      Highlight,
      HorizontalLine,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      //Markdown,
      MediaEmbed,
      PageBreak,
      Paragraph,
      //PasteFromMarkdownExperimental,
      PasteFromOffice,
      PictureEditing,
      RemoveFormat,
      SelectAll,
      SimpleUploadAdapter,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo
    ],
    balloonToolbar: [
      'fontSize', 'fontColor', 'fontBackgroundColor',
      '|',
      'bold', 'italic', 'underline',
      '|',
      'alignment',
      '|',
      'link', 'insertImage',
      '|',
      'bulletedList', 'numberedList',
      '|',
      'insertTable', 'highlight', 'blockQuote',],
    blockToolbar: [
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      '|',
      'link',
      'insertImage',
      'insertTable',
      '|',
      'bulletedList',
      'numberedList',
      'indent',
      'outdent'
    ],
    fontFamily: {
      supportAllValues: true
    },
    fontSize: {
      options: [12, 14, 'default', 18, 20, 22, 24, 26],
      supportAllValues: true
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph'
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1'
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2'
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3'
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4'
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5'
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6'
        }
      ]
    },
    image: {
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage'
      ]
    },
    // initialData: newsData.content,
    //'<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n    You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing\n    capabilities that are customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n    <li>\n        <strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your\n        application.\n    </li>\n    <li>\n        <strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.\n    </li>\n    <li>\n        <strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even\n        write your plugin!\n    </li>\n</ol>\n<p>\n    Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us\n    as we strive to improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n    <li>📝 <a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li>\n    <li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n    <li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n    <li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n    <li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n    See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect\n    license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we\n    will help as soon as possible!\n</p>\n',
    language: 'zh-cn',
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true
      }
    },
    menuBar: {
      isVisible: true
    },
    placeholder: 'Type or paste your content here!',
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    },
    //translations: [translations],
    //簡易圖片上傳器
    // simpleUpload: {
    //   uploadUrl: `${import.meta.env.VITE_APP_BASE_API}/education-surgery/education-img`,
    //   headers: {
    //     Authorization: localStorage.getItem('Authorization')
    //   },
    // },
    //媒體嵌入
    mediaEmbed: {
      previewsInData: true
    }
  };

  Object.assign(config, defaultConfig)
  //頁面掛載完畢,開始加載CKEditor
  isLayoutReady.value = true

})

const onReady = (editor: any) => {
  //将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
  Object.assign(editorObj, editor)

  // console.log('這是editor', editor)
  // console.log('toolbar', editorToolbarElement)

  Array.from((editorToolbarElement.value as HTMLElement).children).forEach(child => child.remove());
  Array.from((editorMenuBarElement.value as HTMLElement).children).forEach(child => child.remove());

  editorToolbarElement.value.appendChild(editor.ui.view.toolbar.element);
  editorMenuBarElement.value.appendChild(editor.ui.view.menuBarView.element);

  // 設置上傳監聽
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader, props.scope);
  }

}


</script>

<style scoped lang="scss">
.editor-container__editor-wrapper {
  border: 1px solid var(--ck-color-toolbar-border)
}
</style>
