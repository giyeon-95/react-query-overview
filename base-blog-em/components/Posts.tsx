import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { fetchPosts } from "../apis/post";
import PostDetail from "./PostDetail";

const MAX_POST_PAGE = 10;

const Posts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();

  //!prefetch nextpage
  useEffect(() => {
    if (currentPage < MAX_POST_PAGE) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  const { data, isError, isLoading }: any = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      keepPreviousData: true, //! 페칭하는 동안 기존데이터유지
    }
  );

  if (isLoading) return <h3>LOADING...</h3>;
  if (isError) return <h3>ERROR...</h3>;
  return (
    <>
      <ul>
        {data.map((post: any) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= MAX_POST_PAGE}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
};

export default Posts;
