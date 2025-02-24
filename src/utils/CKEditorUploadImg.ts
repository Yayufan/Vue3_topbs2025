import axios from 'axios'

//自定義的上傳器,因為還要區分上傳的圖片區域,以及做URL的緩存和組裝
export default class MyUploadAdapter {

  loader: any; // 定義 loader 屬性
  scope: string; // 定義 scope 屬性為字符串類型

  //接收兩個參數,loader必要,這是CKEditor必傳的參數,scope為我自定義的參數,是一個字符串
  constructor(loader: any, scope: any) {
    // Save Loader instance to update upload progress.
    this.loader = loader;
    this.scope = scope
  }

  async upload() {

    const protocol = window.location.protocol; // 获取当前协议 (例如 "http:" 或 "https:")
    const hostname = window.location.hostname; // 获取当前域名 (例如 "www.example.com")

    console.log('當前協議', protocol)
    console.log('當前域名', hostname)

    const data = new FormData();
    //   data.append('typeOption', 'upload_image');
    data.append('file', await this.loader.file);
    data.append('scope', this.scope)

    return new Promise((resolve, reject) => {
      axios({
        url: `${import.meta.env.VITE_APP_BASE_API}/ck/upload-img`,
        method: 'post',
        data,
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        //withCredentials: true // true 为不允许带 token, false 为允许，可能会遇到跨域报错：Error: Network Error 弹窗提示
      }).then(res => {

        let resData = {
          default: ""
        }

        if (res.data.code === 500) {
          ElMessage.error("檔案大小請勿超過10MB")
          console.log(res.data.msg)
          return resolve(resData)

        }


        //重新組裝URL
        let reassembleUrl = protocol + '//' + hostname + '/minio' + res.data.url
        console.log(reassembleUrl)

        resData.default = reassembleUrl
        let originalStr = localStorage.getItem(this.scope)
        let newStr;
        if (originalStr === null) {
          newStr = reassembleUrl
        } else {
          newStr = originalStr + ',' + reassembleUrl
        }


        let imgList = newStr.split(",");
        console.log('添加前的List', imgList)

        localStorage.setItem(this.scope, newStr)

        //注意这里的resData一定要是一个对象，而且外面一定要有一个default设置为图片上传后的url，这是ckeditor的规定格式
        resolve(resData);
      }).catch(error => {
        reject(error)
      });
    });
  }
}


/*

import request from "@/utils/request";

export default class MyUploadAdapter {
  constructor(loader) {
    // Save Loader instance to update upload progress.
    this.loader = loader
    console.log('我是loader:', loader)
  }



  async upload() {
    let formData = new FormData();

    console.log('loaderFile', await this.loader.file)

    formData.append('uploadfile', await this.loader.file);


    console.log(formData)
    console.log(formData.entries())

    // 遍歷FormData對象,查看是否有存進去
    for (let pair of formData.entries()) {
      // 如果值是一個File對象，則打印文件的詳細信息
      if (pair[1] instanceof File) {
        console.log(pair[0] + ', File:');
        console.log('    Name:', pair[1].name);
        console.log('    Size:', pair[1].size);
        console.log('    Type:', pair[1].type);
      } else {
        // 如果不是文件，則直接打印鍵值對
        console.log(pair[0] + ', ' + pair[1]);
      }
    }
    const res = request('/api/upload', {
      method: 'POST',
      body: formData,
    });
    console.log(res)

    return { default: "https://miro.medium.com/v2/resize:fit:582/1*4j2A9niz0eq-mRaCPUffpg.png" };

    // try {
    //   const res = await request('/api/upload', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   // 假设上传结果为JSON格式，含有url字段
    //   if (res && res.url) {
    //     return { default: res.url };
    //   } else {
    //     throw new Error('上传失败，未返回有效的URL');
    //   }
    // } catch (error) {
    //   throw new Error(error); // 抛出包含错误信息的对象
    // }
  }

  abort() {
    // Implement abort logic here if needed for Nuxt.js
    // For example, you might need to cancel any ongoing $fetch request
  }


  // async upload() {
  //   const { fileUpload } = 'api' //上传的接口

  //   let formData = new FormData()
  //   formData.append('uploadfile', await this.loader.file)

  //   formData.append('filePath', this.filePath)//存储到服务器的路径


  //   let config = {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   }

  //   return new Promise(async (resolve, reject) => {
  //     fileUpload(formData, config)
  //       .then(async res => {

  //         //注意这里的resolve的内容一定要是一个对象，而且一定要有一个default设置为图片上传后的url，这是ckeditor的规定格式。这里后端返回的路径一定是一个图片全路径，不然回显不了。但是这会涉及到，换了个服务器地址，已经存在数据库的图片显示不出来，不通用。
  //         //可以让后端进行代理转发解决这个问题，类似于跨域的解决。存储的图片地址不写完整的路径，就是这里的url只有/image,后端代理转发到真正的服务器地址。


  //         resolve({ default: res.url|| '' })
  //       })
  //       .catch(err => {
  //         reject('錯誤信息為',err)
  //       })
  //   })
  // }
}



*/