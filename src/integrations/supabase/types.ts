export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          attachment_type: string | null
          attachment_url: string | null
          chat_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          read_at: string | null
          receiver_id: string
          receiver_type: string
          sender_id: string
          sender_type: string
        }
        Insert: {
          attachment_type?: string | null
          attachment_url?: string | null
          chat_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          read_at?: string | null
          receiver_id: string
          receiver_type: string
          sender_id: string
          sender_type: string
        }
        Update: {
          attachment_type?: string | null
          attachment_url?: string | null
          chat_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          read_at?: string | null
          receiver_id?: string
          receiver_type?: string
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_chat_messages_chat_id"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          last_message_at: string | null
          patient_id: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          last_message_at?: string | null
          patient_id: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          last_message_at?: string | null
          patient_id?: string
        }
        Relationships: []
      }
      diet_charts: {
        Row: {
          created_at: string
          generated_diet: Json | null
          id: string
          patient_id: string
        }
        Insert: {
          created_at?: string
          generated_diet?: Json | null
          id?: string
          patient_id: string
        }
        Update: {
          created_at?: string
          generated_diet?: Json | null
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_charts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_posts: {
        Row: {
          content: string
          created_at: string
          doctor_id: string
          id: string
        }
        Insert: {
          content: string
          created_at?: string
          doctor_id: string
          id?: string
        }
        Update: {
          content?: string
          created_at?: string
          doctor_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_posts_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          certifications: string | null
          created_at: string
          degree: string
          email: string
          experience_years: number
          id: string
          institution: string
          name: string
          profile_pic_url: string | null
          specialization: string
          theme_preference: string | null
        }
        Insert: {
          certifications?: string | null
          created_at?: string
          degree: string
          email: string
          experience_years: number
          id?: string
          institution: string
          name: string
          profile_pic_url?: string | null
          specialization: string
          theme_preference?: string | null
        }
        Update: {
          certifications?: string | null
          created_at?: string
          degree?: string
          email?: string
          experience_years?: number
          id?: string
          institution?: string
          name?: string
          profile_pic_url?: string | null
          specialization?: string
          theme_preference?: string | null
        }
        Relationships: []
      }
      food_logs: {
        Row: {
          created_at: string
          custom_food_calories: number | null
          custom_food_name: string | null
          date: string
          id: string
          patient_id: string
          quantity: number | null
          recipe_id: string | null
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_food_calories?: number | null
          custom_food_name?: string | null
          date: string
          id?: string
          patient_id: string
          quantity?: number | null
          recipe_id?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_food_calories?: number | null
          custom_food_name?: string | null
          date?: string
          id?: string
          patient_id?: string
          quantity?: number | null
          recipe_id?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_logs_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      gyan_modules: {
        Row: {
          content_html: string
          created_at: string
          id: string
          image_url: string | null
          order_index: number | null
          title: string
          topic: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content_html: string
          created_at?: string
          id?: string
          image_url?: string | null
          order_index?: number | null
          title: string
          topic?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content_html?: string
          created_at?: string
          id?: string
          image_url?: string | null
          order_index?: number | null
          title?: string
          topic?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      gyan_progress: {
        Row: {
          completed_at: string
          id: string
          module_id: string
          patient_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          module_id: string
          patient_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          module_id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gyan_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "gyan_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
          user_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
          user_type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          age: number
          created_at: string
          email: string
          food_preferences: string | null
          food_restrictions: string | null
          gender: string
          height: number | null
          id: string
          medical_history: string | null
          name: string
          profile_pic_url: string | null
          theme_preference: string | null
          weight: number | null
        }
        Insert: {
          age: number
          created_at?: string
          email: string
          food_preferences?: string | null
          food_restrictions?: string | null
          gender: string
          height?: number | null
          id?: string
          medical_history?: string | null
          name: string
          profile_pic_url?: string | null
          theme_preference?: string | null
          weight?: number | null
        }
        Update: {
          age?: number
          created_at?: string
          email?: string
          food_preferences?: string | null
          food_restrictions?: string | null
          gender?: string
          height?: number | null
          id?: string
          medical_history?: string | null
          name?: string
          profile_pic_url?: string | null
          theme_preference?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      recipe_favorites: {
        Row: {
          created_at: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_favorites_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          author_id: string | null
          calories_per_serving: number | null
          cooking_time_minutes: number | null
          created_at: string
          cuisine: string | null
          description: string | null
          diet_type: string | null
          difficulty_level: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          instructions: string | null
          rasa: string | null
          title: string
        }
        Insert: {
          author_id?: string | null
          calories_per_serving?: number | null
          cooking_time_minutes?: number | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          diet_type?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          instructions?: string | null
          rasa?: string | null
          title: string
        }
        Update: {
          author_id?: string | null
          calories_per_serving?: number | null
          cooking_time_minutes?: number | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          diet_type?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          instructions?: string | null
          rasa?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
