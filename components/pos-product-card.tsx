"use client"

import { Product } from "@/lib/api"
import { cn } from "@/lib/utils"

interface POSProductCardProps {
  product: Product
  cartQty?: number
  onSelect: (product: Product) => void
}

export function POSProductCard({ product, cartQty = 0, onSelect }: POSProductCardProps) {
  const stock = Number(product.current_stock !== undefined ? product.current_stock : product.stock || 0)
  const price = Number(product.sale_price || product.price || 0)
  const costPrice = Number(product.cost_price || 0)
  const isOutOfStock = stock <= 0
  const hasDiscount = costPrice > 0 && costPrice > price

  // Format SKU Code nicely (e.g. SKU-1190 or SKU-000001)
  const skuCode = product.code ? (product.code.startsWith("SKU-") ? product.code : `SKU-${product.code}`) : `SKU-${product.id}`

  // Determine image source or fallback
  const isImageValid = Boolean(
    product.image_url &&
      (product.image_url.startsWith("http") ||
        product.image_url.startsWith("/upload") ||
        product.image_url.startsWith("/"))
  )

  const defaultPlaceholder = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
  const imageSrc = isImageValid ? product.image_url : defaultPlaceholder

  return (
    <div
      onClick={() => !isOutOfStock && onSelect(product)}
      className={cn(
        "group relative bg-white dark:bg-card border border-slate-200/90 dark:border-border/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer select-none",
        isOutOfStock
          ? "opacity-60 cursor-not-allowed grayscale-30"
          : "active:scale-[0.98] hover:border-emerald-500/40 dark:hover:border-emerald-500/40"
      )}
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-muted overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = defaultPlaceholder
          }}
        />

        {/* In-Cart Floating Indicator */}
        {cartQty > 0 && (
          <div className="absolute top-2 right-2 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-in zoom-in-75 duration-150">
            <span>+{cartQty}</span>
          </div>
        )}

        {/* Out of Stock Overlay Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
              អស់ស្តុក / Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Information Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* SKU Code */}
          <div className="text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono tracking-wide mb-1">
            {skuCode}
          </div>

          {/* Product Name (Khmer & English typography) */}
          <h3
            className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Stock Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-border/60 mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-1.5 min-w-0">
            {hasDiscount && (
              <span className="text-xs text-muted-foreground/70 line-through font-mono">
                ${costPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-sans">
              ${price.toFixed(2)}
            </span>
          </div>

          {/* Stock Pill Badge */}
          <div
            className={cn(
              "text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-md shrink-0 transition-colors",
              isOutOfStock
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80"
                : stock <= 15
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            )}
          >
            ចំនួន: {stock}
          </div>
        </div>
      </div>
    </div>
  )
}

export default POSProductCard
