export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: 'packs' | 'cards' | 'posters' | 'stickers';
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'upi' | 'card';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  trackingNumber?: string;
  notes?: string;
}

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FTX-849201',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@gmail.com',
    customerPhone: '+91 98201 44521',
    shippingAddress: 'B-402, Lotus Towers, Andheri West',
    city: 'Mumbai',
    pincode: '400053',
    items: [
      {
        id: 'pack-1',
        name: 'Match Attax 2024/25 Official Booster Pack',
        price: 199,
        quantity: 3,
        imageUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/Footenix_Store_Trading_Card_Packs.png?v=1790839312&width=1000',
        category: 'packs',
      },
      {
        id: 'card-1',
        name: 'Cristiano Ronaldo Panini Icon #372',
        price: 499,
        quantity: 1,
        imageUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/673754240.jpg?height=2400&v=1785043221',
        category: 'cards',
      },
    ],
    subtotal: 1096,
    shipping: 0,
    total: 1096,
    paymentMethod: 'upi',
    status: 'processing',
    createdAt: '2026-10-06T05:30:00Z',
    trackingNumber: 'DTDC-8930214',
  },
  {
    id: 'FTX-728190',
    customerName: 'Rohan Mehra',
    customerEmail: 'rohan.cards@outlook.com',
    customerPhone: '+91 98112 90123',
    shippingAddress: '42, Defence Colony, Ring Road',
    city: 'New Delhi',
    pincode: '110024',
    items: [
      {
        id: 'post-2',
        name: 'Erling Halland Celebration A5 poster for walls',
        price: 90,
        quantity: 2,
        imageUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsAppImage2026-09-29at20.10.24.jpg?v=1790698062&width=700',
        category: 'posters',
      },
      {
        id: 'post-1',
        name: 'Glue Dots For Football Posters',
        price: 75,
        quantity: 2,
        imageUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsAppImage2026-09-13at18.39.12.jpg?v=1789305472&width=700',
        category: 'posters',
      },
    ],
    subtotal: 330,
    shipping: 49,
    total: 379,
    paymentMethod: 'cod',
    status: 'pending',
    createdAt: '2026-10-06T04:15:00Z',
  },
  {
    id: 'FTX-619283',
    customerName: 'Priya Nambiar',
    customerEmail: 'priya.n@yahoo.co.in',
    customerPhone: '+91 97450 12890',
    shippingAddress: 'House 14, Panampilly Nagar',
    city: 'Kochi',
    pincode: '682036',
    items: [
      {
        id: 'stk-1',
        name: 'Lionel Messi 8th Ballon dOr Celebration Sticker',
        price: 35,
        quantity: 4,
        imageUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsAppImage2026-09-13at18.13.44.jpg?v=1789304371&width=700',
        category: 'stickers',
      },
      {
        id: 'stk-2',
        name: 'Cristiano Ronaldo Iconic SIUUU Celebration Sticker',
        price: 35,
        quantity: 4,
        imageUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsAppImage2026-09-13at18.13.54.jpg?v=1789304204&width=700',
        category: 'stickers',
      },
    ],
    subtotal: 280,
    shipping: 49,
    total: 329,
    paymentMethod: 'upi',
    status: 'shipped',
    createdAt: '2026-10-05T18:45:00Z',
    trackingNumber: 'BLUEDART-9012384',
  },
  {
    id: 'FTX-509124',
    customerName: 'Kabir Verma',
    customerEmail: 'kabir.v99@gmail.com',
    customerPhone: '+91 99031 77621',
    shippingAddress: 'Flat 6A, Salt Lake Sector 2',
    city: 'Kolkata',
    pincode: '700091',
    items: [
      {
        id: 'card-2',
        name: 'Lionel Messi 100 Club Gold Limited Edition Card',
        price: 349,
        quantity: 1,
        imageUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsApp_Image_2026-09-27_at_14.25.27.jpg?v=1790499453&width=1000',
        category: 'cards',
      },
      {
        id: 'pack-2',
        name: 'UEFA Champions League Chrome X Topps Booster Pack',
        price: 399,
        quantity: 2,
        imageUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsAppImage2026-09-28at22.06.26_1.jpg?v=1790613718&width=700',
        category: 'packs',
      },
    ],
    subtotal: 1147,
    shipping: 0,
    total: 1147,
    paymentMethod: 'upi',
    status: 'delivered',
    createdAt: '2026-10-04T11:20:00Z',
    trackingNumber: 'DELHIVERY-5629104',
  },
];
