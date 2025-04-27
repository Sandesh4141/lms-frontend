import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="w-full px-6 py-4 border-b border-border flex justify-between items-center sticky top-0 bg-background/90 backdrop-blur z-10">
        <h1 className="text-xl md:text-2xl font-semibold">Learnify LMS</h1>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="default">Login</Button>
          </Link>
          <ModeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Empowering Education with Technology
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6">
          Manage students, teachers, courses and everything in one place. A
          modern LMS built for smart institutions.
        </p>
        <Link to="/login">
          <Button size="lg">Get Started</Button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-sm text-muted-foreground text-center py-6">
        © {new Date().getFullYear()} Learnify lms. All rights reserved.
      </footer>
    </div>
  );
}
