import Card from "../components/Card"
import reactLogo from "../assets/logos/react.svg"
import tailwindLogo from "../assets/logos/tailwind.svg"
import viteLogo from "../assets/logos/vite.svg"

function Frontpage() {
  return (
   <div className="mx-auto max-w-6xl text-center">
 <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
  Connecting to the World
</h1>

<p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
  Reusable components with React + Tailwind.
</p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  <Card
    title="React"
    description="Build component-based UIs with a modern library."
    imageUrl={reactLogo}
    href="https://react.dev"
  />

  <Card
    title="Tailwind"
    description="Utility-first CSS for fast, clean UI design."
    imageUrl={tailwindLogo}
    href="https://tailwindcss.com/docs"
  />

  <Card
    title="Vite"
    description="Lightning-fast dev server and build tool."
    imageUrl={viteLogo}
    href="https://vitejs.dev/guide/"
  />
</div>
      </div>
    
  )
}

export default Frontpage

