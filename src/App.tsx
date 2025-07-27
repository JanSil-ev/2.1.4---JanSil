import { useState, useEffect } from "react";
import "./App.scss";
import ky from "ky";

interface Post {
  id: number;
  title: string;
  body: string;
}

const App = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await ky
        .get("https://jsonplaceholder.typicode.com/posts")
        .json();
      setPosts(data as Post[]);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "error";
      setError(message);
      console.error("Ошибпка при загрузке постов:", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 5000);

    // debugger;
     //для проверки
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <h1>Posts:</h1>

      {loading && !posts.length && <p>Загрузка постов...</p>}
      {error && <p className="error">Ошибка: {error}</p>}

      <div className="posts-container">
        {posts.map((post) => (
          <article key={`post-${post.id}`} className="post">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default App;
