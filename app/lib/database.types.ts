// Placeholder so the app type-checks before Supabase is reachable. This
// file is generated, not hand-maintained -- once `supabase start` (or a
// linked remote project) is available, regenerate it with:
//
//   supabase gen types typescript --local > app/lib/database.types.ts
//
// and commit the result. Do not hand-edit table shapes here; edit the
// migration in supabase/migrations/ instead and regenerate.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
