import { useEffect, useState } from "react";

interface PasswordResponse {
  random_password: string;
}

function App() {
  const [length, setLength] = useState<number>(16);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PasswordResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const base_url = `${import.meta.env.VITE_BASE_URL}?length=${length}`;
  const api_key = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await fetch(base_url, {
          method: "GET",
          headers: { "X-Api-Key": api_key },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: PasswordResponse = await response.json();
        setData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPasswords();
  }, [base_url]);

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setLength(Number(value));
  };

  const handleCopy = async (): Promise<void> => {
    if (data && data.random_password) {
      try {
        await navigator.clipboard.writeText(data.random_password);
        alert("Password copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen p-4">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <section className="w-full max-w-lg border border-gray-300 rounded-lg p-6 bg-white shadow-lg">
          <div className="mb-4">
            <label
              htmlFor="length"
              className="block text-sm font-medium text-gray-700"
            >
              Password Length:
            </label>
            <input
              id="length"
              type="number"
              value={length}
              onChange={handleLengthChange}
              className="mt-1 block w-full border border-gray-300 py-1 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div className="overflow-x-auto mb-4">
            {data ? (
              <p className="text-lg font-semibold text-gray-900 whitespace-nowrap overflow-x-auto">
                {data.random_password}
              </p>
            ) : (
              <p className="text-gray-600">No data available</p>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Copy to Clipboard
          </button>
        </section>
      )}
    </main>
  );
}

export default App;
