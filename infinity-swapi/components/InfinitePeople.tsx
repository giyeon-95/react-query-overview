import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { fetchUrl } from "../apis/people";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage, //is pageParam not null ?
    isFetching,
    isLoading,
    isError,
    error,
  }: any = useInfiniteQuery(
    "sw-people", // set query  key
    ({ pageParam = initialUrl }) => {
      console.log("@@", pageParam);

      return fetchUrl(pageParam);
    }, //set fetchAPI, init pageParam
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined, //update pageParam(swapi res -> next)
    }
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error! {error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData: any) => {
          return pageData.results.map((person: any) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
