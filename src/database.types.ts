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
          ai_character_id: number | null
          id: string
          vector: string | null
        }
        Insert: {
          ai_character_id?: number | null
          id?: string
          vector?: string | null
        }
        Update: {
          ai_character_id?: number | null
          id?: string
          vector?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "embeddings_ai_character_id_fkey"
            columns: ["ai_character_id"]
            referencedRelation: "ai_character"
            referencedColumns: ["id"]
          }
        ]
      }
      message: {
        Row: {
          ai_id: number
          id: string
          message: string
          received: string
          sent_by_user: boolean
          user_id: string
        }
        Insert: {
          ai_id: number
          id?: string
          message: string
          received?: string
          sent_by_user: boolean
          user_id: string
        }
        Update: {
          ai_id?: number
          id?: string
          message?: string
          received?: string
          sent_by_user?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_ai_id_fkey"
            columns: ["ai_id"]
            referencedRelation: "ai_character"
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
      get_embeddings:
        | {
            Args: {
              input_vector: string
            }
            Returns: {
              ai_character_id: number | null
              id: string
              vector: string | null
            }[]
          }
        | {
            Args: {
              input_vector: string
            }
            Returns: {
              ai_character_id: number | null
              id: string
              vector: string | null
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
