import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { fetchUrl } from "../apis/people";
import { Person } from "./Person";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage, //is pageParam not null ?
    isFetching,
    isLoading,
    isError,
    error,
  }: any = useInfiniteQuery(
    "sw-species", // set query  key
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
  console.log(data);

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData: any) => {
          return pageData.results.map((species: any) => {
            return (
              <Species
                key={species.name}
                name={species.name}
                language={species.language}
                averageLifespan={species.average_lifespan}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
