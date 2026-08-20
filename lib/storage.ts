import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We use the service role key to bypass RLS for server-side operations, 
// though image upload from client to server action to supabase is safe as long as we check auth.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase credentials missing. Image uploads will fail.");
}

// Create a single supabase client for interacting with storage
// Note: We expect the bucket 'product-images' to exist in Supabase and be configured with public read access.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Uploads a file to Supabase Storage in the 'product-images' bucket.
 * Uses the service role key, so it bypasses RLS (assuming it's called from a secure server action).
 * 
 * @param file The file to upload
 * @returns The public URL of the uploaded image
 * @throws Error if upload fails
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Storage credentials missing.");
  }

  // Generate a unique filename using timestamp and a random string to prevent collisions
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  
  const { data, error } = await supabase
    .storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    throw new Error(`Gagal mengunggah gambar: ${error.message}`);
  }

  // Retrieve public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('product-images')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
