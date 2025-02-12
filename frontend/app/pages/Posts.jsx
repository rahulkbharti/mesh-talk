import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/api";

const Posts = () => {
    const { data: posts, error, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching posts</p>;

    return (
        <div>
            <h2>Blog Posts</h2>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Posts;