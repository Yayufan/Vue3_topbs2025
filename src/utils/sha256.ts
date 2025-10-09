import request from "@/utils/request";
import fileRequest from "@/utils/largeFileRequest";

export async function hashFile(file: File) {
  let startTime = new Date().getTime();
  const chuckSize = 10 * 1024 * 1024; // 10 MB

  // 初始化 chunk array 用於存放分割的文件
  const chunks: Blob[] = [];

  for (let start = 0; start < file.size; start += chuckSize) {
    const chunk = file.slice(start, start + chuckSize);

    // 將 chunk 的 name 設置為文件名加上當前的起始位置
    Object.defineProperty(chunk, "name", {
      value: `${file.name}.${start}`,
      writable: false,
    });

    // 將 chunk 添加到 chunks 陣列中
    chunks.push(chunk);
  }

  /**
   * 使用 SubtleCrypto API 進行 SHA-256 哈希計算
   */
  const hashPromises = chunks.map(async (chunk) => {
    // 將 chunks 陣列中的每個 chunk 轉換為 ArrayBuffer
    const buffer = await readBinaryFile(chunk);
    // 使用 SubtleCrypto API 進行 SHA-256 哈希計算
    return window.crypto.subtle.digest("SHA-256", buffer as ArrayBuffer);
  });

  // 等待所有的哈希計算完成
  // hashBuffers 是一個 ArrayBuffer 陣列，包含了每個 chunk 的哈希值
  const hashBuffers = await Promise.all(hashPromises);

  // 初始化 finalHashBuffer 將所有的 ArrayBuffer 連接在一起
  let finalHashBuffer = new ArrayBuffer(0);
  for (const hashBuffer of hashBuffers) {
    finalHashBuffer = concatenateBuffers(finalHashBuffer, hashBuffer);
  }

  // 將連接完成後的 ArrayBuffer 進行 SHA-256 哈希計算
  const finalHash = await window.crypto.subtle.digest(
    "SHA-256",
    finalHashBuffer
  );
  // 將最終的哈希值轉換為 Uint8Array
  // 並轉換為十六進制字符串
  const hashArray = new Uint8Array(finalHash);
  const hash = arrayBufferToHex(hashArray);


  // 帶著 hash 去後端查詢是否存在該文件, 回傳 true 或 false
  // let res = await slideCheck(hash);

  let res = {
    hash: hash,
    chunks: chunks,
    file: file,
  };

  return res;

  // if (!res.data.exist) {

  //   const MAX_CONCURRENT = 5; // 設置最大併發數量
  //   const uploadChunk = async (chunk: Blob, index: number) => {
  //     // 設置要回傳的 chunk info
  //     const data = {
  //       fileName: file.name,
  //       fileType: file.type,
  //       fileSha256: hash,
  //       chunkIndex: index,
  //       totalChunks: chunks.length,
  //     };

  //     const formData = new FormData();
  //     formData.append("file", chunk);
  //     formData.append("data", JSON.stringify(data));
  //     await slideUpload(formData);
  //   };

  //   // 將 chunks 陣列中的每個 chunk 轉換為 Promise
  //   const uploadTasks = chunks.map(
  //     (chunk, index) => () => uploadChunk(chunk, index)
  //   );
  //   await limitConcurrency(uploadTasks, MAX_CONCURRENT);
  // } else {
  //   let baseUrl = import.meta.env.VITE_MINIO_API_URL;
  //   let url = `${baseUrl}/topbs2025/${res.data.path}`;
  //   window.open(url, "_blank");
  // }

  // return hash;
}

/**
 * 將 Blob 轉換為 ArrayBuffer
 * @param blob 傳入 Blob 對象 (chunks)
 * @returns
 */
async function readBinaryFile(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader 執行後掛載的結果在 result 屬性上
      resolve(new Uint8Array(reader.result as ArrayBuffer));
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * 將兩個 ArrayBuffer 連接在一起
 * @param buffer1 第一個 ArrayBuffer
 * @param buffer2 第二個 ArrayBuffer
 * @returns 連接後的 ArrayBuffer
 */
function concatenateBuffers(
  buffer1: ArrayBuffer,
  buffer2: ArrayBuffer
): ArrayBuffer {
  let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}

/**
 * 轉換為十六進制字符串
 * @param buffer Uint8Array (連接後的 ArrayBuffer)
 * @returns
 */
function arrayBufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function slideCheck(data: string) {
  let res = await request({
    url: "/paper/slide-check",
    method: "get",
    params: {
      sha256: data,
    },
  });
  return res;
}

export async function slideUpload(
  checkResult: any,
  file: File,
  hash: string,
  chunks: Blob[],
  percentage: Ref<number>
) {
  if (!checkResult.data.exist) {

    const MAX_CONCURRENT = 5; // 設置最大併發數量
    const uploadChunk = async (chunk: Blob, index: number) => {
      // 設置要回傳的 chunk info
      const data = {
        fileName: file.name,
        fileType: file.type,
        fileSha256: hash,
        chunkIndex: index,
        totalChunks: chunks.length,
      };

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("data", JSON.stringify(data));
      if (data == null) {
      }
      await slideUploadApi(formData);
    };

    // 將 chunks 陣列中的每個 chunk 轉換為 Promise
    const uploadTasks = chunks.map(
      (chunk, index) => () => uploadChunk(chunk, index)
    );
    await limitConcurrency(uploadTasks, MAX_CONCURRENT, percentage);
    percentage.value = 100; // 上傳完成後設置為 100%
  } else {
    percentage.value = 100;
    let baseUrl = import.meta.env.VITE_MINIO_API_URL;
    let url = `${baseUrl}/topbs2025/${checkResult.data.path}`;
    window.open(url, "_blank");
  }
}

function slideUploadApi(data: any) {
  return fileRequest({
    url: "/paper/slide-upload",
    method: "post",
    data,
  });
}

/**
 *
 * @param tasks 要執行的 Promise 陣列
 * @param maxConcurrent  最大併發數量
 */
function limitConcurrency(
  tasks: (() => Promise<void>)[],
  maxConcurrent: number,
  percentage: Ref<number>
) {
  const results: Promise<void>[] = []; // 用於存儲所有的 Promise
  let index = 0; // 當前執行的任務索引
  let completedTasks = 0;

  // 在完成一個任務後，開始下一個任務
  const next = async () => {
    while (index < tasks.length) {
      const taskIndex = index++;
      await tasks[taskIndex]();
      completedTasks++;
      percentage.value = Math.floor((completedTasks / tasks.length) * 89) + 10; // 加上初始的 10%
    }
  };

  for (let i = 0; i < Math.min(maxConcurrent, tasks.length); i++) {
    results.push(next());
  }
  return Promise.all(results);
}
