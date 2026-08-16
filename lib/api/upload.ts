// lib/api/upload.ts
export async function uploadImage(file: File): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("imageUrl", file);

    const res = await fetch("/api/v1/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.error || data.message || `Upload failed with status ${res.status}`,
      };
    }

    if (data.success && data.filename) {
      return {
        success: true,
        imageUrl: `/upload/${data.filename}`,
      };
    }

    return {
      success: false,
      error: data.error || data.message || "Failed to upload image",
    };
  } catch (error: any) {
    console.error("Image upload error:", error);
    return {
      success: false,
      error: error.message || "Network error while uploading image",
    };
  }
}

export async function deleteUploadedImage(filename: string): Promise<boolean> {
  try {
    const cleanName = filename.replace(/^\/upload\//, "");
    const res = await fetch(`/api/v1/upload/${cleanName}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    return !!data.success;
  } catch (error) {
    console.error("Delete image error:", error);
    return false;
  }
}
