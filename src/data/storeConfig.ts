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
}

export const INITIAL_STORE_CONFIG: StoreBannerConfig = {
  heroBannerUrl:
    'https://footenix-store-2.myshopify.com/cdn/shop/files/crop-safer-match-attax-banner.png?v=1790839358&width=1920',
  paniniBannerUrl:
    'https://footenix-store-2.myshopify.com/cdn/shop/files/673754240.jpg?height=2400&v=1785043221',
  stickersBannerUrl: '',
  postersBannerUrl: '',
  showPaniniBanner: false, // Default false as requested: "Unka banner mat rakhna mein rakunga panini , stickers and posters oa"
  showStickersBanner: false,
  showPostersBanner: false,
  announcementText: 'SHOP FOR 2500 GET 1 CHROME X TOPPS FREE',
  freeShippingThreshold: 499,
  freeGiftThreshold: 2500,
  codEnabled: true,
  supportPhone: '+91 98765 43210',
  supportEmail: 'contact@footenixstore.com',
};
