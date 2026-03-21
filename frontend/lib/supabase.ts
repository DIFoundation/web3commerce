// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types generated from DB schema
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image_url: string
          seller_id: string
          stock: number
          status: 'active' | 'inactive'
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          buyer_address: string
          seller_id: string
          product_id: string
          quantity: number
          total_amount: number
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'refunded'
          tx_hash: string | null
          created_at: string
        }
      }
      sellers: {
        Row: {
          id: string
          user_id: string
          wallet_address: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
      }
    }
  }
}