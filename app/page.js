export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white ">
      <section className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-[#121212] text-center">
        <h1 className="text-5xl font-bold mb-6 text-white">
          DebtMaster
        </h1>
        <p className="text-lg max-w-xl text-gray-300 mb-8">
          A simple and powerful way to manage credit and payments for your hardware store. Track debts, send reminders, and stay organized.
        </p>
        <div className="flex gap-4">
          <a href="/register" className="px-6 py-3 bg-white text-black font-medium  hover:bg-gray-200 transition">
            Register
          </a>
          <a href="/login" className="px-6 py-3 border border-gray-500 text-gray-300 font-medium  hover:border-white transition">
            Login
          </a>
        </div>
      </section>


    </main>
  );
}
