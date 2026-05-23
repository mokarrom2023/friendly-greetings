import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/departments/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} Team — STARLINE BUILDERS LTD.` },
      {
        name: "description",
        content: `Meet the team behind our ${params.slug} department at Starline Builders.`,
      },
    ],
  }),
  component: DepartmentPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p>Department not found</p>
    </div>
  ),
});

type Dept = { id: string; name: string; name_bn: string | null; slug: string };
type Member = {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
  sort_order: number;
};

async function fetchDept(slug: string) {
  const { data: dept, error: deptErr } = await supabase
    .from("departments")
    .select("id,name,name_bn,slug")
    .eq("slug", slug)
    .maybeSingle();
  if (deptErr) throw deptErr;
  if (!dept) throw notFound();
  const { data: members, error: memErr } = await supabase
    .from("team_members")
    .select("id,name,title,image_url,sort_order")
    .eq("department_id", dept.id)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (memErr) throw memErr;
  return { dept: dept as Dept, members: (members ?? []) as Member[] };
}

function DepartmentPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <TopBar />
          <Navbar />
          <main className="pt-24">
            <Content />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function Content() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["department", slug],
    queryFn: () => fetchDept(slug),
  });

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <Link
          to="/profile"
          hash="employees"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" /> Back to departments
        </Link>

        {isLoading && (
          <div className="mt-10 text-center text-muted-foreground">Loading…</div>
        )}
        {error && (
          <div className="mt-10 text-center text-destructive">
            Failed to load: {(error as Error).message}
          </div>
        )}
        {data && (
          <>
            <div className="mt-6 text-center">
              <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">
                Department
              </span>
              <h1
                className="mt-2 text-4xl font-bold sm:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {data.dept.name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {data.members.length} team member
                {data.members.length === 1 ? "" : "s"}
              </p>
            </div>

            {data.members.length === 0 ? (
              <div className="mx-auto mt-14 max-w-md rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  No team members yet. Admin can add them from /admin.
                </p>
              </div>
            ) : (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.members.map((m) => (
                  <div
                    key={m.id}
                    className="group rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-brand hover:shadow-lg"
                  >
                    {m.image_url ? (
                      <img
                        src={m.image_url}
                        alt={m.name}
                        loading="lazy"
                        className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-brand/20"
                      />
                    ) : (
                      <div
                        className="mx-auto flex h-32 w-32 items-center justify-center rounded-full text-3xl font-bold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--primary), var(--brand))",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {m.name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                    <div
                      className="mt-5 text-lg font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {m.name}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand">
                      {m.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
