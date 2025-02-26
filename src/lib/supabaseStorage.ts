import { supabase } from './supabase';

/**
 * Upload a file to Supabase Storage
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @param file The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  try {
    // Check if the bucket exists, create it if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
      });
    }
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Get the public URL of a file in Supabase Storage
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @returns The public URL of the file
 */
export function getFileUrl(bucket: string, path: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return publicUrl;
} 