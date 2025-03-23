import { ModeToggle } from "@/components/mode-toggle";

function App() {
  return (
    <div className="bg-background text-foreground border-input flex flex-col items-center justify-center min-h-svh">
      <div>
        <h1 className="text-2xl font-bold text-center">Hello World </h1>
      </div>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos odit,
        voluptas cum a soluta culpa quis impedit laudantium officia doloremque
        accusantium. Sunt quas accusamus explicabo consectetur. Numquam, nihil!
        Porro, deserunt.
      </p>

      <ModeToggle />
    </div>
  );
}

export default App;
