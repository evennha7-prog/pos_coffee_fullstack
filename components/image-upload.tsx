"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage } from "@/lib/api/upload"
import {
  IconUpload,
  IconPhoto,
  IconLink,
  IconTrash,
  IconLoader2,
  IconCheck,
  IconSparkles,
} from "@tabler/icons-react"

// Curated high quality food & beverage presets for quick 1-click selection
export const PRESET_IMAGES = [
  {
    name: "Smoked Bacon / សាច់ជ្រូកបេខុន",
    url: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80",
    category: "Meat",
  },
  {
    name: "Roasted Whole Chicken / មាន់ស្រែមួយក្បាល",
    url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80",
    category: "Meat",
  },
  {
    name: "Chicken Breast / ទ្រូងមាន់អត់ឆ្អឹង",
    url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80",
    category: "Meat",
  },
  {
    name: "Fresh Beef Steak / សាច់គោស្រស់",
    url: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80",
    category: "Meat",
  },
  {
    name: "Pork Ribs / ឆ្អឹងជំនីជ្រូក",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    category: "Meat",
  },
  {
    name: "Iced Caramel Macchiato",
    url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
    category: "Coffee",
  },
  {
    name: "Hot Espresso",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    category: "Coffee",
  },
  {
    name: "Iced Americano",
    url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80",
    category: "Coffee",
  },
  {
    name: "Matcha Latte",
    url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
    category: "Tea",
  },
  {
    name: "Butter Croissant",
    url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
    category: "Pastries",
  },
]

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value = "", onChange, label = "Product Image" }: ImageUploadProps) {
  const [tab, setTab] = useState<"file" | "url" | "presets">("file")
  const [isUploading, setIsUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const res = await uploadImage(file)
      if (res.success && res.imageUrl) {
        onChange(res.imageUrl)
      } else {
        setUploadError(res.error || "Failed to upload image")
      }
    } catch (err: any) {
      setUploadError(err.message || "Upload error")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
    }
  }

  const isImageValid = Boolean(value && (value.startsWith("http") || value.startsWith("/upload") || value.startsWith("/")))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10"
          >
            <IconTrash className="h-3 w-3 mr-1" /> Remove
          </Button>
        )}
      </div>

      {/* Preview Area */}
      {isImageValid && (
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-border bg-slate-100 dark:bg-muted group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Product Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              // fallback if broken
              e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="text-xs font-semibold text-white bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
              Current Image
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/60 rounded-lg border border-border/50 text-xs">
        <button
          type="button"
          onClick={() => setTab("file")}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            tab === "file"
              ? "bg-background text-foreground shadow-2xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconUpload className="h-3.5 w-3.5" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab("presets")}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            tab === "presets"
              ? "bg-background text-foreground shadow-2xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconSparkles className="h-3.5 w-3.5 text-amber-500" /> Presets
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            tab === "url"
              ? "bg-background text-foreground shadow-2xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IconLink className="h-3.5 w-3.5" /> Image Link
        </button>
      </div>

      {/* Tab: File Upload */}
      {tab === "file" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            id="product-image-file-input"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 transition-colors rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px]"
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs text-primary font-medium">
                <IconLoader2 className="h-4 w-4 animate-spin" />
                <span>Uploading image to server...</span>
              </div>
            ) : (
              <>
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
                  <IconPhoto className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold text-foreground">Click to upload product photo</p>
                <p className="text-[11px] text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
              </>
            )}
          </div>
          {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
        </div>
      )}

      {/* Tab: Presets */}
      {tab === "presets" && (
        <div className="space-y-2">
          <p className="text-[11px] text-muted-foreground">Select a delicious food or coffee preset:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {PRESET_IMAGES.map((preset, idx) => {
              const isSelected = value === preset.url
              return (
                <div
                  key={idx}
                  onClick={() => onChange(preset.url)}
                  className={`relative flex items-center gap-2 p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="h-10 w-10 rounded-md object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{preset.name}</p>
                    <span className="text-[10px] text-muted-foreground">{preset.category}</span>
                  </div>
                  {isSelected && (
                    <IconCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0 mr-1" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab: Image Link */}
      {tab === "url" && (
        <div className="flex gap-2">
          <Input
            placeholder="Paste image URL (e.g. https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="text-xs h-9"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleApplyUrl}
            className="h-9 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  )
}
