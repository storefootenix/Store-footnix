export interface Product {
  id: string;
  name: string;
  category: 'packs' | 'cards' | 'posters' | 'stickers';
  price: number;
  originalPrice?: number;
  imageType: 'glue_dots' | 'poster_haaland' | 'poster_mbappe' | 'poster_ronaldo' | 'poster_madrid' | 'poster_messi' | 'sticker_messi' | 'sticker_sui' | 'sticker_neymar' | 'sticker_united' | 'sticker_anime' | 'sticker_madrid' | 'card_ronaldo_icon' | 'card_messi_gold' | 'card_bellingham_rookie' | 'pack_match_attax' | 'pack_champions_league' | 'pack_cricket_attax' | 'pack_pokemon';
  imageUrl?: string;
  description: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  specs: {
    dimensions?: string;
    condition?: string;
    finish?: string;
    series?: string;
    authenticity?: string;
  };
}
