import { profile } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}
        </p>
        <div className="flex gap-6">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors duration-300 hover:text-paper"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors duration-300 hover:text-paper"
          >
            LinkedIn
          </a>
          <a
            href={profile.twitter}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors duration-300 hover:text-paper"
          >
            X
          </a>
          <a href={`mailto:${profile.email}`} className="transition-colors duration-300 hover:text-paper">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
