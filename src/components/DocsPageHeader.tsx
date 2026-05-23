import { ArrowRight } from "lucide-react";

interface ActionLink {
  href: string;
  label: string;
  external?: boolean;
}

interface DocsPageHeaderProps {
  badge: string;
  title: string;
  description: string;
  ctaLinks?: ActionLink[];
}

export default function DocsPageHeader({ badge, title, description, ctaLinks = [] }: DocsPageHeaderProps) {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="rounded-[40px] overflow-hidden border border-slate-200/70 bg-white shadow-xl shadow-slate-200/30">
        <div className="h-1 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />
        <div className="px-8 py-10 md:px-12 md:py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 text-indigo-600 text-[11px] font-black uppercase tracking-[0.35em] shadow-sm border border-indigo-600/15">
                {badge}
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  {title}
                </h1>
                <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {ctaLinks.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 mt-4 md:mt-0">
                {ctaLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : "_self"}
                    rel={link.external ? "noreferrer noopener" : undefined}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-black text-white uppercase tracking-widest transition duration-200 hover:bg-slate-800"
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
