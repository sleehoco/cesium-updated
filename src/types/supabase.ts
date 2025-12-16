/**
 * Supabase Database Type Definitions
 * This file will be auto-generated from your database schema
 * For now, we define a basic structure
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      threat_analyses: {
        Row: {
          id: string;
          user_id: string;
          ioc_type: 'ip' | 'domain' | 'url' | 'hash';
          ioc_value: string;
          analysis_result: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ioc_type: 'ip' | 'domain' | 'url' | 'hash';
          ioc_value: string;
          analysis_result: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ioc_type?: 'ip' | 'domain' | 'url' | 'hash';
          ioc_value?: string;
          analysis_result?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'threat_analyses_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      security_logs: {
        Row: {
          id: string;
          user_id: string;
          log_content: string;
          analysis_result: Json | null;
          severity: 'low' | 'medium' | 'high' | 'critical' | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          log_content: string;
          analysis_result?: Json | null;
          severity?: 'low' | 'medium' | 'high' | 'critical' | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          log_content?: string;
          analysis_result?: Json | null;
          severity?: 'low' | 'medium' | 'high' | 'critical' | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'security_logs_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      ioc_type: 'ip' | 'domain' | 'url' | 'hash';
      severity_level: 'low' | 'medium' | 'high' | 'critical';
    };
    CompositeTypes: Record<string, never>;
  };
}
