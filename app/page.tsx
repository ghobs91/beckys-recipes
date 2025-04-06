import RecipeCollections from "../components/RecipeCollections";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Recipe Collections</h1>
        <RecipeCollections />
      </div>
    </main>
  );
}
