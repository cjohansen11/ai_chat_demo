export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ai_character: {
        Row: {
          bio: string | null
          id: number
          name: string | null
        }
        Insert: {
          bio?: string | null
          id?: never
          name?: string | null
        }
        Update: {
          bio?: string | null
          id?: never
          name?: string | null
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          ai_character_id: number
          id: string
          message_id: string
          vector: string
        }
        Insert: {
          ai_character_id: number
          id?: string
          message_id: string
          vector: string
        }
        Update: {
          ai_character_id?: number
          id?: string
          message_id?: string
          vector?: string
        }
        Relationships: [
          {
            foreignKeyName: "embeddings_ai_character_id_fkey"
            columns: ["ai_character_id"]
            referencedRelation: "ai_character"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "embeddings_message_id_fkey"
            columns: ["message_id"]
            referencedRelation: "message"
            referencedColumns: ["id"]
          }
        ]
      }
      message: {
        Row: {
          ai_id: number | null
          embedding: string | null
          id: string
          message: string | null
          received: string | null
          sent_by_user: boolean | null
          user_id: string | null
        }
        Insert: {
          ai_id?: number | null
          embedding?: string | null
          id?: string
          message?: string | null
          received?: string | null
          sent_by_user?: boolean | null
          user_id?: string | null
        }
        Update: {
          ai_id?: number | null
          embedding?: string | null
          id?: string
          message?: string | null
          received?: string | null
          sent_by_user?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_ai_id_fkey"
            columns: ["ai_id"]
            referencedRelation: "ai_character"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_embedding_fkey"
            columns: ["embedding"]
            referencedRelation: "embeddings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      user: {
        Row: {
          created_at: string
          gamertag: string
          id: string
          last_login: string
        }
        Insert: {
          created_at?: string
          gamertag: string
          id?: string
          last_login?: string
        }
        Update: {
          created_at?: string
          gamertag?: string
          id?: string
          last_login?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_messages: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          message: string
          user_id: string
          ai_id: number
          sent_by_user: boolean
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
