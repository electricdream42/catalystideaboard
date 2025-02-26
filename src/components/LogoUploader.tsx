import { useState, useEffect } from 'react';
import { uploadFile, getFileUrl } from '../lib/supabaseStorage';
import { supabase } from '../lib/supabase';

interface LogoUploaderProps {
  onLogoChange?: (url: string) => void;
}

export default function LogoUploader({ onLogoChange }: LogoUploaderProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const BUCKET_NAME = 'app-assets';
  const LOGO_PATH = 'logos/cms-logo.png';
  
  useEffect(() => {
    // Check if logo already exists in Supabase
    checkExistingLogo();
  }, []);
  
  const checkExistingLogo = async () => {
    try {
      // Check if the file exists
      const { data } = await supabase.storage
        .from(BUCKET_NAME)
        .list('logos');
      
      const logoExists = data?.some(file => file.name === 'cms-logo.png');
      
      if (logoExists) {
        const url = getFileUrl(BUCKET_NAME, LOGO_PATH);
        setLogoUrl(url);
        if (onLogoChange) onLogoChange(url);
      }
    } catch (error) {
      console.error('Error checking for existing logo:', error);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size should be less than 2MB');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const url = await uploadFile(BUCKET_NAME, LOGO_PATH, file);
      setLogoUrl(url);
      if (onLogoChange) onLogoChange(url);
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      {logoUrl ? (
        <div className="relative group">
          <img 
            src={logoUrl} 
            alt="CMS Logo" 
            className="h-16 object-contain"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
            <label className="cursor-pointer text-white text-xs px-2 py-1 bg-purple-600 rounded">
              Change
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
          <label className="cursor-pointer">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Upload your logo</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 2MB</p>
              <button 
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Select Logo'}
              </button>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden"
            />
          </label>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
} 