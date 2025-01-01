export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dns_records: {
        Row: {
          created_at: string | null
          id: string
          priority: number | null
          record_type: Database["public"]["Enums"]["dns_record_type"]
          status: Database["public"]["Enums"]["dns_record_status"] | null
          subdomain: string
          target: string
          ttl: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority?: number | null
          record_type: Database["public"]["Enums"]["dns_record_type"]
          status?: Database["public"]["Enums"]["dns_record_status"] | null
          subdomain: string
          target: string
          ttl?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number | null
          record_type?: Database["public"]["Enums"]["dns_record_type"]
          status?: Database["public"]["Enums"]["dns_record_status"] | null
          subdomain?: string
          target?: string
          ttl?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      domains: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_featured: boolean | null
          name: string
          owner_id: string | null
          price: number
          status: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          owner_id?: string | null
          price: number
          status?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          owner_id?: string | null
          price?: number
          status?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string
          id: string
          is_default: boolean | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          type: string | null
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          type?: string | null
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          type?: string | null
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      smtp_settings: {
        Row: {
          created_at: string
          enabled: boolean | null
          from_email: string
          from_name: string
          host: string
          id: string
          password: string
          port: number
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean | null
          from_email: string
          from_name: string
          host: string
          id?: string
          password: string
          port: number
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          enabled?: boolean | null
          from_email?: string
          from_name?: string
          host?: string
          id?: string
          password?: string
          port?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          buyer_id: string | null
          created_at: string
          domain_id: string
          id: string
          payment_id: string | null
          payment_method: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id?: string | null
          created_at?: string
          domain_id: string
          id?: string
          payment_id?: string | null
          payment_method: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          created_at?: string
          domain_id?: string
          id?: string
          payment_id?: string | null
          payment_method?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          created_at: string
          id: string
          key: string
          language_code: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          language_code: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          language_code?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      dns_record_status: "active" | "pending" | "disabled"
      dns_record_type:
        | "A"
        | "AAAA"
        | "CNAME"
        | "MX"
        | "TXT"
        | "NS"
        | "SRV"
        | "CAA"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never