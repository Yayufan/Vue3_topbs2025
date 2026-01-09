export interface PutArticleInterface {
  articleId: string;
  groupType: string;
  type: string;
  title: string;
  description: string | null;
  announcementDate: string;
  content: string;
  tempUploadUrl: string[];
}