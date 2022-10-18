import axios from "axios";

export async function fetchPosts(page: number) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
  );

  console.log(response);

  return response.data;
}

export async function fetchComments(postId: any) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );

  console.log(response.data);

  return response.data;
}

export async function deletePost(postId: any) {
  const response = await axios.delete(
    `https://jsonplaceholder.typicode.com/postId/${postId}`
  );
  return response.data;
}

export async function updatePost(postId: any) {
  const response = await axios.patch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { title: "REACT QUERY FOREVER!!!!" }
  );
  return response.data;
}
