import { useMutation, useQuery } from "react-query";
import { deletePost, fetchComments, updatePost } from "../apis/post";

interface PostDetailProps {
  post: any;
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
  const { data, isLoading, isError } = useQuery(["comments", post.id], () =>
    fetchComments(post.id)
  );

  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));

  if (isLoading || isError) return <div>LOADING..</div>;

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && <p style={{ color: "red" }}>Erorr</p>}
      {deleteMutation.isLoading && (
        <p style={{ color: "purple" }}>Deleting....</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>Delete Success!</p>
      )}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isError && <p style={{ color: "red" }}>Erorr</p>}
      {updateMutation.isLoading && (
        <p style={{ color: "purple" }}>Updating....</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: "green" }}>Update Success!</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment: any) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
};

export default PostDetail;
