export interface CategoryConfigItem {
  id: 'packs' | 'cards' | 'panini' | 'stickers' | 'posters';
  name: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  thumbUrl: string;
}

export interface StoreBannerConfig {
  heroBannerUrl: string;
  paniniBannerUrl: string;
  stickersBannerUrl: string;
  postersBannerUrl: string;
  showPaniniBanner: boolean;
  showStickersBanner: boolean;
  showPostersBanner: boolean;
  announcementText: string;
  freeShippingThreshold: number;
  freeGiftThreshold: number;
  codEnabled: boolean;
  supportPhone: string;
  supportEmail: string;
  storeName: string;
  storeDescription: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  activePromoCode: string;
  activePromoDiscountType: 'percentage' | 'fixed';
  activePromoDiscountValue: number;
  shippingRate: number;
}
