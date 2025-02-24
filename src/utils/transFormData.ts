/**
 * 用於轉換無類別文章，將數據轉為子組件需要的分頁對象, 主要是後端的主鍵id 要轉成前端通用的id, 
 * @param response Java mybatis plus IPage對象的返回值
 * @param primaryKeyName 後端實際傳來的主鍵名
 */
export function transFormPaginationByArticle(response: any, primaryKeyName: any) {
  //傳入後端響應值,透過解構賦值,提取records(搜索資料) 和 其餘分頁資料
  const { records, ...paginationData } = response;
  //使用JS數組的map方法,她會開始遍歷數組,映射並重新組裝
  const transformedRecords = records.map((record: any) => {
    //每次拿到一筆資料,透過解構賦值,提取後端資料的articleId 和 其他數據資料; 
    // [primaryKeyName] 是使用計算屬性的方式,動態決定要解構的屬性,並重新賦予屬姓名,這邊直接取id
    const { [primaryKeyName]: id, ...rest } = record;
    //把主鍵名從articleId更換為id , 其餘數據資料不變動,組裝後返回 ; 
    //這邊注意一定要...rest返回其他key-value, 不然他會包裝成一個叫rest的key-value對象
    return {
      ...rest,
      id
    };
  });

  //這邊拿著重新組裝完原始資料的數據 和 其餘分頁資料,進行組裝後返回
  return {
    records: transformedRecords,
    ...paginationData
  };

}



export function transFormPaginationByFileCenter(response: any, primaryKeyName: any) {
  //傳入後端響應值,透過解構賦值,提取records(搜索資料) 和 其餘分頁資料
  const { records, ...paginationData } = response;
  //使用JS數組的map方法,她會開始遍歷數組,映射並重新組裝
  const transformedRecords = records.map((record: any) => {
    //每次拿到一筆資料,透過解構賦值,提取後端資料的articleId 和 其他數據資料; 
    // [primaryKeyName] 是使用計算屬性的方式,動態決定要解構的屬性,並重新賦予屬姓名,這邊直接取id
    const { [primaryKeyName]: id, ...rest } = record;
    //把主鍵名從articleId更換為id , 其餘數據資料不變動,組裝後返回 ; 
    //這邊注意一定要...rest返回其他key-value, 不然他會包裝成一個叫rest的key-value對象
    return {
      ...rest,
      id
    };
  });

  //這邊拿著重新組裝完原始資料的數據 和 其餘分頁資料,進行組裝後返回
  return {
    records: transformedRecords,
    ...paginationData
  };

}