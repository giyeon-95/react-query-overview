import axios from "axios";

export async function fetchUrl(url: string) {
  const response = await axios(url);

  return response.data;
}
