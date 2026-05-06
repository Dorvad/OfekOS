
Project name: OfekOS.

This is a role-based digital learning platform for a management development program. The product is not a generic LMS. It should feel like a guided professional development journey.

Primary user roles:
1. Participant
2. Direct Manager
3. Facilitator
4. Admin / Program Owner

Core product modules:
- Participant journey dashboard
- Session pages
- Digital workbook / personal management portfolio
- AI simulation space
- Manager support dashboard
- Facilitator cohort dashboard
- Admin dashboard
- Resources library
- Basic analytics

Design direction:
- Modern B2B SaaS
- Clean and professional
- Mobile-first
- Calm and premium
- Card-based interface
- Clear hierarchy
- Avoid childish gamification
- Avoid generic school-like LMS design

Technical stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase for auth and database
- Vercel deployment

Important privacy rule:
Participant reflections are private by default. Managers can only see completion status, explicitly shared outputs, manager conversation prompts, and validation tasks. Facilitators and admins can see operational and aggregated progress data.

Development rules:
- Use TypeScript strictly.
- Keep components reusable.
- Use clear folder structure.
- Prefer simple, functioning implementation over over-engineered abstractions.
- Make the prototype work with mock data first, then connect to Supabase.
- Every major feature should have a clear user-facing route.
- Keep the UI responsive and mobile-first.
